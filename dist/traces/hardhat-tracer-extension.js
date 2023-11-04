"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardhatVmTraceStrategy = void 0;
const bytes_1 = __importDefault(require("../common/bytes"));
const lodash_1 = require("lodash");
class TraceContext {
    hash;
    calls = [];
    stack = [];
    selfdestructs = new Set();
    constructor(hash) {
        this.hash = hash;
    }
}
const HARDHAT_NETWORK_RESET_EVENT = "hardhatNetworkReset";
class HardhatVmTraceStrategy {
    vm = null;
    isInitialized = false;
    context = null;
    rootProvider = null;
    isTracingEnabled = false;
    listeners;
    traces = {};
    constructor() {
        this.listeners = {
            beforeTx: this.handleBeforeTx.bind(this),
            afterTx: this.handleAfterTx.bind(this),
            beforeMessage: this.handleBeforeMessage.bind(this),
            afterMessage: this.handleAfterMessage.bind(this),
            newContract: this.handleNewContract.bind(this),
        };
    }
    async init(provider) {
        if (this.isInitialized) {
            if (this.rootProvider === unwrapProvider(provider))
                return;
            throw new Error("Already initialized");
        }
        this.isInitialized = true;
        await provider._init();
        this.rootProvider = unwrapProvider(provider);
        this.rootProvider.on(HARDHAT_NETWORK_RESET_EVENT, () => {
            this.unsubscribe();
            this.vm = this.getHardhatVM();
            this.subscribe();
        });
        this.vm = this.getHardhatVM();
        this.subscribe();
    }
    isSameRootProvider(provider) {
        return this.rootProvider === unwrapProvider(provider);
    }
    async trace(receipt) {
        const traceData = this.traces[receipt.hash];
        if (!traceData) {
            throw new Error([
                `Trace for transaction ${receipt.hash} not found.`,
                `Make sure that tracer was instantiated before the transaction was sent`,
            ].join(" "));
        }
        return traceData;
    }
    enableTracing() {
        this.isTracingEnabled = true;
    }
    disableTracing() {
        this.isTracingEnabled = false;
    }
    unsubscribe() {
        if (!this.vm) {
            throw new Error(`Unitialized`);
        }
        this.vm.events.off("beforeTx", this.listeners.beforeTx);
        this.vm.events.off("afterTx", this.listeners.afterTx);
        this.vm.evm.events?.off("beforeMessage", this.listeners.beforeMessage);
        this.vm.evm.events?.off("afterMessage", this.listeners.afterMessage);
        this.vm.evm.events?.off("newContract", this.listeners.newContract);
    }
    subscribe() {
        if (!this.vm) {
            throw new Error(`Unitialized`);
        }
        this.vm.events.on("beforeTx", this.listeners.beforeTx);
        this.vm.events.on("afterTx", this.listeners.afterTx);
        this.vm.evm.events?.on("beforeMessage", this.listeners.beforeMessage);
        this.vm.evm.events?.on("afterMessage", this.listeners.afterMessage);
        this.vm.evm.events?.on("newContract", this.listeners.newContract);
    }
    handleBeforeTx(tx, resolve) {
        if (this.isTracingEnabled) {
            if (this.context)
                throw new Error("Another tracing is in progress");
            this.context = new TraceContext(bytes_1.default.normalize(tx.hash().toString("hex")));
        }
        resolve?.();
    }
    handleAfterTx(_, resolve) {
        if (this.isTracingEnabled) {
            if (!this.context)
                throw new Error("Active trace is not set");
            this.traces[this.context.hash] = this.context.calls;
            if (this.context.stack.length !== 0) {
                throw new Error("Context stack must be clear after tx handling");
            }
            this.context = null;
        }
        resolve?.();
    }
    handleBeforeMessage(message, resolve) {
        if (this.isTracingEnabled) {
            if (!this.context) {
                throw new Error("[hardhat-tracer]: trace is undefined in handleBeforeMessage");
            }
            let item;
            if (message.delegatecall) {
                item = this.seedDelegateCallItem(message);
            }
            else if (message.to) {
                item = this.seedCallItem(message);
            }
            else if (message.to === undefined && message.salt === undefined) {
                item = this.seedCreateItem(message);
            }
            else if (message.to === undefined && message.salt !== undefined) {
                item = this.seedCreate2Item(message);
            }
            else {
                item = this.seedUnknownItem(message);
                console.error("handleBeforeMessage: message type not handled", message);
            }
            this.context.calls.push(item);
            this.context.stack.push(item);
        }
        resolve?.();
    }
    handleAfterMessage(evmResult, resolve) {
        if (this.isTracingEnabled) {
            if (!this.context) {
                throw new Error("[hardhat-tracer]: trace is undefined in handleAfterMessage");
            }
            const context = this.context.stack.pop();
            if (!context) {
                throw new Error("Context is empty");
            }
            if (evmResult.execResult.selfdestruct) {
                const selfdestructs = Object.entries(evmResult.execResult.selfdestruct);
                for (const [address, benificiary] of selfdestructs) {
                    const normalizedAddress = bytes_1.default.normalize(address);
                    if (this.context.selfdestructs.has(normalizedAddress))
                        continue;
                    this.context.selfdestructs.add(normalizedAddress);
                    this.context.calls.push(this.seedSelfDestructItem(context.depth + 1, normalizedAddress, bytes_1.default.normalize(benificiary.toString("hex"))));
                }
            }
            context.error = evmResult.execResult.exceptionError?.error;
            context.gasUsed = Number(evmResult.execResult.executionGasUsed);
            if (context.type === "CALL" ||
                context.type === "DELEGATECALL" ||
                context.type === "STATICCALL" ||
                context.type === "UNKNOWN") {
                context.output = bytes_1.default.normalize(evmResult.execResult.returnValue.toString("hex"));
            }
        }
        resolve?.();
    }
    handleNewContract(contract, resolve) {
        if (this.isTracingEnabled) {
            if (!this.context) {
                throw new Error("[hardhat-tracer]: context is undefined in handleAfterMessage");
            }
            const top = this.context.stack[this.context.stack.length - 1];
            if (!top) {
                throw new Error("Context is empty");
            }
            if (top.type !== "CREATE" && top.type !== "CREATE2") {
                throw new Error("Invalid parent context operation");
            }
            top.deployedAddress = bytes_1.default.normalize(contract.address.toString());
        }
        resolve?.();
    }
    seedBaseCallItem(type, message) {
        return {
            type,
            depth: message.depth,
            gas: Number(message.gasLimit.toString()),
            gasUsed: -1,
            value: 0n,
        };
    }
    seedDelegateCallItem(message) {
        if (message.to === undefined) {
            throw new Error("[hardhat-tracer]: message.to is undefined on delegate call parsing");
        }
        return {
            ...this.seedBaseCallItem("DELEGATECALL", message),
            to: bytes_1.default.prefix0x((message._codeAddress ?? message.to).toString()),
            input: bytes_1.default.prefix0x(message.data.toString("hex")),
            output: "",
        };
    }
    seedCallItem(message) {
        return {
            ...this.seedBaseCallItem("CALL", message),
            to: bytes_1.default.prefix0x((message._codeAddress ?? message.to).toString()),
            input: bytes_1.default.prefix0x(message.data.toString("hex")),
            value: bytes_1.default.toBigInt(message.value.toString(16)),
            output: "",
        };
    }
    seedCreateItem(message) {
        return {
            ...this.seedBaseCallItem("CREATE", message),
            initCode: bytes_1.default.prefix0x(message.data.toString("hex")),
            value: bytes_1.default.toBigInt(message.value.toString(16)),
            deployedAddress: "",
        };
    }
    seedCreate2Item(message) {
        return {
            ...this.seedBaseCallItem("CREATE2", message),
            salt: bytes_1.default.prefix0x(message.salt.toString("hex")),
            initCode: bytes_1.default.prefix0x(message.data.toString("hex")),
            value: bytes_1.default.toBigInt(message.value.toString(16)),
            deployedAddress: "",
        };
    }
    seedSelfDestructItem(depth, contract, beneficiary) {
        return {
            depth,
            value: 0n,
            contract,
            gas: -1,
            gasUsed: -1,
            beneficiary,
            type: "SELFDESTRUCT",
        };
    }
    seedUnknownItem(message) {
        return {
            ...this.seedBaseCallItem("UNKNOWN", message),
            output: "",
        };
    }
    getHardhatVM() {
        if (!this.rootProvider) {
            throw new Error(`Not initialized`);
        }
        const node = (0, lodash_1.get)(this.rootProvider, "_node");
        if (!node) {
            throw new Error("HardhatEthersProvider wasn't initialized properly");
        }
        const vm = (0, lodash_1.get)(node, "_vm");
        if (!vm) {
            throw new Error("_vm property is missing on node instance");
        }
        return vm;
    }
}
exports.HardhatVmTraceStrategy = HardhatVmTraceStrategy;
function unwrapProvider(provider) {
    provider = provider._hardhatProvider ?? provider;
    const unwrappedProviders = new Set();
    while (true) {
        const unwrapped = provider._wrapped;
        if (!unwrapped)
            return provider;
        if (unwrappedProviders.has(unwrapped)) {
            throw new Error(`Providers cyclic dependency`);
        }
        unwrappedProviders.add(unwrapped);
        provider = unwrapped;
    }
}
