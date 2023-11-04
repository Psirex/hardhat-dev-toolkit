import { JsonRpcProvider } from "ethers";
import { HardhatEthersProvider } from "@nomicfoundation/hardhat-ethers/internal/hardhat-ethers-provider";
export declare class UnsupportedProviderError extends Error {
    constructor(provider: any);
}
export declare function isJsonRpcProvider(provider: unknown): provider is JsonRpcProvider;
export declare function isHardhatEthersProvider(provider: unknown): provider is HardhatEthersProvider;
