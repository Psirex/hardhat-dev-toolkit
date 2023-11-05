"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cheats = void 0;
const bytes_1 = __importDefault(require("../common/bytes"));
const ethers_1 = require("ethers");
const signers_1 = require("@nomicfoundation/hardhat-ethers/signers");
const utils_1 = require("./utils");
class UnsupportedRpcNode extends Error {
    constructor(info) {
        super(`Node ${info} is not supported`);
    }
}
class InvalidEvmSnapshotResult extends Error {
    constructor() {
        super("The value returned by evm_snapshot should be a string");
    }
}
class InvalidEvmRevertResult extends Error {
    constructor() {
        super("The value returned by evm_revert should be a boolean");
    }
}
async function fetchNodeInfo(provider) {
    const clientInfo = await provider.send("web3_clientVersion", []);
    const [name = "unknown", version = "-1"] = clientInfo.toLowerCase().split("/");
    if (name.startsWith("anvil"))
        return { name: "anvil", version };
    if (name.startsWith("hardhat"))
        return { name: "hardhat", version };
    if (name.startsWith("ganache"))
        return { name: "ganache", version };
    throw new UnsupportedRpcNode(clientInfo);
}
async function sendMine(node, provider, blocks) {
    switch (node.name) {
        case "anvil":
            return provider.send("anvil_mine", [blocks]);
        case "hardhat":
            return provider.send("hardhat_mine", [blocks]);
        case "ganache":
            return provider.send("evm_mine", [{ blocks }]);
    }
}
function signer(provider, address) {
    if ((0, utils_1.isJsonRpcProvider)(provider)) {
        return Promise.resolve(new ethers_1.JsonRpcSigner(provider, address));
    }
    else if ((0, utils_1.isHardhatEthersProvider)(provider)) {
        return signers_1.HardhatEthersSigner.create(provider, address);
    }
    else {
        throw new utils_1.UnsupportedProviderError(provider);
    }
}
async function sendImpersonate(node, provider, address) {
    switch (node.name) {
        case "anvil":
            // hardhat returns null by default
            await provider.send("anvil_impersonateAccount", [address]);
            return true;
        case "hardhat":
            return provider.send("hardhat_impersonateAccount", [address]);
        case "ganache":
            await provider.send("evm_addAccount", [address, ""]);
            return provider.send("personal_unlockAccount", [address, ""]);
    }
}
async function sendSetCode(node, provider, address, code) {
    const params = [address, code];
    switch (node.name) {
        case "anvil":
            return provider.send("anvil_setCode", params);
        case "hardhat":
            return provider.send("hardhat_setCode", params);
        case "ganache":
            return provider.send("evm_setAccountCode", params);
    }
}
async function sendSetBalance(node, provider, address, balance) {
    const params = [address, bytes_1.default.encode(balance)];
    switch (node.name) {
        case "anvil":
            return provider.send("anvil_setBalance", params);
        case "hardhat":
            return provider.send("hardhat_setBalance", params);
        case "ganache":
            return provider.send("evm_setAccountBalance", params);
    }
}
async function sendReset(node, provider, jsonRpcUrl, blockNumber) {
    const params = {};
    if (jsonRpcUrl !== undefined) {
        if (!params.forking) {
            params.forking = {};
        }
        params.forking.jsonRpcUrl = jsonRpcUrl;
    }
    if (blockNumber !== undefined) {
        if (!params.forking) {
            params.forking = {};
        }
        params.forking.blockNumber = blockNumber;
    }
    switch (node.name) {
        case "anvil":
            return provider.send("anvil_reset", [params]);
        case "hardhat":
            return provider.send("hardhat_reset", [params]);
        case "ganache":
            throw new Error(`Ganache node does not support resetting`);
    }
}
async function sendLock(node, provider, address) {
    switch (node.name) {
        case "anvil":
            return provider.send("anvil_stopImpersonatingAccount", [address]);
        case "hardhat":
            return provider.send("hardhat_stopImpersonatingAccount", [address]);
        case "ganache":
            return provider.send("personal_lockAccount", [address]);
    }
}
function cheats(provider) {
    let cachedNode;
    async function revert(snapshotId) {
        const reverted = await provider.send("evm_revert", [snapshotId]);
        if (typeof reverted !== "boolean") {
            throw new InvalidEvmRevertResult();
        }
        if (!reverted) {
            throw new Error("Revert to snapshot failed");
        }
    }
    async function node() {
        if (!cachedNode) {
            cachedNode = await fetchNodeInfo(provider);
        }
        return cachedNode;
    }
    async function signers() {
        const accounts = await provider.send("eth_accounts", []);
        return Promise.all(accounts.map((address) => signer(provider, address)));
    }
    async function mine(blocks = 1) {
        await sendMine(await node(), provider, blocks);
    }
    async function increaseTime(seconds) {
        await provider.send("evm_increaseTime", [bytes_1.default.encode(seconds)]);
    }
    async function snapshot() {
        let snapshotId = await provider.send("evm_snapshot", []);
        if (typeof snapshotId !== "string") {
            throw new InvalidEvmSnapshotResult();
        }
        return {
            revert: async () => {
                await revert(snapshotId);
            },
            restore: async () => {
                await revert(snapshotId);
                // re-take the snapshot so that `restore` can be called again
                snapshotId = await provider.send("evm_snapshot", []);
            },
            snapshotId,
        };
    }
    async function setCode(address, code) {
        const success = await sendSetCode(await node(), provider, address, code);
        if (!success) {
            throw new Error(`Can't set the code for ${address}`);
        }
    }
    async function setBalance(address, balance) {
        const success = await sendSetBalance(await node(), provider, address, balance);
        if (success === false) {
            throw new Error(`Can't set the balance for ${address}`);
        }
    }
    async function unlock(address, balance) {
        const success = await sendImpersonate(await node(), provider, address);
        if (!success) {
            throw new Error(`Can't unlock the account ${address}`);
        }
        if (balance !== undefined) {
            await sendSetBalance(await node(), provider, address, balance);
        }
        return signer(provider, address);
    }
    async function lock(address, balance) {
        const success = await sendLock(await node(), provider, address);
        if (!success) {
            throw new Error(`Can't unlock the account ${address}`);
        }
        if (balance !== undefined) {
            await sendSetBalance(await node(), provider, address, balance);
        }
    }
    async function reset(params) {
        await sendReset(await node(), provider, params?.jsonRpcUrl, params?.blockNumber);
    }
    return {
        node,
        mine,
        signers,
        revert,
        snapshot,
        setCode,
        setBalance,
        increaseTime,
        unlock,
        lock,
        reset,
    };
}
exports.cheats = cheats;
