import { ContractTransactionResponse, Signer } from "ethers";
import { NonPayableOverrides } from "./types";
export declare function start(creator: Signer, evmScript: string, meta: string, castVote?: boolean, overrides?: NonPayableOverrides): Promise<ContractTransactionResponse>;
export declare function wait(tx: ContractTransactionResponse): Promise<{
    voteId: bigint;
    receipt: import("ethers").ContractTransactionReceipt;
}>;
export declare function execute<T extends Signer>(executor: T, voteId: number | bigint | string, overrides?: NonPayableOverrides): Promise<import("ethers").ContractTransactionReceipt>;
