import type { HardhatEthersProvider } from "@nomicfoundation/hardhat-ethers/internal/hardhat-ethers-provider";
import type { Signer, JsonRpcProvider, TransactionRequest, Typed, ContractTransactionResponse, FunctionFragment, ContractTransaction, DeferredTopicFilter, EventFragment } from "ethers";
import { HexStrPrefixed } from "../common/bytes";
export interface ContractCall {
    address: Address;
    calldata: HexStrPrefixed;
}
export type Provider = JsonRpcProvider | HardhatEthersProvider;
export type SignerWithAddress = Signer & {
    address: Address;
};
type BaseOverrides = Omit<TransactionRequest, "to" | "data">;
export type NonPayableOverrides = Omit<BaseOverrides, "value" | "blockTag" | "enableCcipRead">;
export type PayableOverrides = Omit<BaseOverrides, "blockTag" | "enableCcipRead">;
type ViewOverrides = Omit<TransactionRequest, "to" | "data">;
export type Overrides<S extends StateMutability> = S extends "nonpayable" ? NonPayableOverrides : S extends "payable" ? PayableOverrides : ViewOverrides;
type PostfixOverrides<A extends Array<any>, S extends StateMutability> = A | [...A, Overrides<S>];
type ContractMethodArgs<A extends Array<any>, S extends StateMutability> = PostfixOverrides<{
    [I in keyof A]-?: A[I] | Typed;
}, S>;
type StateMutability = "nonpayable" | "payable" | "view";
type DefaultReturnType<R> = R extends Array<any> ? R[0] : R;
export interface TypedContractMethod<A extends Array<any> = Array<any>, R = any, S extends StateMutability = "payable"> {
    (...args: ContractMethodArgs<A, S>): S extends "view" ? Promise<DefaultReturnType<R>> : Promise<ContractTransactionResponse>;
    name: string;
    fragment: FunctionFragment;
    getFragment(...args: ContractMethodArgs<A, S>): FunctionFragment;
    populateTransaction(...args: ContractMethodArgs<A, S>): Promise<ContractTransaction>;
    staticCall(...args: ContractMethodArgs<A, "view">): Promise<DefaultReturnType<R>>;
    send(...args: ContractMethodArgs<A, S>): Promise<ContractTransactionResponse>;
    estimateGas(...args: ContractMethodArgs<A, S>): Promise<bigint>;
    staticCallResult(...args: ContractMethodArgs<A, "view">): Promise<R>;
}
interface TypedDeferredTopicFilter<_TCEvent extends TypedContractEvent> extends DeferredTopicFilter {
}
export interface TypedContractEvent<InputTuple extends Array<any> = any, OutputTuple extends Array<any> = any, OutputObject = any> {
    (...args: Partial<InputTuple>): TypedDeferredTopicFilter<TypedContractEvent<InputTuple, OutputTuple, OutputObject>>;
    name: string;
    fragment: EventFragment;
    getFragment(...args: Partial<InputTuple>): EventFragment;
}
export {};
