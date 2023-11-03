import { Provider } from "ethers";
import { Wallet, HDNodeWallet } from "ethers";
import { Address } from "../common";
interface KeystoreEthersV6 {
    id: string;
    version: number;
    address: Address;
    Crypto: Record<string, any>;
    "x-ethers": Record<string, any>;
}
interface KeystoreService {
    all(): Promise<NamedKeystore[]>;
    get(name: string): Promise<NamedKeystore>;
    has(name: string): Promise<boolean>;
    add(name: string): Promise<NamedKeystore>;
    add(name: string, privateKey: string, password: string): Promise<NamedKeystore>;
    generate(name: string, password?: string): Promise<NamedKeystore>;
    unlock<T extends Provider>(provider?: T): Promise<Wallet | HDNodeWallet>;
    unlock<T extends Provider>(name: string, provider?: T): Promise<Wallet | HDNodeWallet>;
    unlock<T extends Provider>(name: string, password?: string, provider?: T): Promise<Wallet | HDNodeWallet>;
    remove(name: string): Promise<NamedKeystore>;
    password(name: string, newPassword?: string, oldPassword?: string): Promise<NamedKeystore>;
}
export declare class NamedKeystoreService implements KeystoreService {
    private readonly storage;
    constructor(storage: NamedKeystoreStorage);
    all(): Promise<NamedKeystore[]>;
    get(name: string): Promise<NamedKeystore>;
    has(name: string): Promise<boolean>;
    add(name: string): Promise<NamedKeystore>;
    add(name: string, privateKey: string, password: string): Promise<NamedKeystore>;
    generate(name: string, password?: string): Promise<NamedKeystore>;
    unlock<T extends Provider>(provider?: T): Promise<Wallet | HDNodeWallet>;
    unlock<T extends Provider>(name: string, provider?: T): Promise<Wallet | HDNodeWallet>;
    unlock<T extends Provider>(name: string, password?: string, provider?: T): Promise<Wallet | HDNodeWallet>;
    remove(name: string): Promise<NamedKeystore>;
    private selectKeystore;
    private decryptKeystore;
    password(name: string, newPassword?: string, oldPassword?: string): Promise<NamedKeystore>;
}
export declare class NamedKeystore {
    readonly name: string;
    readonly fields: KeystoreEthersV6;
    static fromWallet(name: string, wallet: Wallet | HDNodeWallet, password: string): Promise<NamedKeystore>;
    static fromKeystore(name: string, keystore: KeystoreEthersV6): NamedKeystore;
    static fromPrivateKey(name: string, privateKey: string, password: string): Promise<NamedKeystore>;
    static generate(name: string, password: string): Promise<NamedKeystore>;
    private constructor();
    decrypt<T extends Provider>(password: string, provider?: T): Promise<Wallet | HDNodeWallet>;
    format(): string;
}
export declare class NamedKeystoreStorage {
    private static instances;
    static create(keystoresDir: string): NamedKeystoreStorage;
    private readonly keystoresDir;
    private accounts?;
    private constructor();
    get(name: string): Promise<NamedKeystore | undefined>;
    add(acc: NamedKeystore): Promise<void>;
    all(): Promise<NamedKeystore[]>;
    del(name: string): Promise<boolean>;
    private loadAccounts;
    private read;
    private write;
    private getKeystorePath;
    private checkKeystoresDir;
}
export {};
