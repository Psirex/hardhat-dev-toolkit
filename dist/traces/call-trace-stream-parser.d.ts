import { HexStr } from "../common/bytes";
declare const CALL_TRACE_OPCODES: readonly ["CREATE", "CREATE2", "CALL", "CALLCODE", "STATICCALL", "DELEGATECALL", "RETURN", "REVERT", "INVALID", "SELFDESTRUCT", "STOP"];
interface JsonRpcError {
    code: number;
    message: string;
    data?: any;
}
interface StructLogTracerHandlers {
    gas?(gas: number): void;
    error?(error: JsonRpcError): void;
    structLog?(structLog: RawStructLog): void;
    returnValue?(handler: (returnValue: string) => void): void;
}
export declare class StructLogTracer {
    private readonly handlers;
    constructor(handlers: StructLogTracerHandlers);
    trace(url: string, hash: string): Promise<void>;
    private isStructLog;
    private requestTrace;
}
type OpCode = (typeof CALL_TRACE_OPCODES)[number];
interface RawStructLog {
    pc: number;
    gas: number;
    op: OpCode;
    depth: number;
    gasCost: number;
    error: HexStr | null | undefined;
    memory: HexStr[] | null | undefined;
    stack: HexStr[] | null | undefined;
}
export {};
