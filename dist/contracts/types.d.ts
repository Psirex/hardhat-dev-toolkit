import type { JsonFragment, ContractRunner, BaseContract } from "ethers";
import { ChainId } from "../common";
export type NamedContract<T extends BaseContract = BaseContract, A extends Address = Address> = Omit<T, "connect"> & {
    address: A;
    name: string;
    connect: (runner?: null | ContractRunner | undefined) => NamedContract<T, A>;
};
export interface ContractFactory<T extends BaseContract = BaseContract> {
    connect(address: string, runner?: ContractRunner | null | undefined): T;
}
export interface ContractConfig<Factory extends ContractFactory = ContractFactory> {
    factory: Factory;
    address: Address;
}
export interface ProxiableContractConfig<ImplFactory extends ContractFactory = ContractFactory, ProxyFactory extends ContractFactory = ContractFactory> {
    name?: string;
    impl: ContractConfig<ImplFactory>;
    proxy: ContractConfig<ProxyFactory> | null;
}
export interface ContractsConfig {
    [key: string]: ContractsConfig | ProxiableContractConfig;
}
export interface NamedContractData {
    name: string;
    abi: JsonFragment[];
    isProxy: boolean;
    implementation?: Address;
}
export interface NamedContractDataCache {
    get(chainId: ChainId, address: Address): Promise<NamedContractData | null>;
    set(chainId: ChainId, address: Address, abi: NamedContractData): Promise<void>;
}
export interface NamedContractDataResolver {
    resolve(chainId: ChainId, address: Address): Promise<NamedContractData | null>;
}
