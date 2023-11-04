"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trace = void 0;
const constants_1 = require("./constants");
const providers_1 = __importDefault(require("../providers"));
const traces_1 = __importDefault(require("../traces"));
const bytes_1 = __importDefault(require("../common/bytes"));
const contracts_1 = __importDefault(require("../contracts"));
async function trace(enactReceipt, options = { extended: false }) {
    const provider = providers_1.default.provider(enactReceipt);
    const chainId = await providers_1.default.chainId(provider);
    const { acl, kernel, callsScript, evmScriptRegistry, implementations: { kernel: kernelImpl, acl: aclImpl, evmScriptRegistry: evmScriptRegistryImpl }, } = contracts_1.default.create((0, constants_1.config)(chainId), provider);
    const trace = await traces_1.default.trace(enactReceipt);
    if (options.extended)
        return trace;
    return trace
        .filter(omitMethodCalls([
        {
            type: "CALL",
            address: kernel.address,
            fragment: kernel.getFunction("getApp").fragment,
        },
        {
            type: "DELEGATECALL",
            address: kernelImpl.address,
            fragment: kernelImpl.getFunction("getApp").fragment,
        },
        {
            type: "CALL",
            address: kernel.address,
            fragment: kernel.getFunction("hasPermission").fragment,
        },
        {
            type: "DELEGATECALL",
            address: kernelImpl.address,
            fragment: kernelImpl.getFunction("hasPermission").fragment,
        },
        {
            type: "CALL",
            address: evmScriptRegistry.address,
            fragment: evmScriptRegistry.getFunction("getScriptExecutor").fragment,
        },
        {
            type: "DELEGATECALL",
            address: evmScriptRegistryImpl.address,
            fragment: evmScriptRegistryImpl.getFunction("getScriptExecutor").fragment,
        },
        {
            type: "CALL",
            address: acl.address,
            fragment: acl.getFunction("hasPermission(address,address,bytes32)").fragment,
        },
        {
            type: "DELEGATECALL",
            address: aclImpl.address,
            fragment: aclImpl.getFunction("hasPermission(address,address,bytes32)").fragment,
        },
        {
            type: "CALL",
            address: acl.address,
            fragment: acl.getFunction("hasPermission(address,address,bytes32,bytes)").fragment,
        },
        {
            type: "DELEGATECALL",
            address: aclImpl.address,
            fragment: aclImpl.getFunction("hasPermission(address,address,bytes32,bytes)").fragment,
        },
        {
            type: "CALL",
            address: acl.address,
            fragment: acl.getFunction("hasPermission(address,address,bytes32,uint256[])").fragment,
        },
        {
            type: "DELEGATECALL",
            address: aclImpl.address,
            fragment: aclImpl.getFunction("hasPermission(address,address,bytes32,uint256[])")
                .fragment,
        },
        {
            type: "DELEGATECALL",
            address: callsScript.address,
            fragment: callsScript.getFunction("execScript").fragment,
        },
    ]))
        .filter(omitProxyDelegateCalls())
        .filter(omitStaticCalls());
}
exports.trace = trace;
function omitStaticCalls() {
    return (opCode) => {
        return opCode.type !== "STATICCALL";
    };
}
function omitProxyDelegateCalls() {
    return (opCode, i, opCodes) => {
        if (opCode.type !== "DELEGATECALL")
            return true;
        const prevOpcode = opCodes[i - 1];
        if (prevOpcode.type !== "CALL" && prevOpcode.type !== "STATICCALL")
            return true;
        return opCode.input !== prevOpcode.input;
    };
}
function omitMethodCalls(calls) {
    return (opCode) => !calls.some((call) => call.type === opCode.type &&
        bytes_1.default.isEqual(call.address, opCode.to) &&
        (call.fragment
            ? bytes_1.default.isEqual(call.fragment.selector, bytes_1.default.slice(opCode.input, 0, 4))
            : true));
}
