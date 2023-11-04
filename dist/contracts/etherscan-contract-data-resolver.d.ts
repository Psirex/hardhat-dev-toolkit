import { EtherscanChainConfig } from "./etherscan-chains-config";
import { NamedContractData, NamedContractDataResolver } from "./types";
import { ChainId } from "../common";
export declare class EtherscanContractDataResolver implements NamedContractDataResolver {
    private readonly chains;
    private readonly etherscanToken;
    private apiUrl;
    constructor(etherscanToken: string, customChains?: EtherscanChainConfig[]);
    resolve(chainId: ChainId, address: Address): Promise<NamedContractData | null>;
    private getContractSourceCode;
}
