"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraceTxStrategy = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const bytes_1 = __importDefault(require("../common/bytes"));
function isCallParityTraceItem(item) {
    return item.type === "call";
}
function isCreateParityTraceItem(item) {
    return item.type === "create";
}
class TraceTxStrategy {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    async trace(receipt) {
        const { url } = this.provider._getConnection();
        const response = await (0, node_fetch_1.default)(url, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: 1,
                jsonrpc: "2.0",
                method: "trace_transaction",
                params: [receipt.hash],
            }),
        });
        const { result: items } = (await response.json());
        let result = [];
        for (let item of items) {
            if (isCallParityTraceItem(item)) {
                result.push(this.createCallTraceItem(item));
            }
            else if (isCreateParityTraceItem(item)) {
                result.push(this.createCreateTraceItem(item));
            }
            else {
                throw new Error(`Unsupported item ${item}`);
            }
        }
        return result;
    }
    createCallTraceItem(item) {
        const type = item.action.callType.toUpperCase();
        return {
            type,
            depth: item.traceAddress.length,
            to: item.action.to,
            gas: bytes_1.default.toInt(item.action.gas),
            gasUsed: bytes_1.default.toInt(item.result.gasUsed),
            value: bytes_1.default.toBigInt(item.action.value),
            input: item.action.input,
            output: item.result.output,
        };
    }
    createCreateTraceItem(item) {
        return {
            type: "CREATE",
            depth: item.traceAddress.length,
            gas: bytes_1.default.toInt(item.action.gas),
            gasUsed: bytes_1.default.toInt(item.result.gasUsed),
            value: bytes_1.default.toBigInt(item.action.value),
            deployedAddress: item.result.address,
            initCode: item.action.init,
        };
    }
}
exports.TraceTxStrategy = TraceTxStrategy;
