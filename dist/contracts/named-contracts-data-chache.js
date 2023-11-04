"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedContractDataJsonCache = exports.NamedContractDataMemoryCache = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
class NamedContractDataMemoryCache {
    data = {};
    async get(chainId, address) {
        return this.data[chainId.toString()]?.[address] ?? null;
    }
    async set(chainId, address, abi) {
        if (!this.data[chainId.toString()]) {
            this.data[chainId.toString()] = {};
        }
        this.data[chainId.toString()][address] = abi;
    }
}
exports.NamedContractDataMemoryCache = NamedContractDataMemoryCache;
class NamedContractDataJsonCache {
    static instances = {};
    static create(dirPath) {
        if (!this.instances[dirPath]) {
            this.instances[dirPath] = new NamedContractDataJsonCache(dirPath);
        }
        return this.instances[dirPath];
    }
    dirPath;
    data = {};
    constructor(dirPath) {
        this.dirPath = dirPath;
    }
    async get(chainId, address) {
        if (!this.data[chainId.toString()]) {
            await this.load(chainId);
        }
        const networkData = this.data[chainId.toString()];
        return networkData[address] || null;
    }
    async set(chainId, address, abi) {
        if (!this.data[chainId.toString()]) {
            await this.load(chainId);
        }
        const networkData = this.data[chainId.toString()];
        if (!networkData) {
            throw new Error("Network data wasn't loaded before write");
        }
        networkData[address] = abi;
        await this.save(chainId);
    }
    getFilePath(chainId) {
        return path_1.default.join(this.dirPath, chainId + ".json");
    }
    async save(chainId) {
        await promises_1.default.writeFile(this.getFilePath(chainId), JSON.stringify(this.data[chainId.toString()], null, "  "));
    }
    async load(chainId) {
        await this.checkContractAbisDir();
        const fileName = this.getFilePath(chainId);
        await this.checkFile(fileName);
        const rawData = await promises_1.default.readFile(fileName, { encoding: "utf-8" });
        this.data[chainId.toString()] = rawData ? JSON.parse(rawData) : {};
    }
    async checkContractAbisDir() {
        try {
            await promises_1.default.access(this.dirPath);
        }
        catch {
            await promises_1.default.mkdir(this.dirPath, { recursive: true });
        }
    }
    async checkFile(fileName) {
        try {
            await promises_1.default.access(fileName);
        }
        catch {
            await promises_1.default.writeFile(fileName, "{}");
        }
    }
}
exports.NamedContractDataJsonCache = NamedContractDataJsonCache;
