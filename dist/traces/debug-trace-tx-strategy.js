"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugTxTraceStrategy = void 0;
const call_trace_stream_parser_1 = require("./call-trace-stream-parser");
const bytes_1 = __importDefault(require("../common/bytes"));
const CALL_TRACE_OPCODES = [
    "CREATE",
    "CREATE2",
    "CALL",
    "CALLCODE",
    "STATICCALL",
    "DELEGATECALL",
    "RETURN",
    "REVERT",
    "INVALID",
    "SELFDESTRUCT",
    "STOP",
];
class DebugTxTraceStrategy {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    async trace(receipt) {
        let depth = 0;
        let index = 0;
        const ctxChanges = [];
        const callTraceStructLogs = [];
        const tracer = new call_trace_stream_parser_1.StructLogTracer({
            structLog: (log) => {
                if (log.depth !== depth) {
                    depth = log.depth;
                    ctxChanges.push(this.formatRawStructLog(log, index));
                }
                if (CALL_TRACE_OPCODES.includes(log.op)) {
                    callTraceStructLogs.push(this.formatRawStructLog(log, index));
                }
                ++index;
            },
            error: (error) => {
                if (error) {
                    throw new Error(error.message);
                }
            },
        });
        await tracer.trace(this.provider._getConnection().url, receipt.hash);
        const rootCall = await this.seedRootCall(receipt);
        const callTraceItems = [rootCall];
        const contextStack = [rootCall];
        for (const structLog of callTraceStructLogs) {
            if (structLog.op === "CREATE") {
                const createOpcode = this.seedCreateItem(structLog);
                // find the address of the created contract
                const firstOpAfterCreate = ctxChanges.find((item) => item.index > structLog.index && item.depth === structLog.depth);
                if (!firstOpAfterCreate) {
                    // TODO: handle gracefully
                    throw new Error("Invalid trace data");
                }
                createOpcode.deployedAddress = bytes_1.default.slice(firstOpAfterCreate.stack.peek(0), -20);
                contextStack.push(createOpcode);
                callTraceItems.push(createOpcode);
            }
            else if (structLog.op === "CREATE2") {
                const create2Opcode = await this.seedCreate2Item(structLog);
                contextStack.push(create2Opcode);
                callTraceItems.push(create2Opcode);
            }
            else if (structLog.op === "CALL") {
                const callOpCode = this.seedCallOpcode(structLog);
                contextStack.push(callOpCode);
                callTraceItems.push(callOpCode);
            }
            else if (structLog.op === "DELEGATECALL") {
                const delegateCallOpCode = await this.seedDelegateCallOpcode(structLog);
                contextStack.push(delegateCallOpCode);
                callTraceItems.push(delegateCallOpCode);
            }
            else if (structLog.op === "STATICCALL") {
                const staticCallOpCode = await this.seedStaticCallOpcode(structLog);
                contextStack.push(staticCallOpCode);
                callTraceItems.push(staticCallOpCode);
            }
            else if (structLog.op === "STOP") {
                const currentContext = contextStack.pop();
                if (!currentContext) {
                    throw new Error("Context stack is empty");
                }
                if (currentContext.type === "CALL" ||
                    currentContext.type === "DELEGATECALL" ||
                    currentContext.type === "STATICCALL" ||
                    currentContext.type === "UNKNOWN") {
                    currentContext.output = "0x";
                }
            }
            else if (structLog.op === "RETURN") {
                const currentContext = contextStack.pop();
                if (!currentContext) {
                    throw new Error("Context stack is empty");
                }
                switch (currentContext.type) {
                    case "CALL":
                    case "DELEGATECALL":
                    case "STATICCALL":
                    case "UNKNOWN":
                        currentContext.output = structLog.memory.read(bytes_1.default.toInt(structLog.stack.peek(0)), bytes_1.default.toInt(structLog.stack.peek(1)));
                        break;
                }
            }
            else if (structLog.op === "SELFDESTRUCT") {
                const currentCtx = contextStack[contextStack.length - 1];
                if (!currentCtx) {
                    throw new Error("Context is empty");
                }
                const item = this.seedSelfDestructItem(structLog);
                if (currentCtx.type === "CREATE") {
                    item.contract = currentCtx.deployedAddress;
                }
                else if (currentCtx.type === "CALL" ||
                    currentCtx.type === "STATICCALL" ||
                    currentCtx.type === "DELEGATECALL") {
                    item.contract = currentCtx.to;
                }
                callTraceItems.push(item);
            }
            else {
                callTraceItems.push(this.seedUnknownItem(structLog));
            }
        }
        return callTraceItems;
    }
    parseGenericCallOpcode(type, structLog) {
        const value = type === "CALL" ? bytes_1.default.toBigInt(structLog.stack.peek(2)) : 0n;
        const calldataStackIndices = type === "CALL" ? [3, 4] : [2, 3];
        return {
            type: type,
            gas: structLog.gas,
            depth: structLog.depth,
            input: structLog.memory.read(bytes_1.default.toInt(structLog.stack.peek(calldataStackIndices[0])), bytes_1.default.toInt(structLog.stack.peek(calldataStackIndices[1]))),
            to: bytes_1.default.slice(structLog.stack.peek(1), -20),
            value,
            gasUsed: -1,
            error: structLog.error,
            output: "",
        };
    }
    async seedRootCall(receipt) {
        const { gasLimit, data, value, to } = await receipt.getTransaction();
        if (!to) {
            throw new Error(`The "to" property of the transaction is null`);
        }
        return {
            type: "CALL",
            depth: 0,
            gas: Number(gasLimit),
            gasUsed: Number(receipt.gasUsed),
            input: bytes_1.default.normalize(data),
            value: value,
            to: bytes_1.default.normalize(to),
            output: "",
        };
    }
    seedCallOpcode(structLog) {
        return this.parseGenericCallOpcode("CALL", structLog);
    }
    seedDelegateCallOpcode(structLog) {
        return this.parseGenericCallOpcode("DELEGATECALL", structLog);
    }
    seedStaticCallOpcode(structLog) {
        return this.parseGenericCallOpcode("STATICCALL", structLog);
    }
    seedBaseCallItem(type, structLog) {
        return {
            type,
            depth: structLog.depth,
            gas: structLog.gas,
            gasUsed: -1,
            value: 0n,
        };
    }
    seedCreateItem(structLog) {
        return {
            ...this.seedBaseCallItem("CREATE", structLog),
            initCode: structLog.memory.read(bytes_1.default.toInt(structLog.stack.peek(1)), bytes_1.default.toInt(structLog.stack.peek(2))),
            value: bytes_1.default.toBigInt(structLog.stack.peek(0)),
            deployedAddress: "",
        };
    }
    seedCreate2Item(structLog) {
        return { ...this.seedCreateItem(structLog), type: "CREATE2", salt: structLog.stack.peek(3) };
    }
    seedSelfDestructItem(structLog) {
        return {
            ...this.seedBaseCallItem("SELFDESTRUCT", structLog),
            contract: "",
            beneficiary: bytes_1.default.slice(structLog.stack.peek(0), -20),
        };
    }
    seedUnknownItem(structLog) {
        return {
            ...this.seedBaseCallItem("UNKNOWN", structLog),
            output: "",
        };
    }
    formatRawStructLog(structLog, index) {
        return {
            index: index,
            depth: structLog.depth,
            gas: structLog.gas,
            gasCost: structLog.gasCost,
            op: structLog.op,
            pc: structLog.pc,
            error: structLog.error || undefined,
            stack: new ReadOnlyEVMStack(structLog.stack || []),
            memory: new ReadOnlyEVMMemory(structLog.memory || []),
        };
    }
}
exports.DebugTxTraceStrategy = DebugTxTraceStrategy;
class ReadOnlyEVMMemory {
    memory;
    constructor(memory) {
        this.memory = memory.join("");
    }
    read(offset, size) {
        return bytes_1.default.normalize(this.memory.slice(2 * offset, 2 * (offset + size)));
    }
}
class ReadOnlyEVMStack {
    stack;
    constructor(stack) {
        this.stack = stack;
    }
    get size() {
        return this.stack.length;
    }
    peek(offset = 0) {
        if (offset >= this.stack.length) {
            throw new Error(`offset: ${offset} exceeds the stack size: ${this.stack.length}`);
        }
        const item = this.stack[this.stack.length - 1 - offset];
        if (item === undefined) {
            throw new Error(`Stack item is undefined`);
        }
        return bytes_1.default.normalize(item);
    }
}
