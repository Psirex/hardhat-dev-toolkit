import { ContractTransactionReceipt } from "ethers";
import { HardhatEthersProvider } from "@nomicfoundation/hardhat-ethers/internal/hardhat-ethers-provider";
import { TxCallTraceItem } from "./tx-call-trace";
import { TraceStrategy } from "./debug-trace-tx-strategy";
export declare class HardhatEvmTraceStrategy implements TraceStrategy {
    private readonly traces;
    private context;
    constructor(provider: HardhatEthersProvider);
    trace(receipt: ContractTransactionReceipt): Promise<TxCallTraceItem[]>;
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
}
