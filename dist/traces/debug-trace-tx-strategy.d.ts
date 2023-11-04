import { ContractTransactionReceipt, JsonRpcProvider } from "ethers";
import { TxCallTraceItem } from "./tx-call-trace";
export interface TraceStrategy {
    trace(receipt: ContractTransactionReceipt): Promise<TxCallTraceItem[]>;
}
export declare class DebugTxTraceStrategy implements TraceStrategy {
    private readonly provider;
    constructor(provider: JsonRpcProvider);
    trace(receipt: ContractTransactionReceipt): Promise<TxCallTraceItem[]>;
    private parseGenericCallOpcode;
    private seedRootCall;
    private seedCallOpcode;
    private seedDelegateCallOpcode;
    private seedStaticCallOpcode;
    private seedBaseCallItem;
    private seedCreateItem;
    private seedCreate2Item;
    private seedSelfDestructItem;
    private seedUnknownItem;
    private formatRawStructLog;
}
