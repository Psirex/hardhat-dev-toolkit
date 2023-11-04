"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvmScriptParser = void 0;
// import bytes, { BytesStringPrefixed } from "../common/bytes";
const bytes_1 = __importDefault(require("../common/bytes"));
const ADDRESS_LENGTH = 20;
class EvmScriptParser {
    static SPEC_ID_LENGTH = 4;
    static CALLDATA_LENGTH = 4;
    static CALLDATA_LENGTH_LENGTH = 4;
    static DEFAULT_SPEC_ID = "0x00000001";
    static isEvmScript(script, specId = this.DEFAULT_SPEC_ID) {
        return bytes_1.default.isValid(script) && script.startsWith(specId);
    }
    static encode(calls, specId = this.DEFAULT_SPEC_ID) {
        const res = calls.reduce((evmScript, call) => bytes_1.default.join(evmScript, this.encodeEvmScriptCall(call)), specId);
        return bytes_1.default.normalize(res);
    }
    static decode(evmScript) {
        const evmScriptLength = bytes_1.default.length(evmScript);
        if (evmScriptLength < this.SPEC_ID_LENGTH) {
            throw new Error("Invalid evmScript length");
        }
        const res = {
            specId: bytes_1.default.slice(evmScript, 0, this.SPEC_ID_LENGTH),
            calls: [],
        };
        let startIndex = this.SPEC_ID_LENGTH;
        while (startIndex < evmScriptLength) {
            const contract = bytes_1.default.slice(evmScript, startIndex, (startIndex += ADDRESS_LENGTH));
            const calldataLength = bytes_1.default.toInt(bytes_1.default.slice(evmScript, startIndex, (startIndex += this.CALLDATA_LENGTH)));
            const calldata = bytes_1.default.slice(evmScript, startIndex, (startIndex += calldataLength));
            res.calls.push({ address: contract, calldata });
        }
        if (startIndex !== evmScriptLength) {
            throw new Error("Invalid evmScript length");
        }
        return res;
    }
    static encodeEvmScriptCall(call) {
        return bytes_1.default.join(call.address, bytes_1.default.padStart(bytes_1.default.encode(bytes_1.default.length(call.calldata)), this.CALLDATA_LENGTH_LENGTH), call.calldata);
    }
}
exports.EvmScriptParser = EvmScriptParser;
