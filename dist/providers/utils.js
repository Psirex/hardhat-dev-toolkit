"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHardhatEthersProvider = exports.isJsonRpcProvider = exports.UnsupportedProviderError = void 0;
const ethers_1 = require("ethers");
class UnsupportedProviderError extends Error {
    constructor(provider) {
        super(`Provider ${provider} unsupported`);
    }
}
exports.UnsupportedProviderError = UnsupportedProviderError;
function isJsonRpcProvider(provider) {
    return provider instanceof ethers_1.JsonRpcProvider;
}
exports.isJsonRpcProvider = isJsonRpcProvider;
function isHardhatEthersProvider(provider) {
    return provider.constructor?.name === "HardhatEthersProvider";
}
exports.isHardhatEthersProvider = isHardhatEthersProvider;
