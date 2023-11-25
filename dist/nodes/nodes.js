"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_HOST = exports.DEFAULT_PORT = void 0;
const ethers_1 = require("ethers");
const node_child_process_1 = require("node:child_process");
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const lodash_1 = require("lodash");
const files_1 = __importDefault(require("../common/files"));
const tree_kill_1 = __importDefault(require("tree-kill"));
exports.DEFAULT_PORT = 8545;
exports.DEFAULT_HOST = "127.0.0.1";
let config = {
    logsDir: node_path_1.default.join(__dirname, "..", "..", "rpc-node-logs"),
};
function setLogsDir(path) {
    config.logsDir = path;
}
function getLogsDir() {
    return config.logsDir;
}
function spawnHardhatProcess(options) {
    const flags = (0, lodash_1.flatten)(Object.entries(options)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => ["--" + (0, lodash_1.kebabCase)(key), value.toString()]));
    return spawnProcess({
        command: "npx",
        args: ["hardhat", "node"],
        flags,
    });
}
function spawnAnvilProcess(options) {
    const flags = (0, lodash_1.flatten)(Object.entries(options)
        .filter(([, value]) => value !== undefined || value !== false)
        .map(([key, value]) => {
        const kebabKey = "--" + (0, lodash_1.kebabCase)(key);
        return typeof value === "boolean" ? [kebabKey] : [kebabKey, value.toString()];
    }));
    return spawnProcess({ command: "anvil", flags });
}
function spawnGanacheProcess(options) {
    const prefixFlag = (prefix, flag) => `--${prefix}.${flag}`;
    const flags = [];
    for (const [namespace, namespaceFlags] of Object.entries(options)) {
        for (const [flag, value] of Object.entries(namespaceFlags) || {}) {
            if (value === undefined)
                continue;
            flags.push(prefixFlag(namespace, flag), value.toString());
        }
    }
    return spawnProcess({ command: "npx", args: ["ganache-cli"], flags });
}
async function spawnNode(name, options = {}) {
    let port;
    let host;
    let node;
    if (name === "anvil") {
        port = options.port ?? exports.DEFAULT_PORT;
        host = options.host ?? exports.DEFAULT_HOST;
        node = spawnAnvilProcess({ ...options, port, host });
    }
    else if (name === "hardhat") {
        port = options.port ?? exports.DEFAULT_PORT;
        host = options.hostname ?? exports.DEFAULT_HOST;
        node = spawnHardhatProcess(options);
    }
    else if (name === "ganache") {
        port = options.server?.port ?? exports.DEFAULT_PORT;
        host = options.server?.host ?? exports.DEFAULT_HOST;
        node = spawnGanacheProcess({
            ...options,
            server: { ...options.server, port, host },
        });
    }
    else {
        throw new Error(`Unsupported node "${name}"`);
    }
    const nodePid = node.pid;
    if (nodePid === undefined) {
        throw new Error("Failed to spawn process");
    }
    process.on("exit", () => {
        (0, tree_kill_1.default)(nodePid);
    });
    await files_1.default.touchDir(config.logsDir);
    return new Promise((resolve, reject) => {
        const url = `http://${host}:${port}`;
        const provider = new ethers_1.JsonRpcProvider(url);
        const absoluteLogPath = node_path_1.default.resolve(config.logsDir, `${name}_${port}.log`);
        const logStream = (0, node_fs_1.createWriteStream)(absoluteLogPath, { encoding: "utf-8" });
        const errorListener = (chunk) => reject(new Error(`RPC Node Error:: ${chunk.toString()}`));
        const stop = () => {
            return new Promise((resolve) => {
                node.on("exit", () => resolve());
                (0, tree_kill_1.default)(nodePid);
            });
        };
        const nodeRunDataListener = (chunk) => {
            const hardhatRunMessage = `Started HTTP and WebSocket JSON-RPC server at ${url}`;
            const nodeRunMessage = `Listening on ${host}:${port}`;
            const chunkString = chunk.toString();
            if (chunkString.includes(hardhatRunMessage) || chunkString.includes(nodeRunMessage)) {
                node.stdin.off("data", nodeRunDataListener);
                const url = "http://" + host + ":" + port;
                resolve({ host, port, process: node, url, provider, stop });
            }
        };
        const nodeLogDataListener = (chunk) => {
            logStream.write(chunk.toString());
        };
        node.stderr.on("data", errorListener);
        node.stdout.on("data", nodeRunDataListener);
        node.stdout.on("data", nodeLogDataListener);
        node.stdout.on("close", () => {
            node.stdout.off("data", nodeLogDataListener);
            node.stdout.off("data", nodeRunDataListener);
            logStream.close();
        });
    });
}
function spawnProcess(options) {
    const args = options.args || [];
    const spawnedProcess = (0, node_child_process_1.spawn)(options.command, [...args, ...(options.flags || [])]);
    if (options.listeners?.data) {
        spawnedProcess.stdout.on("data", options.listeners.data);
    }
    if (options.listeners?.error) {
        spawnedProcess.stderr.on("data", options.listeners.error);
    }
    process.on("exit", () => {
        spawnedProcess.kill();
    });
    return spawnedProcess;
}
exports.default = { spawn: spawnNode, setLogsDir, getLogsDir, DEFAULT_HOST: exports.DEFAULT_HOST, DEFAULT_PORT: exports.DEFAULT_PORT };
