import { ContractTransactionReceipt } from "ethers";
import { NamedContractsResolver } from "../contracts";
import { TraceStrategy } from "./debug-trace-tx-strategy";
import { TxCallTrace } from "./tx-call-trace";
export declare class TxTracer {
    private readonly traceStrategy;
    private readonly contractsResolver;
    constructor(traceStrategy: TraceStrategy, contractsResolver: NamedContractsResolver);
    trace(receipt: ContractTransactionReceipt): Promise<TxCallTrace>;
    private resolveContracts;
}
