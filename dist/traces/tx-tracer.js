"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxTracer = void 0;
const tx_call_trace_1 = require("./tx-call-trace");
const providers_1 = __importDefault(require("../providers"));
const bytes_1 = __importDefault(require("../common/bytes"));
class TxTracer {
    traceStrategy;
    contractsResolver;
    constructor(traceStrategy, contractsResolver) {
        this.traceStrategy = traceStrategy;
        this.contractsResolver = contractsResolver;
    }
    async trace(receipt) {
        const callTraceItems = await this.traceStrategy.trace(receipt);
        const addresses = new Set();
        for (let callTraceItem of callTraceItems) {
            if (callTraceItem.type === "CALL" ||
                callTraceItem.type === "DELEGATECALL" ||
                callTraceItem.type === "STATICCALL") {
                addresses.add(callTraceItem.to);
            }
            if ((callTraceItem.type === "CREATE" || callTraceItem.type === "CREATE2") &&
                callTraceItem.deployedAddress) {
                addresses.add(callTraceItem.deployedAddress);
            }
        }
        const contracts = await this.resolveContracts(await providers_1.default.chainId(receipt), Array.from(addresses));
        const network = await providers_1.default.provider(receipt).getNetwork();
        return new tx_call_trace_1.TxCallTrace(network, bytes_1.default.normalize(receipt.from), callTraceItems, contracts);
    }
    async resolveContracts(chainId, addresses) {
        const res = {};
        const resolvedContracts = new Set();
        for (const address of addresses) {
            if (resolvedContracts.has(address))
                continue;
            resolvedContracts.add(address);
            const contract = await this.contractsResolver.resolve(chainId, address);
            if (contract) {
                res[address] = contract;
            }
        }
        return res;
    }
}
exports.TxTracer = TxTracer;
