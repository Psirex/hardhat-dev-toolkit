import { cheats } from "./cheats";
import { ContractRunner } from "ethers";
import { RpcProvider } from "./types";
declare function provider(runner: ContractRunner): RpcProvider;
declare function chainId(runner: ContractRunner): Promise<bigint>;
declare const _default: {
    cheats: typeof cheats;
    provider: typeof provider;
    chainId: typeof chainId;
};
export default _default;
