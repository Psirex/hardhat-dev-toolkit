"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trace = exports.hardhat = void 0;
const config_1 = require("hardhat/config");
const providers_1 = __importDefault(require("../providers"));
const trace_tx_strategy_1 = require("./trace-tx-strategy");
const debug_trace_tx_strategy_1 = require("./debug-trace-tx-strategy");
const hardhat_ethers_provider_1 = require("@nomicfoundation/hardhat-ethers/internal/hardhat-ethers-provider");
const tx_tracer_1 = require("./tx-tracer");
const contracts_1 = __importDefault(require("../contracts"));
const hardhat_tracer_extension_1 = require("./hardhat-tracer-extension");
// hh tracer must be activated manually before the transaction
let hhTraceStrategy = new hardhat_tracer_extension_1.HardhatVmTraceStrategy();
function attachTracer() {
    (0, config_1.extendProvider)(async (provider) => {
        await hhTraceStrategy.init(provider);
        return provider;
    });
}
function isTracingEnabled() {
    return hhTraceStrategy.isTracingEnabled;
}
function enableTracing() {
    hhTraceStrategy.enableTracing();
}
function disableTracing() {
    hhTraceStrategy.disableTracing();
}
exports.hardhat = {
    setup: attachTracer,
    enableTracing,
    disableTracing,
    isTracingEnabled,
};
async function trace(receipt) {
    const provider = providers_1.default.provider(receipt);
    let strategy = null;
    if (provider instanceof hardhat_ethers_provider_1.HardhatEthersProvider || hhTraceStrategy.isSameRootProvider(provider)) {
        if (!hhTraceStrategy.isInitialized) {
            throw new Error(`Tracer wasn't attach to hre.ethers.provider. Please add call traces.attach() to the hardhat.config `);
        }
        return new tx_tracer_1.TxTracer(hhTraceStrategy, contracts_1.default.resolver()).trace(receipt);
    }
    const { name } = await providers_1.default.cheats(provider).node();
    strategy = name === "anvil" ? new trace_tx_strategy_1.TraceTxStrategy(provider) : new debug_trace_tx_strategy_1.DebugTxTraceStrategy(provider);
    const tracer = new tx_tracer_1.TxTracer(strategy, contracts_1.default.resolver());
    return tracer.trace(receipt);
}
exports.trace = trace;
