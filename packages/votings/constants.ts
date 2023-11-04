import { AddressLike, BaseContract, BigNumberish, BytesLike } from "ethers";
import { ChainId } from "../common";
import contracts from "../contracts";
import { Contract__factory } from "../contracts/named-contract";
import { TypedContractMethod } from "./types";

export const CREATOR = "0x1D0f1d0f1d0F1d0F1d0F1d0F1d0f1D0f1D0F1d0F";
export const CREATOR_ETH_BALANCE = 10n * 10n ** 18n; // 10 ETH
export const CREATOR_LDO_BALANCE = 10n ** 18n; // 1 LDO
export const VOTE_DURATION = 5 * 24 * 60 * 60;
export const DEFAULT_GAS_LIMIT = 5_000_000

const EmptyContractFactory = new Contract__factory([]);

type TypedContract<T> = BaseContract & T;

type LdoContract = TypedContract<{
  balanceOf: TypedContractMethod<[_owner: AddressLike], [bigint], "view">;
  transfer: TypedContractMethod<[_to: AddressLike, _amount: BigNumberish], [boolean], "nonpayable">;
}>;

const LdoFactory = new Contract__factory<LdoContract>([
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "success",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
]);

const AclFactory = new Contract__factory([
  {
    constant: true,
    inputs: [
      { name: "_who", type: "address" },
      { name: "_where", type: "address" },
      { name: "_what", type: "bytes32" },
    ],
    name: "hasPermission",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_who", type: "address" },
      { name: "_where", type: "address" },
      { name: "_what", type: "bytes32" },
      { name: "_how", type: "uint256[]" },
    ],
    name: "hasPermission",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_who", type: "address" },
      { name: "_where", type: "address" },
      { name: "_what", type: "bytes32" },
      { name: "_how", type: "bytes" },
    ],
    name: "hasPermission",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
]);

const KernelFactory = new Contract__factory([
  {
    constant: true,
    inputs: [
      { name: "_namespace", type: "bytes32" },
      { name: "_appId", type: "bytes32" },
    ],
    name: "getApp",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "_who", type: "address" },
      { name: "_where", type: "address" },
      { name: "_what", type: "bytes32" },
      { name: "_how", type: "bytes" },
    ],
    name: "hasPermission",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
]);

type VotingContract = BaseContract & {
  vote: TypedContractMethod<
    [_voteId: BigNumberish, _supports: boolean, _executesIfDecided_deprecated: boolean],
    [void],
    "nonpayable"
  >;
  newVote: TypedContractMethod<
    [
      _executionScript: BytesLike,
      _metadata: string,
      _castVote: boolean,
      _executesIfDecided_deprecated: boolean
    ],
    [bigint],
    "nonpayable"
  >;
  executeVote: TypedContractMethod<[_voteId: BigNumberish], [void], "nonpayable">;
};

const VotingFactory = new Contract__factory<VotingContract>([
  {
    constant: false,
    inputs: [{ name: "_voteId", type: "uint256" }],
    name: "executeVote",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "executor", type: "address" },
      { indexed: false, name: "script", type: "bytes" },
      { indexed: false, name: "input", type: "bytes" },
      { indexed: false, name: "returnData", type: "bytes" },
    ],
    name: "ScriptResult",
    type: "event",
  },
  {
    constant: false,
    inputs: [
      { name: "_executionScript", type: "bytes" },
      { name: "_metadata", type: "string" },
    ],
    name: "newVote",
    outputs: [{ name: "voteId", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_voteId", type: "uint256" },
      { name: "_supports", type: "bool" },
      { name: "_executesIfDecided_deprecated", type: "bool" },
    ],
    name: "vote",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
]);

