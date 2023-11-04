"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamedContractsBuilder = exports.Contract__factory = void 0;
const ethers_1 = require("ethers");
class Contract__factory {
    abi;
    constructor(abi) {
        this.abi = abi;
    }
    connect(address, runner) {
        return new ethers_1.BaseContract(address, this.abi, runner);
    }
}
exports.Contract__factory = Contract__factory;
function extend(contract, props) {
    const _connect = contract.connect.bind(contract);
    const connect = (runner) => Object.assign(_connect(runner ?? null), { ...props, connect });
    return Object.assign(contract, { ...props, connect });
}
class NamedContractsBuilder {
    static isProxy(config) {
        return !!config.proxy;
    }
    static buildContract(contractName, config, runner) {
        const { impl, proxy } = config;
        const address = proxy ? proxy.address : impl.address;
        return extend(impl.factory.connect(address, runner), {
            address,
            name: proxy ? this.labelProxy(contractName) : this.labelContract(contractName),
        });
    }
    static buildProxy(contractName, config, runner) {
        if (!config.proxy)
            return null;
        const { address, factory } = config.proxy;
        return extend(factory.connect(address, runner), {
            address,
            name: this.labelProxy(contractName),
        });
    }
    static buildImpl(contractName, config, runner) {
        if (!config.proxy)
            return null;
        const { address, factory } = config.impl;
        return extend(factory.connect(address, runner), {
            address,
            name: this.labelImpl(contractName),
        });
    }
    static labelContract(contractLabel) {
        return contractLabel.charAt(0).toUpperCase() + contractLabel.slice(1);
    }
    static labelProxy(contractLabel) {
        return this.labelContract(contractLabel) + "__Proxy";
    }
    static labelImpl(contractLabel) {
        return this.labelContract(contractLabel) + "__Impl";
    }
}
exports.NamedContractsBuilder = NamedContractsBuilder;
