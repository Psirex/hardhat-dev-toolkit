"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxCallTrace = void 0;
const contracts_1 = __importDefault(require("../contracts"));
const format_1 = __importDefault(require("../common/format"));
class TxCallTrace {
    network;
    from;
    calls;
    contracts;
    constructor(network, from, calls, contracts) {
        this.network = network;
        this.from = from;
        this.calls = calls;
        this.contracts = contracts;
    }
    filter(predicate) {
        const calls = this.calls.filter(predicate);
        this.updateDepths(calls);
        return new TxCallTrace(this.network, this.from, calls, this.contracts);
    }
    slice(start, end) {
        const calls = this.calls.slice(start, end);
        this.updateDepths(calls);
        return new TxCallTrace(this.network, this.from, calls, this.contracts);
    }
    format(padding = 0) {
        return this.calls.map((log) => this.formatOpCode(log, padding)).join("\n");
    }
    formatOpCode(opCode, padding) {
        if (opCode.type === "CALL" || opCode.type === "DELEGATECALL" || opCode.type === "STATICCALL")
            return this.formatCallOpCode(opCode, padding);
        return opCode.type;
    }
    formatCallOpCode(opCode, padding = 0) {
        const paddingLeft = "  ".repeat(opCode.depth + padding);
        const opcode = format_1.default.opcode(opCode.type);
        const contract = this.contracts[opCode.to];
        const methodCallInfo = contract
            ? this.parseMethodCall(contract, opCode.input, opCode.output)
            : null;
        const contractLabel = methodCallInfo?.contractLabel || "UNVERIFIED";
        const methodName = methodCallInfo?.fragment.name || opCode.input.slice(0, 10);
        const methodArgs = methodCallInfo?.fragment.inputs
            .map((input, i) => format_1.default.argument(input.name, methodCallInfo.args[i]))
            .join(", ") || "0x" + opCode.input.slice(10);
        const methodResult = methodCallInfo?.result || opCode.output;
        return (paddingLeft +
            opcode +
            " " +
            format_1.default.label(contractLabel + "." + methodName) +
            `(${methodArgs})` +
            " => " +
            (methodResult.toString() || "void"));
    }
    parseMethodCall(contract, calldata, ret) {
        const { fragment } = contract.getFunction(calldata.slice(0, 10));
        return {
            fragment,
            contractLabel: contracts_1.default.label(contract),
            args: contract.interface.decodeFunctionData(fragment, calldata),
            result: contract.interface.decodeFunctionResult(fragment, ret),
        };
    }
    updateDepths(calls) {
        const paddingsRemapping = {};
        const paddings = new Set();
        for (const call of calls) {
            paddings.add(call.depth);
        }
        const paddingsSorted = Array.from(paddings).sort((a, b) => a - b);
        for (let i = 0; i < paddingsSorted.length; ++i) {
            paddingsRemapping[paddingsSorted[i]] = i;
        }
        const depths = [];
        for (let i = 0; i < calls.length; ++i) {
            const call = calls[i];
            depths[i] = paddingsRemapping[call.depth];
            while (i < calls.length - 1 && call.depth <= calls[i + 1].depth) {
                if (call.depth < calls[i + 1].depth) {
                    depths[i + 1] = depths[i] + 1;
                }
                else {
                    depths[i + 1] = depths[i];
                }
                i += 1;
            }
        }
        for (let i = 0; i < calls.length; ++i) {
            calls[i].depth = depths[i];
        }
    }
}
exports.TxCallTrace = TxCallTrace;
