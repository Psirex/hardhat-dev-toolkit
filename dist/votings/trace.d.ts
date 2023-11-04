import { ContractTransactionReceipt } from "ethers";
interface TraceOptions {
    extended: boolean;
}
export declare function trace(enactReceipt: ContractTransactionReceipt, options?: TraceOptions): Promise<import("../traces/tx-call-trace").TxCallTrace>;
export {};
