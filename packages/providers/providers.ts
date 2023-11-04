import { cheats } from "./cheats";
import { ContractRunner } from "ethers";
import { RpcProvider } from "./types";
import { isHardhatEthersProvider, isJsonRpcProvider, UnsupportedProviderError } from "./utils";

function provider(runner: ContractRunner): RpcProvider {
  const { provider } = runner;

  if (!provider) {
    throw new Error("Provider is empty");
  }

  if (!isJsonRpcProvider(provider) && !isHardhatEthersProvider(provider)) {
    throw new UnsupportedProviderError(provider);
  }
  return provider as RpcProvider;
}

async function chainId(runner: ContractRunner): Promise<bigint> {
  const { chainId } = await provider(runner).getNetwork();
  return chainId;
}

export default { cheats, provider, chainId };
