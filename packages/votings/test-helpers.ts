import type { BigNumberish, ContractTransactionReceipt, Signer } from "ethers";
import providers, { RpcProvider } from "../providers";
import {
  CREATOR,
  CREATOR_ETH_BALANCE,
  CREATOR_LDO_BALANCE,
  DEFAULT_GAS_LIMIT,
  VOTE_DURATION,
  config,
  getWhale,
} from "./constants";
import { start, wait } from "./lifecycle";
import contracts from "../contracts";
import { NonPayableOverrides } from "./types";

export async function creator(provider: RpcProvider): Promise<Signer> {
  const { unlock, lock } = providers.cheats(provider);

  const { ldo } = contracts.create(config(await providers.chainId(provider)), provider);

  const [creator, creatorLdoBalance] = await Promise.all([
    unlock(CREATOR, CREATOR_ETH_BALANCE),
    ldo.balanceOf(CREATOR),
  ]);

  if (creatorLdoBalance === 0n) {
    const whaleAddress = getWhale(await providers.chainId(provider));
    const whaleBalanceBefore = await provider.getBalance(whaleAddress);
    const whale = await unlock(whaleAddress, 10n * 10n ** 18n);
    await ldo.connect(whale).transfer(CREATOR, CREATOR_LDO_BALANCE);
    await lock(whaleAddress, whaleBalanceBefore);
  }
  return creator;
}

export async function pass(
  provider: RpcProvider,
  voteId: BigNumberish,
  overrides: NonPayableOverrides = { gasLimit: DEFAULT_GAS_LIMIT }
) {
  const chainId = await providers.chainId(provider);
  const { unlock, lock, increaseTime } = providers.cheats(provider);

  const whaleAddress = getWhale(chainId);

  const whaleBalanceBefore = await provider.getBalance(whaleAddress);
  const whale = await unlock(whaleAddress, 10n * 10n ** 18n);

  const { ldo, voting } = contracts.create(config(await providers.chainId(provider)), whale);

  await ldo.transfer(CREATOR, CREATOR_LDO_BALANCE);

  await voting.vote(voteId, true, false);

  await increaseTime(VOTE_DURATION);

  const tx = await voting.executeVote(voteId, overrides);

  await lock(whaleAddress, whaleBalanceBefore);

  const receipt = await tx.wait();
  if (!receipt) {
    throw new Error("transaction wait failed");
  }
  return receipt;
}

interface AdoptResult {
  voteId: bigint;
  createReceipt: ContractTransactionReceipt;
  enactReceipt: ContractTransactionReceipt;
}

export async function adopt(
  provider: RpcProvider,
  voteScript: string,
  description: string,
  overrides: NonPayableOverrides = { gasLimit: DEFAULT_GAS_LIMIT }
): Promise<AdoptResult> {
  const { voteId, receipt: createReceipt } = await wait(
    await start(await creator(provider), voteScript, description)
  );
  const enactReceipt = await pass(provider, voteId, overrides);
  return { voteId, createReceipt, enactReceipt };
}
