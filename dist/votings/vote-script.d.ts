import { BaseContract, BytesLike, FunctionFragment } from "ethers";
import { HexStrPrefixed } from "../common/bytes";
import { TypedContractMethod } from "./types";
import { EvmCall } from "./evm-script-parser";
type _TypedContractMethod = Omit<TypedContractMethod, "staticCallResult">;
type _TypedContractArgs<T extends _TypedContractMethod> = Parameters<T["staticCall"]>;
type ForwardContractMethod = TypedContractMethod<[_evmScript: BytesLike], [void], "nonpayable">;
export interface AragonForwarder extends BaseContract {
    forward: ForwardContractMethod;
}
export interface FormattedEvmCall extends EvmCall {
    format(padding?: number): string;
}
export declare class AragonEvmForward implements FormattedEvmCall {
    private readonly forwarder;
    private readonly calls;
    constructor(forwarder: AragonForwarder, calls: ContractEvmCall[]);
    get address(): Address;
    get calldata(): HexStrPrefixed;
    format(padding?: number): string;
}
export declare class ContractEvmCall implements FormattedEvmCall {
    private readonly contract;
    private readonly method;
    private readonly args;
    constructor(contract: BaseContract, method: FunctionFragment, args: any[]);
    get address(): Address;
    get calldata(): HexStrPrefixed;
    format(padding?: number): string;
    private formatArgument;
}
/**
 *
 * @param calls - calls to encode as EVM script
 * @returns EVM script for the sequence of the calls
 */
export declare function evm(...calls: EvmCall[]): HexStrPrefixed;
/**
 * Creates an instance of the EVM call
 * @param method - method on the contract to call
 * @param args - args to use with the contract call
 * @returns an instance of the EVM call
 */
export declare function call<T extends _TypedContractMethod>(method: T, args: _TypedContractArgs<T>): ContractEvmCall;
/**
 * Creates a call of the forward(evmScript) method
 * @param forwarder - contracts which support forwarding of the EVM scripts
 * @param calls - calls to pass encode as EVM Script and pass as and argument to forward method
 * @returns instance of the EVMCall with forward method call
 */
export declare function forward(forwarder: AragonForwarder, calls: ContractEvmCall[]): AragonEvmForward;
export {};
