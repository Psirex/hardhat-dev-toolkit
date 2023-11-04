"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forward = exports.call = exports.evm = exports.EvmScriptParser = void 0;
const ethers_1 = require("ethers");
const contracts_1 = __importDefault(require("../contracts"));
const bytes_1 = __importDefault(require("../common/bytes"));
const ADDRESS_LENGTH = 20;
class AragonEvmForward {
    forwarder;
    calls;
    constructor(forwarder, calls) {
        this.forwarder = forwarder;
        this.calls = calls;
    }
    get address() {
        return contracts_1.default.address(this.forwarder);
    }
    get calldata() {
        return bytes_1.default.normalize(this.forwarder.interface.encodeFunctionData("forward", [evm(...this.calls)]));
    }
    format(padding = 0) {
        const label = contracts_1.default.label(this.forwarder);
        const methodName = this.forwarder.forward.name;
        const argNames = this.forwarder.forward.fragment.inputs
            .map((input) => input.type + " " + input.name)
            .join(", ");
        const signature = `${label}.${methodName}(${argNames})`;
        const subcalls = this.calls.map((call) => call.format(padding + 4));
        return [
            padLeft(signature, padding),
            padLeft("Parsed EVM Script calls:", padding + 2),
            ...subcalls,
        ].join("\n");
    }
}
class ContractEvmCall {
    contract;
    method;
    args;
    constructor(contract, method, args) {
        this.contract = contract;
        this.method = method;
        this.args = args;
    }
    get address() {
        return contracts_1.default.address(this.contract);
    }
    get calldata() {
        return bytes_1.default.normalize(this.contract.interface.encodeFunctionData(this.method, this.args.map((arg) => (arg && arg.target ? arg.target : arg))));
    }
    format(padding = 0) {
        const label = contracts_1.default.label(this.contract);
        const methodName = this.method.name;
        const argNames = this.method.inputs.map((input) => input.type).join(", ");
        const signature = padLeft(`${label}.${methodName}(${argNames})`, padding);
        const args = this.method.inputs.map((input, index) => padLeft(`  ${input.name}: ${this.formatArgument(this.args[index])}`, padding));
        return [signature, ...args].join("\n");
    }
    formatArgument(arg) {
        if (arg instanceof ethers_1.BaseContract) {
            return contracts_1.default.label(arg);
        }
        return arg;
    }
}
function padLeft(str, padding) {
    return " ".repeat(padding) + str;
}
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
/**
 *
 * @param calls - calls to encode as EVM script
 * @returns EVM script for the sequence of the calls
 */
function evm(...calls) {
    return EvmScriptParser.encode(calls);
}
exports.evm = evm;
/**
 * Creates an instance of the EVM call
 * @param method - method on the contract to call
 * @param args - args to use with the contract call
 * @returns an instance of the EVM call
 */
function call(method, args) {
    const contract = method._contract;
    if (!contract) {
        throw new Error(`Method does not have property _contract`);
    }
    if (!(contract instanceof ethers_1.BaseContract)) {
        throw new Error(`_contract is not an BaseContract instance`);
    }
    const address = contract.target;
    if (typeof address !== "string" || !(0, ethers_1.isHexString)(address)) {
        throw new Error(`contract.target must contain valid address, but received ${address}`);
    }
    return new ContractEvmCall(contract, method.fragment, args);
}
exports.call = call;
/**
 * Creates a call of the forward(evmScript) method
 * @param forwarder - contracts which support forwarding of the EVM scripts
 * @param calls - calls to pass encode as EVM Script and pass as and argument to forward method
 * @returns instance of the EVMCall with forward method call
 */
function forward(forwarder, calls) {
    return new AragonEvmForward(forwarder, calls);
}
exports.forward = forward;
