import { ChainId } from "../common";
import { NamedContractData, NamedContractDataCache } from "./types";
export declare class NamedContractDataMemoryCache implements NamedContractDataCache {
    private data;
    get(chainId: ChainId, address: Address): Promise<NamedContractData | null>;
    set(chainId: ChainId, address: Address, abi: NamedContractData): Promise<void>;
}
export declare class NamedContractDataJsonCache implements NamedContractDataCache {
    private static instances;
    static create(dirPath: string): NamedContractDataJsonCache | undefined;
    private dirPath;
    private data;
    private constructor();
    get(chainId: ChainId, address: Address): Promise<NamedContractData | null>;
    set(chainId: ChainId, address: Address, abi: NamedContractData): Promise<void>;
    private getFilePath;
    private save;
    private load;
    private checkContractAbisDir;
    private checkFile;
}
