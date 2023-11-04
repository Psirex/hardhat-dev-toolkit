import { HexStrPrefixed } from "../common/bytes";
import { BaseContract, Network } from "ethers";
export type TxCallTraceCallType = "CALL" | "DELEGATECALL" | "STATICCALL";
type TxCallTraceCreateType = "CREATE" | "CREATE2";
type TxCallTraceSelfDestructType = "SELFDESTRUCT";
type TxCallTraceCustomTypes = "UNKNOWN" | "EXCEPTION";
export type TxCallTraceType = TxCallTraceCallType | TxCallTraceCreateType | TxCallTraceSelfDestructType | TxCallTraceCustomTypes;
export interface TxCallTraceBaseItem<T extends TxCallTraceType = TxCallTraceType> {
    type: T;
    depth: number;
    value: bigint;
    gas: number;
    gasUsed: number;
    error?: string;
}
export interface TxCallTraceCallItem<T extends TxCallTraceCallType = TxCallTraceCallType> extends TxCallTraceBaseItem<T> {
    to: Address;
    input: HexStrPrefixed;
    output: HexStrPrefixed | "";
}
export interface TxCallTraceCreateItem extends TxCallTraceBaseItem<"CREATE"> {
    deployedAddress: Address | "";
    initCode: HexStrPrefixed;
}
export interface TxCallTraceCreate2Item extends TxCallTraceBaseItem<"CREATE2"> {
    salt: HexStrPrefixed;
    deployedAddress: Address | "";
    initCode: HexStrPrefixed;
}
export interface TxCallTraceSelfDestructItem extends TxCallTraceBaseItem<"SELFDESTRUCT"> {
    contract: Address | "";
    beneficiary: Address;
}
export interface TxCallTraceUnknownItem extends TxCallTraceBaseItem<"UNKNOWN"> {
    output: HexStrPrefixed | "";
}
export type TxCallTraceItem = TxCallTraceCallItem | TxCallTraceCreateItem | TxCallTraceCreate2Item | TxCallTraceUnknownItem | TxCallTraceSelfDestructItem;
export declare class TxCallTrace {
    readonly network: Network;
    readonly from: Address;
    readonly calls: TxCallTraceItem[];
    private readonly contracts;
    constructor(network: Network, from: Address, calls: TxCallTraceItem[], contracts: Record<Address, BaseContract>);
    filter(predicate: (callTrace: TxCallTraceItem, i: number, collection: TxCallTraceItem[]) => boolean): TxCallTrace;
    slice(start?: number, end?: number): TxCallTrace;
    format(padding?: number): string;
    formatOpCode(opCode: TxCallTraceItem, padding?: number): string;
    private formatCallOpCode;
    private parseMethodCall;
    private updateDepths;
}
export {};
