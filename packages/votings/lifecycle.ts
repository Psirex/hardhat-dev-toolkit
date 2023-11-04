import { ContractTransactionResponse, Signer } from "ethers";
import { config } from "./constants";
import providers from "../providers";
import { call, evm } from "./vote-script";
import contracts from "../contracts";
import { NonPayableOverrides } from "./types";

export async function start(
  creator: Signer,
  evmScript: string,
  meta: string,
  castVote: boolean = false,
  overrides?: NonPayableOverrides
) {
  const { voting, tokenManager } = contracts.create(config(await providers.chainId(creator)));

  const startVoteScript = evm(call(voting.newVote, [evmScript, meta, castVote, false]));
  return tokenManager.connect(creator).forward(startVoteScript, overrides ?? {});
}

export async function wait(tx: ContractTransactionResponse) {
  const receipt = await tx.wait();
  if (!receipt) {
    throw new Error("Invalid confirmations value");
  }

  const { voting } = contracts.create(config(await providers.chainId(tx)));
  const startVoteLog = receipt.logs.find(
    (log) => log.topics[0] === voting.interface.getEvent("StartVote")!.topicHash
  );
  if (!startVoteLog) {
    throw new Error("StartVote log not found");
  }

  const startVoteEvent = voting.interface.parseLog({
    data: startVoteLog?.data,
    topics: [...startVoteLog?.topics],
  })!;

  const voteId: bigint = startVoteEvent.args[0];

  return { voteId, receipt };
}

export async function execute<T extends Signer>(
  executor: T,
  voteId: number | bigint | string,
  overrides?: NonPayableOverrides
) {
  const { voting } = contracts.create(config(await providers.chainId(executor)));

  const tx = await voting.executeVote(voteId, overrides ?? {});
  const receipt = await tx.wait();
  if (!receipt) {
    throw new Error("transaction wait failed");
  }
  return receipt;
}
