import { ContractRunner } from "ethers";
import type { NamedContractDataCache, NamedContractDataResolver } from "./types";
import { EtherscanChainConfig } from "./etherscan-chains-config";
import { ChainId } from "../common";
export declare class NamedContractsResolver {
    private readonly dataCache;
    private readonly dataResolvers;
    private static etherscanToken;
    private static jsonCachePath;
    private static customEtherscanChains;
    private static singletonInstance;
    static setEtherscanToken(token: string): void;
    static setCustomEtherscanChains(chains: EtherscanChainConfig[]): void;
    static setJsonCachePath(path: string): void;
    static singleton(): NamedContractsResolver;
    constructor(contractAbiResolvers: NamedContractDataResolver[], cache?: NamedContractDataCache);
    resolve(chainId: ChainId, address: Address, runner?: ContractRunner): Promise<import("./types").NamedContract | null>;
    private getOrResolveContractData;
    private getContractData;
    private resolveContractData;
}
