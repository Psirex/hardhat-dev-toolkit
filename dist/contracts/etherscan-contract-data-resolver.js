"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtherscanContractDataResolver = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const etherscan_chains_config_1 = require("./etherscan-chains-config");
const bytes_1 = __importDefault(require("../common/bytes"));
class EtherscanContractDataResolver {
    chains;
    etherscanToken;
    apiUrl(chainId) {
        for (let config of this.chains) {
            if (config.chainId.toString() === chainId.toString()) {
                return config.urls.apiURL;
            }
        }
        throw new Error(`Unsupported chain id "${chainId}"`);
    }
    constructor(etherscanToken, customChains = []) {
        this.etherscanToken = etherscanToken;
        this.chains = [...customChains, ...etherscan_chains_config_1.BUILTIN_ETHERSCAN_CHAINS];
    }
    async resolve(chainId, address) {
        const sourceCode = await this.getContractSourceCode(chainId, address);
        if (!sourceCode || sourceCode.ABI === "Contract source code not verified")
            return null;
        return {
            name: sourceCode.ContractName,
            abi: JSON.parse(sourceCode.ABI),
            isProxy: sourceCode.Proxy === "1",
            implementation: sourceCode.Implementation === "" ? undefined : bytes_1.default.normalize(sourceCode.Implementation),
        };
    }
    async getContractSourceCode(chainId, address) {
        const getSourceCodeUrl = this.apiUrl(chainId) +
            "?" +
            [
                "module=contract",
                "action=getsourcecode",
                `address=${address}`,
                `apikey=${this.etherscanToken}`,
            ].join("&");
        const request = await (0, node_fetch_1.default)(getSourceCodeUrl);
        const response = (await request.json());
        if (response.status === "0") {
            if (response.result === "Contract source code not verified") {
                return undefined;
            }
            throw new Error(`Etherscan request failed: ${response}`);
        }
        if (response.status === "1" && Array.isArray(response.result)) {
            return response.result[0];
        }
        return undefined;
    }
}
exports.EtherscanContractDataResolver = EtherscanContractDataResolver;
