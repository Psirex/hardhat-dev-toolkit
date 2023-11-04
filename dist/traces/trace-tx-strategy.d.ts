import { ContractTransactionReceipt, JsonRpcProvider } from "ethers";
import { TraceStrategy } from "./debug-trace-tx-strategy";
import { TxCallTraceItem } from "./tx-call-trace";
export declare class TraceTxStrategy implements TraceStrategy {
    private readonly provider;
    constructor(provider: JsonRpcProvider);
    trace(receipt: ContractTransactionReceipt): Promise<TxCallTraceItem[]>;
    private createCallTraceItem;
    private createCreateTraceItem;
}
