/// <reference types="node" />
import { JsonRpcProvider } from "ethers";
import { ChildProcessWithoutNullStreams } from "node:child_process";
export type Hardfork = "constantinople" | "byzantium" | "petersburg" | "istanbul" | "muirGlacier" | "berlin" | "london" | "arrowGlazier" | "grayGlacier" | "merge" | "shanghai";
export type RpcNodeName = "hardhat" | "anvil" | "ganache";
export type HardhatNodeOptions = Partial<{
    port: number;
    fork: string;
    forkBlockNumber: number;
    hostname: string;
}>;
export type AnvilNodeOptions = Partial<{
    accounts: number;
    blockTime: number;
    balance: number;
    configOut: string;
    derivationPath: string;
    dumpState: string;
    hardfork: "shanghai" | "paris" | "london" | "latest";
    init: string;
    ipc: string;
    loadState: string;
    mnemonic: string;
    noMining: boolean;
    order: "fees";
    port: number;
    pruneHistory: number;
    stateInterval: number;
    silent: boolean;
    state: string;
    timestamp: number;
    transactionBlockKeeper: number;
    allowOrigin: string;
    host: string;
    noCors: boolean;
    computeUnitsPerSecond: number;
    forkUrl: string;
    forkBlockNumber: number;
    forkChainId: number | bigint;
    forkRetryBackoff: number;
    noRateLimit: boolean;
    noStorageCaching: boolean;
    retries: number;
    timeout: number;
    blockBaseFeePerGas: number;
    chainId: number;
    codeSizeLimit: number;
    disableBlockGasLimit: boolean;
    gasLimit: number;
    gasPrice: number;
    autoImpersonate: boolean;
    stepsTracing: boolean;
}>;
export type GanacheNodeOptions = Partial<{
    chain: Partial<{
        allowUnlimitedContractSize: boolean;
        allowUnlimitedInitCodeSize: boolean;
        asyncRequestProcessing: boolean;
        chainId: number;
        networkId: number;
        time: string;
        hardfork: Hardfork;
        vmErrorsOnRPCResponse: boolean;
    }>;
    database: Partial<{
        dbPath: string;
    }>;
    logging: Partial<{
        debug: boolean;
        quiet: boolean;
        verbose: boolean;
        file: boolean;
    }>;
    miner: Partial<{
        blockTime: number;
        timestampIncrement: string;
        defaultGasPrice: string;
        blockGasLimit: string;
        difficulty: string;
        callGasLimit: string;
        instamine: "eager" | "strict";
        coinbase: string;
        extraData: string;
        priceBump: string;
    }>;
    wallet: Partial<{
        accounts: string[];
        totalAccounts: number;
        determenistic: boolean;
        seed: string;
        mnemonic: string;
        unlockedAccounts: string[];
        lock: boolean;
        passphrase: string;
        accountKeysPath: string;
        defaultBalance: number;
        hdPath: string;
    }>;
    fork: Partial<{
        url: string;
        network: "mainnet" | "goerli" | "görli" | "sepolia";
        blockNumber: number;
        preLatestConfirmation: number;
        username: string;
        password: string;
        jwt: string;
        userAgent: string;
        origin: string;
        headers: string[];
        requestsPerSecond: number;
        disableCache: boolean;
        deleteCache: boolean;
    }>;
    server: Partial<{
        ws: boolean;
        wsBinary: "true" | "false" | "auto" | boolean;
        rpcEndpoint: string;
        chunkSize: number;
        host: string;
        port: number;
    }>;
}>;
export interface SpawnedRpcNode {
    url: string;
    host: string;
    port: number;
    process: ChildProcessWithoutNullStreams;
    provider: JsonRpcProvider;
    stop(): Promise<void>;
}
export declare const DEFAULT_PORT = 8545;
export declare const DEFAULT_HOST = "127.0.0.1";
declare function setLogsDir(path: string): void;
declare function getLogsDir(): string;
declare function spawnNode(name: "anvil", options?: AnvilNodeOptions): Promise<SpawnedRpcNode>;
declare function spawnNode(name: "hardhat", options?: HardhatNodeOptions): Promise<SpawnedRpcNode>;
declare function spawnNode(name: "ganache", options?: GanacheNodeOptions): Promise<SpawnedRpcNode>;
declare const _default: {
    spawn: typeof spawnNode;
    setLogsDir: typeof setLogsDir;
    getLogsDir: typeof getLogsDir;
    DEFAULT_HOST: string;
    DEFAULT_PORT: number;
};
export default _default;
