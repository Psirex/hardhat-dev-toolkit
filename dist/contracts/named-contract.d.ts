import { BaseContract, ContractRunner, JsonFragment } from "ethers";
import { ProxiableContractConfig, ContractFactory, NamedContract } from "./types";
export declare class Contract__factory<T extends BaseContract = BaseContract> implements ContractFactory {
    readonly abi: JsonFragment[];
    constructor(abi: JsonFragment[]);
    connect(address: string, runner?: ContractRunner | null | undefined): T;
}
export declare class NamedContractsBuilder {
    static isProxy<C extends ProxiableContractConfig>(config: C): boolean;
    static buildContract<C extends ProxiableContractConfig>(contractName: string, config: C, runner?: ContractRunner): NamedContract;
    static buildProxy<C extends ProxiableContractConfig>(contractName: string, config: C, runner?: ContractRunner): NamedContract | null;
    static buildImpl<C extends ProxiableContractConfig>(contractName: string, config: C, runner?: ContractRunner): NamedContract | null;
    private static labelContract;
    private static labelProxy;
    private static labelImpl;
}
