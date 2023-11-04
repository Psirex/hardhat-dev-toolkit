"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedContractsResolver = void 0;
const named_contracts_data_chache_1 = require("./named-contracts-data-chache");
const named_contract_1 = require("./named-contract");
const etherscan_contract_data_resolver_1 = require("./etherscan-contract-data-resolver");
class NamedContractsResolver {
    dataCache;
    dataResolvers;
    static etherscanToken = null;
    static jsonCachePath = null;
    static customEtherscanChains = null;
    static singletonInstance = null;
    static setEtherscanToken(token) {
        this.etherscanToken = token;
    }
    static setCustomEtherscanChains(chains) {
        this.customEtherscanChains = chains;
    }
    static setJsonCachePath(path) {
        this.jsonCachePath = path;
    }
    static singleton() {
        if (this.singletonInstance)
            return this.singletonInstance;
        if (!this.etherscanToken) {
            throw new Error(`Etherscan token was not set. Please call the ${this.name}.setEtherscanToken() before the usage`);
        }
        const cache = this.jsonCachePath
            ? named_contracts_data_chache_1.NamedContractDataJsonCache.create(this.jsonCachePath)
            : new named_contracts_data_chache_1.NamedContractDataMemoryCache();
        return new NamedContractsResolver([new etherscan_contract_data_resolver_1.EtherscanContractDataResolver(this.etherscanToken, this.customEtherscanChains ?? [])], cache);
    }
    constructor(contractAbiResolvers, cache = new named_contracts_data_chache_1.NamedContractDataMemoryCache()) {
        this.dataCache = cache;
        this.dataResolvers = contractAbiResolvers;
    }
    async resolve(chainId, address, runner) {
        const contractAbi = await this.getOrResolveContractData(chainId, address);
        if (!contractAbi)
            return null;
        const contractAbiProxy = contractAbi.isProxy ? contractAbi : null;
        const implAddress = contractAbi.implementation || address;
        const contractAbiImpl = contractAbi.implementation
            ? await this.getOrResolveContractData(chainId, contractAbi.implementation)
            : contractAbi;
        if (!contractAbiImpl)
            return null;
        return named_contract_1.NamedContractsBuilder.buildContract(contractAbiImpl.name, {
            impl: {
                factory: new named_contract_1.Contract__factory(contractAbiImpl.abi),
                address: implAddress,
            },
            proxy: contractAbiProxy
                ? {
                    factory: new named_contract_1.Contract__factory(contractAbiProxy.abi),
                    address,
                }
                : null,
        }, runner);
    }
    async getOrResolveContractData(chainId, address) {
        let contractData = await this.getContractData(chainId, address);
        if (!contractData) {
            contractData = await this.resolveContractData(chainId, address);
        }
        return contractData;
    }
    async getContractData(chainId, address) {
        if (!this.dataCache)
            return null;
        const cachedContractAbi = await this.dataCache.get(chainId, address);
        return cachedContractAbi || null;
    }
    async resolveContractData(chainId, address) {
        for (const namedContractDataResolvers of this.dataResolvers) {
            const contractAbi = await namedContractDataResolvers.resolve(chainId, address);
            if (!contractAbi)
                continue;
            await this.dataCache?.set(chainId, address, contractAbi);
            return contractAbi;
        }
        return null;
    }
}
exports.NamedContractsResolver = NamedContractsResolver;
