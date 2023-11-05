"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bytes_1 = __importDefault(require("../common/bytes"));
const named_contract_1 = require("./named-contract");
const named_contracts_resolver_1 = require("./named-contracts-resolver");
function isContractConfig(record) {
    const impl = record && record.impl;
    return !!impl && !!impl.factory;
}
function instances(contractsConfig, runner) {
    const res = {};
    for (const key of Object.keys(contractsConfig)) {
        const nestedConfig = contractsConfig[key];
        res[key] = isContractConfig(nestedConfig)
            ? named_contract_1.NamedContractsBuilder.buildContract(key, nestedConfig, runner)
            : instances(nestedConfig || {}, runner);
    }
    return res;
}
function proxies(contractsConfig, runner) {
    const res = {};
    for (const key of Object.keys(contractsConfig)) {
        const nestedConfig = contractsConfig[key];
        if (!isContractConfig(nestedConfig)) {
            res[key] = proxies(nestedConfig || {}, runner);
        }
        else if (nestedConfig.proxy) {
            res[key] = named_contract_1.NamedContractsBuilder.buildProxy(key, nestedConfig, runner);
        }
    }
    return res;
}
function implementations(contractsConfig, runner) {
    const res = {};
    for (const key of Object.keys(contractsConfig)) {
        const nestedConfig = contractsConfig[key];
        if (!isContractConfig(nestedConfig)) {
            res[key] = proxies(nestedConfig || {}, runner);
        }
        else if (nestedConfig.proxy) {
            res[key] = named_contract_1.NamedContractsBuilder.buildImpl(key, nestedConfig, runner);
        }
    }
    return res;
}
function create(contractsConfig, runner) {
    return {
        ...instances(contractsConfig, runner),
        proxies: proxies(contractsConfig, runner),
        implementations: implementations(contractsConfig, runner),
    };
}
function address(contractOrAddress) {
    if (typeof contractOrAddress === "string")
        return contractOrAddress;
    if (typeof contractOrAddress === "object" && "address" in contractOrAddress) {
        return contractOrAddress.address;
    }
    const { target } = contractOrAddress;
    if (typeof target !== "string") {
        throw new Error("target is not an string instance");
    }
    if (!bytes_1.default.isValid(target) && bytes_1.default.length(target) === 20) {
        throw new Error(`target ${target} is invalid bytes string`);
    }
    return bytes_1.default.normalize(target);
}
function label(contract, extended = false) {
    const name = contract.name ?? `Contract`;
    const fullAddress = address(contract);
    return `${name}(${extended ? fullAddress : fullAddress.slice(0, 10) + "..." + fullAddress.slice(-8)})`;
}
function setEtherscanToken(token) {
    named_contracts_resolver_1.NamedContractsResolver.setEtherscanToken(token);
}
function setJsonCachePath(path) {
    named_contracts_resolver_1.NamedContractsResolver.setJsonCachePath(path);
}
function setCustomEtherscanChains(customChains) {
    named_contracts_resolver_1.NamedContractsResolver.setCustomEtherscanChains(customChains);
}
function resolver() {
    return named_contracts_resolver_1.NamedContractsResolver.singleton();
}
async function resolve(chainId, address) {
    return named_contracts_resolver_1.NamedContractsResolver.singleton().resolve(chainId, address);
}
exports.default = {
    address,
    create,
    label,
    resolve,
    resolver,
    proxies,
    instances,
    implementations,
    setup: {
        jsonCachePath: setJsonCachePath,
        etherscanToken: setEtherscanToken,
        customEtherscanChains: setCustomEtherscanChains,
    },
};
