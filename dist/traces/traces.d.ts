import { ContractTransactionReceipt } from "ethers";
import { TxCallTrace } from "./tx-call-trace";
declare function attachTracer(): void;
declare function isTracingEnabled(): boolean;
declare function enableTracing(): void;
declare function disableTracing(): void;
export declare const hardhat: {
    setup: typeof attachTracer;
    enableTracing: typeof enableTracing;
    disableTracing: typeof disableTracing;
    isTracingEnabled: typeof isTracingEnabled;
};
export declare function trace(receipt: ContractTransactionReceipt): Promise<TxCallTrace>;
export {};
