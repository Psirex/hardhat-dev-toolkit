import { TxCallTraceItem } from "./tx-call-trace";
import { EIP1193Provider } from "hardhat/types";
import { ContractTransactionReceipt, Provider } from "ethers";
import { TraceStrategy } from "./debug-trace-tx-strategy";
export declare class HardhatVmTraceStrategy implements TraceStrategy {
    private vm;
    isInitialized: boolean;
    private context;
    private rootProvider;
    isTracingEnabled: boolean;
    private readonly listeners;
    private readonly traces;
    constructor();
    init(provider: Provider | EIP1193Provider): Promise<void>;
    isSameRootProvider(provider: Provider | EIP1193Provider): boolean;
    trace(receipt: ContractTransactionReceipt): Promise<TxCallTraceItem[]>;
    enableTracing(): void;
    disableTracing(): void;
    private unsubscribe;
    private subscribe;
    private handleBeforeTx;
    private handleAfterTx;
    private handleBeforeMessage;
    private handleAfterMessage;
    private handleNewContract;
    private seedBaseCallItem;
    private seedDelegateCallItem;
    private seedCallItem;
    private seedCreateItem;
    private seedCreate2Item;
    private seedSelfDestructItem;
    private seedUnknownItem;
    private getHardhatVM;
}