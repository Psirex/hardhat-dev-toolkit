"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructLogTracer = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const clarinet_1 = __importDefault(require("clarinet"));
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
const TOKENS = {
    OBJECT_OPEN: "{",
    OBJECT_CLOSE: "}",
    ARRAY_OPEN: "[",
    ARRAY_CLOSE: "]",
    COLON: ":",
    COMMA: ",",
    DOUBLE_QUOTES: '"',
};
class JsonBuilder {
    tokens = [];
    parse(tokens) {
        return JSON.parse(tokens.join("").replace(/\n/g, "\\n"));
    }
    build() {
        return this.parse(this.tokens.splice(0, this.tokens.length));
    }
    pop() {
        if (this.tokens[this.tokens.length - 1] !== TOKENS.OBJECT_CLOSE) {
            // there is no built object on the top of the tokens stack
            return null;
        }
        let objectOpenIndex = this.tokens.length - 1;
        while (objectOpenIndex > 0 && this.tokens[objectOpenIndex] !== TOKENS.OBJECT_OPEN) {
            --objectOpenIndex;
        }
        if (objectOpenIndex < 0) {
            throw new Error(`Invalid JSON. Corresponding "${TOKENS.OBJECT_OPEN}" token not found`);
        }
        if (objectOpenIndex > 0 && this.tokens[objectOpenIndex - 1] === TOKENS.COLON) {
            // return null because it's part of the larger object
            return null;
        }
        return this.parse(this.tokens.splice(objectOpenIndex, this.tokens.length - objectOpenIndex));
    }
    key(key) {
        this.tokens.push(TOKENS.DOUBLE_QUOTES);
        this.tokens.push(key);
        this.tokens.push(TOKENS.DOUBLE_QUOTES);
        this.tokens.push(TOKENS.COLON);
    }
    value(value) {
        if (typeof value === "string") {
            this.tokens.push(TOKENS.DOUBLE_QUOTES);
            this.tokens.push(value);
            this.tokens.push(TOKENS.DOUBLE_QUOTES);
        }
        else {
            this.tokens.push("" + value); // cast to string
        }
        this.comma();
    }
    openArray() {
        this.tokens.push(TOKENS.ARRAY_OPEN);
    }
    closeArray() {
        this.stripTrailingComma();
        this.tokens.push(TOKENS.ARRAY_CLOSE);
        this.comma();
    }
    openObject() {
        this.tokens.push(TOKENS.OBJECT_OPEN);
    }
    closeObject() {
        this.stripTrailingComma();
        this.tokens.push(TOKENS.OBJECT_CLOSE);
    }
    comma() {
        this.tokens.push(TOKENS.COMMA);
    }
    stripTrailingComma() {
        if (this.tokens[this.tokens.length - 1] === TOKENS.COMMA) {
            this.tokens.pop();
        }
    }
}
class StructLogTracer {
    handlers;
    constructor(handlers) {
        this.handlers = handlers;
    }
    async trace(url, hash) {
        const response = await this.requestTrace(url, hash);
        const cparser = clarinet_1.default.parser();
        const jsonBuilder = new JsonBuilder();
        cparser.onopenobject = (key) => {
            jsonBuilder.openObject();
            if (key !== undefined) {
                jsonBuilder.key(key);
            }
        };
        cparser.oncloseobject = () => {
            jsonBuilder.closeObject();
            const object = jsonBuilder.pop();
            if (!object)
                return;
            if (this.handlers?.structLog && this.isStructLog(object)) {
                this.handlers.structLog(object);
            }
        };
        cparser.onopenarray = () => jsonBuilder.openArray();
        cparser.onclosearray = () => jsonBuilder.closeArray();
        cparser.onkey = (key) => jsonBuilder.key(key);
        cparser.onvalue = (value) => jsonBuilder.value(value);
        if (!response.body) {
            throw new Error(`The response body is null ${response}`);
        }
        for await (const chunk of response.body) {
            cparser.write(chunk.toString());
        }
        const { result, error } = jsonBuilder.build();
        if (result) {
            this.handlers.gas?.(result.gas);
            this.handlers.returnValue?.(result.returnValue);
        }
        if (error) {
            this.handlers.error?.(error);
        }
        cparser.close();
    }
    isStructLog(log) {
        const asRawLog = log;
        return (asRawLog.op !== undefined &&
            asRawLog.depth !== undefined &&
            asRawLog.pc !== undefined &&
            asRawLog.gas !== undefined);
    }
    async requestTrace(url, hash) {
        // TODO: handle failed requests, for example when tx wasn't found
        return (0, node_fetch_1.default)(url, {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: 1,
                jsonrpc: "2.0",
                method: "debug_traceTransaction",
                params: [hash, { disableStack: false, disableMemory: false, disableStorage: true }],
            }),
        });
    }
}
exports.StructLogTracer = StructLogTracer;
