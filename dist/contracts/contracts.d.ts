import { BaseContract, ContractRunner } from "ethers";
import { ContractsConfig, ProxiableContractConfig, ContractConfig, NamedContract } from "./types";
import { NamedContractsResolver } from "./named-contracts-resolver";
import { EtherscanChainConfig } from "./etherscan-chains-config";
import { ChainId } from "../common";
/**
 * @description Combines members of an intersection into a readable type.
 *
 * @see {@link https://twitter.com/mattpocockuk/status/1622730173446557697?s=20&t=NdpAcmEFXY01xkqU3KO0Mg}
 * @example
 * Prettify<{ a: string } & { b: string } & { c: number, d: bigint }>
 * => { a: string, b: string, c: number, d: bigint }
 */
export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type FactoryResult<T extends ContractConfig> = ReturnType<T["factory"]["connect"]>;
type GetProxyAddress<T extends ProxiableContractConfig> = T["proxy"] extends ContractConfig ? T["proxy"]["address"] : never;
type Instances<T extends ContractsConfig> = {
    [K in keyof T]: T[K] extends ContractsConfig ? Instances<T[K]> : T[K] extends ProxiableContractConfig ? NamedContract<FactoryResult<T[K]["impl"]>, GetProxyAddress<T[K]>> : never;
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
export type Contracts<T extends ContractsConfig> = Prettify<Instances<T> & {
    proxies: Proxies<OmitEmptyProxies<T>>;
    implementations: Implementations<OmitEmptyProxies<T>>;
}>;
declare function instances<T extends ContractsConfig>(contractsConfig: T, runner?: ContractRunner): Instances<T>;
declare function proxies<T extends ContractsConfig>(contractsConfig: T, runner?: ContractRunner): Proxies<OmitEmptyProxies<T>>;
declare function implementations<T extends ContractsConfig>(contractsConfig: T, runner?: ContractRunner): Implementations<OmitEmptyProxies<T>>;
declare function create<T extends ContractsConfig>(contractsConfig: T, runner?: ContractRunner): Contracts<T>;
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
    proxies: typeof proxies;
    instances: typeof instances;
    implementations: typeof implementations;
    setup: {
        jsonCachePath: typeof setJsonCachePath;
        etherscanToken: typeof setEtherscanToken;
        customEtherscanChains: typeof setCustomEtherscanChains;
    };
};
export default _default;
