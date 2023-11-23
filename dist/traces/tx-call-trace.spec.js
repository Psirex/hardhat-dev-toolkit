"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const tx_call_trace_1 = require("./tx-call-trace");
const ethers_1 = require("ethers");
const constants_1 = require("../votings/constants");
const contracts_1 = __importDefault(require("../contracts"));
const from = "0x6389cbcf38172a1e8ecf1c34c00cd7f603afb80c";
(0, node_test_1.default)("call trace formatting", () => {
    const { voting } = contracts_1.default.instances((0, constants_1.config)(1));
    const trace = new tx_call_trace_1.TxCallTrace(new ethers_1.Network("mainnet", 1), from, [
        {
            type: "CALL",
            depth: 0,
            gas: 4978796,
            gasUsed: 1259532,
            value: 0n,
            to: "0x2e59a20f205bb85a89c53f1936454680651e618e",
            input: "0xf98a4eca00000000000000000000000000000000000000000000000000000000000000a5",
            output: "0x",
            error: undefined,
        },
        {
            type: "DELEGATECALL",
            depth: 1,
            gas: 4978796,
            gasUsed: 1259532,
            value: 0n,
            to: "0x2e59a20f205bb85a89c53f1936454680651e618e",
            input: "0xf98a4eca00000000000000000000000000000000000000000000000000000000000000a5",
            output: "0x",
            error: undefined,
        },
        {
            type: 'CALL',
            depth: 2,
            gas: 3961155,
            gasUsed: 98002,
            value: 0n,
            to: '0x3e40d73eb977dc6a537af587d48316fee66e9c8c',
            input: '0xd948d468000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a00000000155032650b14df07b85bf18a3a3ec8e0af2e028d50000008485fa63d700000000000000000000000000000000000000000000000000000000000000400000000000000000000000005ee590effdf9456d5666002fba05fba8c3752cb7000000000000000000000000000000000000000000000000000000000000001750617261466920546563686e6f6c6f67696573204c4c43000000000000000000',
            output: '0x',
            error: undefined
        },
    ], {
        "0x2e59a20f205bb85a89c53f1936454680651e618e": voting,
    });
    console.log(trace.format());
});
