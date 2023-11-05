import { BaseContract, ContractRunner } from "ethers";
import bytes from "../common/bytes";
import { NamedContractsBuilder } from "./named-contract";
import { ContractsConfig, ProxiableContractConfig, ContractConfig, NamedContract } from "./types";
import { NamedContractsResolver } from "./named-contracts-resolver";
import { EtherscanChainConfig } from "./etherscan-chains-config";
import { ChainId } from "../common";

/**
 * @description Combines members of an intersection into a readable type.
 *
 * @see {@link https://twitter.com/mattpocockuk/status/1622730173446557697?s=20&t=NdpAcmEFXY01xkqU3KO0Mg}
 * @example
 * Prettify<{ a: string } & { b: string } & { c: number, d: bigint }>
 * => { a: string, b: string, c: number, d: bigint }
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type FactoryResult<T extends ContractConfig> = ReturnType<T["factory"]["connect"]>;

type GetInstanceAddress<T extends ProxiableContractConfig> = T["proxy"] extends ContractConfig
  ? T["proxy"]["address"]
  : T["impl"]["address"]

type Instances<T extends ContractsConfig> = {
  [K in keyof T]: T[K] extends ContractsConfig
    ? Instances<T[K]>
    : T[K] extends ProxiableContractConfig
    ? NamedContract<FactoryResult<T[K]["impl"]>, GetInstanceAddress<T[K]>>
    : never;
};

type OmitEmptyProxies<T extends ContractsConfig> = {
  [K in keyof T as T[K] extends ProxiableContractConfig
    ? T[K]["proxy"] extends ContractConfig
      ? K
      : never
    : K]: T[K] extends ProxiableContractConfig
    ? T[K]
    : T[K] extends ContractsConfig
    ? OmitEmptyProxies<T[K]>
    : never;
};

type GetProxyAddress<T extends ProxiableContractConfig> = T["proxy"] extends ContractConfig
  ? T["proxy"]["address"]
  : never;

type Proxies<T extends ContractsConfig> = {
  [K in keyof T]: T[K] extends ContractsConfig
    ? Proxies<T[K]>
    : T[K] extends ProxiableContractConfig
    ? T[K]["proxy"] extends ContractConfig
      ? NamedContract<FactoryResult<T[K]["proxy"]>, GetProxyAddress<T[K]>>
      : never
    : never;
};

type Implementations<T extends ContractsConfig> = {
  [K in keyof T]: T[K] extends ContractsConfig
    ? Implementations<T[K]>
    : T[K] extends ProxiableContractConfig
    ? T[K]["proxy"] extends ContractConfig
      ? NamedContract<FactoryResult<T[K]["impl"]>, T[K]["impl"]["address"]>
      : never
    : never;
};

export type Contracts<T extends ContractsConfig> = Prettify<
  Instances<T> & {
    proxies: Proxies<OmitEmptyProxies<T>>;
    implementations: Implementations<OmitEmptyProxies<T>>;
  }
>;

function isContractConfig(record: unknown): record is ProxiableContractConfig {
  const impl = record && (record as ProxiableContractConfig).impl;
  return !!impl && !!(impl as ContractConfig).factory;
}

function instances<T extends ContractsConfig>(
  contractsConfig: T,
  runner?: ContractRunner
): Instances<T> {
  const res: Record<string, unknown> = {};
  for (const key of Object.keys(contractsConfig)) {
    const nestedConfig = contractsConfig[key];
    res[key] = isContractConfig(nestedConfig)
      ? NamedContractsBuilder.buildContract(key, nestedConfig, runner)
      : instances(nestedConfig || {}, runner);
  }
  return res as Instances<T>;
}

function proxies<T extends ContractsConfig>(
  contractsConfig: T,
  runner?: ContractRunner
): Proxies<OmitEmptyProxies<T>> {
  const res: Record<string, unknown> = {};
  for (const key of Object.keys(contractsConfig)) {
    const nestedConfig = contractsConfig[key];
    if (!isContractConfig(nestedConfig)) {
      res[key] = proxies(nestedConfig || {}, runner);
    } else if (nestedConfig.proxy) {
      res[key] = NamedContractsBuilder.buildProxy(key, nestedConfig, runner);
    }
  }
  return res as Proxies<OmitEmptyProxies<T>>;
}

function implementations<T extends ContractsConfig>(
  contractsConfig: T,
  runner?: ContractRunner
): Implementations<OmitEmptyProxies<T>> {
  const res: Record<string, unknown> = {};
  for (const key of Object.keys(contractsConfig)) {
    const nestedConfig = contractsConfig[key];
    if (!isContractConfig(nestedConfig)) {
      res[key] = proxies(nestedConfig || {}, runner);
    } else if (nestedConfig.proxy) {
      res[key] = NamedContractsBuilder.buildImpl(key, nestedConfig, runner);
    }
  }
  return res as Implementations<OmitEmptyProxies<T>>;
}

function create<T extends ContractsConfig>(
  contractsConfig: T,
  runner?: ContractRunner
): Contracts<T> {
  return {
    ...instances(contractsConfig, runner),
    proxies: proxies(contractsConfig, runner),
    implementations: implementations(contractsConfig, runner),
  };
}

function address(contractOrAddress: Address | BaseContract | NamedContract): Address {
  if ("address" in (contractOrAddress as object)) {
    return (contractOrAddress as NamedContract).address;
  }
  if (typeof contractOrAddress === "string") return contractOrAddress;

  if (typeof contractOrAddress === "string") return contractOrAddress;
  const { target } = contractOrAddress as BaseContract;

  if (typeof target !== "string") {
    throw new Error("target is not an string instance");
  }

  if (!bytes.isValid(target) && bytes.length(target) === 20) {
    throw new Error(`target ${target} is invalid bytes string`);
  }

  return bytes.normalize(target);
}

function label(contract: BaseContract | NamedContract, extended: boolean = false): string {
  const name = (contract as any).name ?? `Contract`;
  const fullAddress = address(contract);
  return `${name}(${
    extended ? fullAddress : fullAddress.slice(0, 10) + "..." + fullAddress.slice(-8)
  })`;
}

function setEtherscanToken(token: string) {
  NamedContractsResolver.setEtherscanToken(token);
}

function setJsonCachePath(path: string) {
  NamedContractsResolver.setJsonCachePath(path);
}

function setCustomEtherscanChains(customChains: EtherscanChainConfig[]) {
  NamedContractsResolver.setCustomEtherscanChains(customChains);
}

function resolver(): NamedContractsResolver {
  return NamedContractsResolver.singleton();
}

async function resolve(chainId: ChainId, address: Address): Promise<NamedContract | null> {
  return NamedContractsResolver.singleton().resolve(chainId, address);
}

export default {
  address,
  create,
  label,
  resolve,
  resolver,
  proxies,
  instances,
  implementations,
  setup: {
    jsonCachePath: setJsonCachePath,
    etherscanToken: setEtherscanToken,
    customEtherscanChains: setCustomEtherscanChains,
  },
};
