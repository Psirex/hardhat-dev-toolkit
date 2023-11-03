"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedKeystoreStorage = exports.NamedKeystore = exports.NamedKeystoreService = void 0;
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const promises_1 = __importDefault(require("fs/promises"));
const ethers_1 = require("ethers");
const common_1 = require("../common");
class NoKeystoreError extends Error {
    constructor() {
        super(`Accounts not found. Aborting...`);
    }
}
class AccountRemovalFailed extends Error {
    constructor(name) {
        super(`The removal of account ${name} wasn't successfully finished`);
    }
}
class KeystoreNotFoundError extends Error {
    constructor(name) {
        super(`Account ${name} not found`);
    }
}
class AccountUnlockError extends Error {
    constructor() {
        super("Error on account unlock. Please, make sure that correct password was used. Aborting...");
    }
}
class AccountAlreadyExistsError extends Error {
    constructor(account) {
        super(`Account with name "${account.name}" (${account.fields.address}) already exists. Aborting...`);
    }
}
class NamedKeystoreService {
    storage;
    constructor(storage) {
        this.storage = storage;
    }
    async all() {
        return this.storage.all();
    }
    async get(name) {
        const keystore = await this.storage.get(name);
        if (!keystore) {
            throw new KeystoreNotFoundError(name);
        }
        return keystore;
    }
    async has(name) {
        const keystore = await this.storage.get(name);
        return keystore !== undefined;
    }
    async add(name, privateKey, password) {
        const existedAccount = await this.storage.get(name);
        if (existedAccount) {
            throw new AccountAlreadyExistsError(existedAccount);
        }
        privateKey ??= await common_1.prompt.secret("Enter the private key you wish to add:");
        password ??= await common_1.prompt.password("Enter the password to encrypt this account with:", {
            confirmation: true,
        });
        const account = await NamedKeystore.fromPrivateKey(name, privateKey, password);
        await this.storage.add(account);
        return account;
    }
    async generate(name, password) {
        const existedAccount = await this.storage.get(name);
        if (existedAccount) {
            throw new AccountAlreadyExistsError(existedAccount);
        }
        password ??= await common_1.prompt.password("Enter the password to encrypt this account with:", {
            confirmation: true,
        });
        const account = await NamedKeystore.generate(name, password);
        await this.storage.add(account);
        return account;
    }
    async unlock(nameOrProvider, providerOrPassword, provider) {
        const name = typeof nameOrProvider === "string" ? nameOrProvider : undefined;
        const keystore = name !== undefined ? await this.get(name) : await this.selectKeystore();
        const password = typeof providerOrPassword === "string"
            ? providerOrPassword
            : await common_1.prompt.password(`Enter the password to unlock the account ${keystore.format()}`, {
                confirmation: false,
            });
        provider ??= providerOrPassword ?? nameOrProvider;
        return this.decryptKeystore(keystore, password, provider);
    }
    async remove(name) {
        const keystore = await this.get(name);
        const success = await this.storage.del(name);
        if (!success) {
            throw new AccountRemovalFailed(name);
        }
        return keystore;
    }
    async selectKeystore() {
        const keystores = await this.storage.all();
        if (keystores.length === 0) {
            throw new NoKeystoreError();
        }
        const accountName = await common_1.prompt.select("Select an account to unlock:", keystores.map((keystore) => ({ title: keystore.format(), value: keystore.name })));
        return keystores.find((keystore) => keystore.name === accountName);
    }
    async decryptKeystore(keystore, password, provider) {
        try {
            return keystore.decrypt(password, provider);
        }
        catch (error) {
            if (error instanceof Error && error.message.startsWith("Scrypt:")) {
                throw new AccountUnlockError();
            }
            throw error;
        }
    }
    async password(name, newPassword, oldPassword) {
        const wallet = await this.unlock(name, oldPassword);
        newPassword ??= await common_1.prompt.password("Enter the new password to encrypt the account with:", {
            confirmation: true,
        });
        const account = await NamedKeystore.fromWallet(name, wallet, newPassword);
        await this.storage.del(name);
        await this.storage.add(account);
        return account;
    }
}
exports.NamedKeystoreService = NamedKeystoreService;
class NamedKeystore {
    name;
    fields;
    static async fromWallet(name, wallet, password) {
        const keystore = JSON.parse(await wallet.encrypt(password));
        return this.fromKeystore(name, keystore);
    }
    static fromKeystore(name, keystore) {
        return new NamedKeystore(name, keystore);
    }
    static async fromPrivateKey(name, privateKey, password) {
        const wallet = new ethers_1.Wallet(privateKey);
        return new NamedKeystore(name, JSON.parse(await wallet.encrypt(password)));
    }
    static async generate(name, password) {
        const wallet = ethers_1.Wallet.createRandom();
        const keystore = JSON.parse(await wallet.encrypt(password));
        return new NamedKeystore(name, keystore);
    }
    constructor(name, keystore) {
        this.name = name;
        this.fields = keystore;
    }
    async decrypt(password, provider) {
        try {
            const wallet = await ethers_1.Wallet.fromEncryptedJson(JSON.stringify(this.fields), password);
            return wallet.connect(provider || null);
        }
        catch (error) {
            if (error instanceof Error && error.message.startsWith("Scrypt:")) {
                throw new Error("Error on account loading. Please, make sure that correct password was used");
            }
            throw error;
        }
    }
    format() {
        const prettyName = chalk_1.default.magenta.bold(this.name);
        const prettyAddress = chalk_1.default.white.bold("0x" + this.fields.address);
        return `${prettyAddress}: ${prettyName}`;
    }
}
exports.NamedKeystore = NamedKeystore;
class NamedKeystoreStorage {
    static instances = {};
    static create(keystoresDir) {
        if (!this.instances[keystoresDir]) {
            this.instances[keystoresDir] = new NamedKeystoreStorage(keystoresDir);
        }
        return this.instances[keystoresDir];
    }
    keystoresDir;
    accounts;
    constructor(keystoresDir) {
        this.keystoresDir = keystoresDir;
    }
    async get(name) {
        if (!this.accounts) {
            this.accounts = await this.loadAccounts();
        }
        return this.accounts.find((acc) => acc.name === name);
    }
    async add(acc) {
        if (!this.accounts) {
            this.accounts = await this.loadAccounts();
        }
        this.accounts.push(acc);
        await this.write(acc.name, acc.fields);
    }
    async all() {
        if (!this.accounts) {
            this.accounts = await this.loadAccounts();
        }
        return this.accounts;
    }
    async del(name) {
        if (!this.accounts) {
            this.accounts = await this.loadAccounts();
        }
        const account = this.accounts.find((acc) => acc.name === name);
        if (!account) {
            return false;
        }
        await promises_1.default.unlink(this.getKeystorePath(name));
        return true;
    }
    async loadAccounts() {
        await this.checkKeystoresDir();
        const fileNames = await promises_1.default.readdir(this.keystoresDir);
        return Promise.all(fileNames.map(async (fileName) => NamedKeystore.fromKeystore(fileName.split(".")[0] ?? fileName, JSON.parse(await this.read(fileName)))));
    }
    async read(fileName) {
        return promises_1.default.readFile(path_1.default.join(this.keystoresDir, fileName), "utf8");
    }
    async write(name, keystore) {
        await this.checkKeystoresDir();
        await promises_1.default.writeFile(this.getKeystorePath(name), JSON.stringify(keystore, null, "  "));
    }
    getKeystorePath(name) {
        return path_1.default.join(this.keystoresDir, `${name}.json`);
    }
    async checkKeystoresDir() {
        try {
            await promises_1.default.access(this.keystoresDir);
        }
        catch {
            await promises_1.default.mkdir(this.keystoresDir, { recursive: true });
        }
    }
}
exports.NamedKeystoreStorage = NamedKeystoreStorage;
