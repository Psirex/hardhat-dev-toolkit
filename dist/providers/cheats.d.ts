import { RpcProvider, SignerWithAddress, SnapshotRestorer } from "./types";
type NodeName = "hardhat" | "anvil" | "ganache";
interface LocalNodeInfo {
    name: NodeName;
    version: string;
}
interface Cheats {
    node(): Promise<LocalNodeInfo>;
    signers(): Promise<SignerWithAddress[]>;
    increaseTime(seconds: number | bigint): Promise<void>;
    mine(): Promise<void>;
    snapshot(): Promise<SnapshotRestorer>;
    revert(snapshotId: string): Promise<void>;
    setCode(address: Address, code: string): Promise<void>;
    setBalance(address: Address, balance: bigint): Promise<void>;
    unlock(address: Address, balance?: bigint): Promise<SignerWithAddress>;
    lock(address: Address, balance?: bigint): Promise<void>;
    reset(params?: {
        jsonRpcUrl?: string;
        blockNumber?: number;
    }): Promise<void>;
}
export declare function cheats(provider: RpcProvider): Cheats;
export {};