const EvmScriptRegistryFactory = new Contract__factory([
  {
    constant: true,
    inputs: [{ name: "_script", type: "bytes" }],
    name: "getScriptExecutor",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
]);

const CallsScriptFactory = new Contract__factory([
  {
    constant: false,
    inputs: [
      {
        name: "_script",
        type: "bytes",
      },
      {
        name: "",
        type: "bytes",
      },
      {
        name: "_blacklist",
        type: "address[]",
      },
    ],
    name: "execScript",
    outputs: [
      {
        name: "",
        type: "bytes",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
]);

type TokenManager = BaseContract & {
  forward: TypedContractMethod<[_evmScript: BytesLike], [void], "nonpayable">;
};

const TokenManagerFactory = new Contract__factory<TokenManager>([
  {
    constant: false,
    inputs: [{ name: "_evmScript", type: "bytes" }],
    name: "forward",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
]);

function getAddresses(chainId: ChainId) {
  const chainIdString = chainId.toString();
  if (chainIdString !== "1" && chainIdString !== "5") {
    throw new Error("Unsupported");
  }
  return ADDRESSES[chainIdString];
}

export function config(chainId: ChainId) {
  const addresses = getAddresses(chainId);
  return {
    ldo: {
      impl: {
        address: addresses.ldo,
        factory: LdoFactory,
      },
      proxy: null,
    },
    acl: {
      impl: {
        address: addresses.aclImpl,
        factory: AclFactory,
      },
      proxy: {
        address: addresses.aclProxy,
        factory: EmptyContractFactory,
      },
    },
    kernel: {
      impl: {
        address: addresses.kernelImpl,
        factory: KernelFactory,
      },
      proxy: {
        address: addresses.kernelProxy,
        factory: EmptyContractFactory,
      },
    },
    voting: {
      impl: {
        address: addresses.voting,
        factory: VotingFactory,
      },
      proxy: null,
    },
    evmScriptRegistry: {
      impl: {
        address: addresses.evmScriptRegistryImpl,
        factory: EvmScriptRegistryFactory,
      },
      proxy: {
        address: addresses.evmScriptRegistryProxy,
        factory: EmptyContractFactory,
      },
    },
    callsScript: {
      impl: {
        address: addresses.callsScript,
        factory: CallsScriptFactory,
      },
      proxy: null,
    },
    tokenManager: {
      impl: {
        address: addresses.tokenManager,
        factory: TokenManagerFactory,
      },
      proxy: null,
    },
  } as const;
}

export const CONTRACTS = {
  "1": contracts.create(config(1)),
};

const MAINNET_ADDRESSES = {
  ldo: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
  aclProxy: "0x9895F0F17cc1d1891b6f18ee0b483B6f221b37Bb",
  aclImpl: "0x9f3b9198911054B122fDb865f8A5Ac516201c339",
  voting: "0x2e59A20f205bB85a89C53f1936454680651E618e",
  kernelProxy: "0xb8FFC3Cd6e7Cf5a098A1c92F48009765B24088Dc",
  kernelImpl: "0x2b33CF282f867A7FF693A66e11B0FcC5552e4425",
  lidoLocator: "0xC1d0b3DE6792Bf6b4b37EccdcC24e45978Cfd2Eb",
  tokenManager: "0xf73a1260d222f447210581DDf212D915c09a3249",
  callsScript: "0x5cEb19e1890f677c3676d5ecDF7c501eBA01A054",
  evmScriptRegistryProxy: "0x853cc0D5917f49B57B8e9F89e491F5E18919093A",
  evmScriptRegistryImpl: "0xBF1Ce0Bc4EdaAD8e576b3b55e19c4C15Cf6999eb",
} as const;

const GOERLI_ADDRESSES = {
  ldo: "0x56340274fB5a72af1A3C6609061c451De7961Bd4",
  aclProxy: "0xb3CF58412a00282934D3C3E73F49347567516E98",
  aclImpl: "0x74C81dd97338329367E5C52B1E3CBC5C757d9AEb",
  callsScript: "0x",
  evmScriptRegistryProxy: "0x",
  evmScriptRegistryImpl: "0x",
  voting: "0xbc0B67b4553f4CF52a913DE9A6eD0057E2E758Db",
  kernelProxy: "0x1dD91b354Ebd706aB3Ac7c727455C7BAA164945A",
  kernelImpl: "0xcC272fA3bFa4AE2043320e2d56Cf5AE439c62C3d",
  lidoLocator: "0x1eDf09b5023DC86737b59dE68a8130De878984f5",
  tokenManager: "0xAb304946E8Ed172037aC9aBF9da58a6a7C8d443B",
} as const;

export const ADDRESSES = {
  "1": MAINNET_ADDRESSES,
  "5": GOERLI_ADDRESSES,
} as const;

export const LDO_WHALES = {
  1: "0x820fb25352BB0c5E03E07AFc1d86252fFD2F0A18",
  5: "0x319d5370715D24A1225817009BB23e676aE741D3",
} as const;

export function getWhale(chainId: ChainId) {
  const chainIdString = chainId.toString();
  if (chainIdString !== "1" && chainIdString !== "5") {
    throw new Error("Unsupported");
  }
  return LDO_WHALES[chainIdString];
}
