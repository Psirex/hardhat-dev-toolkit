import { BaseContract, ContractRunner } from "ethers";
import { ContractsConfig, ProxiableContractConfig, ContractConfig, NamedContract } from "./types";
import { NamedContractsResolver } from "./named-contracts-resolver";
import { EtherscanChainConfig } from "./etherscan-chains-config";
import { ChainId } from "../common";
type FactoryResult<T extends ContractConfig> = ReturnType<T["factory"]["connect"]>;
type GetProxyAddress<T extends ProxiableContractConfig> = T["proxy"] extends ContractConfig ? T["proxy"]["address"] : never;
type Contracts<T extends ContractsConfig> = {
    [K in keyof T]: T[K] extends ContractsConfig ? Contracts<T[K]> : T[K] extends ProxiableContractConfig ? NamedContract<FactoryResult<T[K]["impl"]>, GetProxyAddress<T[K]>> : never;
};
type OmitEmptyProxies<T extends ContractsConfig> = {
    [K in keyof T as T[K] extends ProxiableContractConfig ? T[K]["proxy"] extends ContractConfig ? K : never : K]: T[K] extends ProxiableContractConfig ? T[K] : T[K] extends ContractsConfig ? OmitEmptyProxies<T[K]> : never;
};
type Proxies<T extends ContractsConfig> = {
    [K in keyof T]: T[K] extends ContractsConfig ? Proxies<T[K]> : T[K] extends ProxiableContractConfig ? T[K]["proxy"] extends ContractConfig ? NamedContract<FactoryResult<T[K]["proxy"]>, GetProxyAddress<T[K]>> : never : never;
};
type Implementations<T extends ContractsConfig> = {
    [K in keyof T]: T[K] extends ContractsConfig ? Implementations<T[K]> : T[K] extends ProxiableContractConfig ? T[K]["proxy"] extends ContractConfig ? NamedContract<FactoryResult<T[K]["impl"]>, T[K]["impl"]["address"]> : never : never;
};
export type Instance<T extends ContractsConfig> = {
    implementations: Implementations<OmitEmptyProxies<T>>;
    proxies: Proxies<OmitEmptyProxies<T>>;
    contracts: Contracts<T>;
};
declare function create<T extends ContractsConfig>(contractsConfig: T, runner?: ContractRunner): Instance<T>;
declare function address(contractOrAddress: Address | BaseContract | NamedContract): Address;
declare function label(contract: BaseContract | NamedContract, extended?: boolean): string;
declare function setEtherscanToken(token: string): void;
declare function setJsonCachePath(path: string): void;
declare function setCustomEtherscanChains(customChains: EtherscanChainConfig[]): void;
declare function resolver(): NamedContractsResolver;
declare function resolve(chainId: ChainId, address: Address): Promise<NamedContract | null>;
declare const _default: {
    address: typeof address;
    create: typeof create;
    label: typeof label;
    resolve: typeof resolve;
    resolver: typeof resolver;
    setup: {
        jsonCachePath: typeof setJsonCachePath;
        etherscanToken: typeof setEtherscanToken;
        customEtherscanChains: typeof setCustomEtherscanChains;
    };
};
export default _default;
