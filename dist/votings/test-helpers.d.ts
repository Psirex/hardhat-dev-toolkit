import type { BigNumberish, ContractTransactionReceipt, Signer } from "ethers";
import { RpcProvider } from "../providers";
import { NonPayableOverrides } from "./types";
export declare function creator(provider: RpcProvider): Promise<Signer>;
export declare function pass(provider: RpcProvider, voteId: BigNumberish, overrides?: NonPayableOverrides): Promise<ContractTransactionReceipt>;
interface AdoptResult {
    voteId: bigint;
    createReceipt: ContractTransactionReceipt;
    enactReceipt: ContractTransactionReceipt;
}
export declare function adopt(provider: RpcProvider, voteScript: string, description: string, overrides?: NonPayableOverrides): Promise<AdoptResult>;
export {};
