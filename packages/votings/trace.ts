import { ContractTransactionReceipt, FunctionFragment } from "ethers";
import { TxCallTraceItem } from "../traces/tx-call-trace";
import { config, getAddresses } from "./constants";
import providers from "../providers";
import traces from "../traces";
import bytes from "../common/bytes";
import contracts from "../contracts";

interface MethodCallConfig {
  type?: "CALL" | "DELEGATECALL" | "STATICCALL" | "CALLCODE";
  address: Address;
  fragment?: FunctionFragment;
}

interface TraceOptions {
  extended: boolean;
}

export async function trace(
  enactReceipt: ContractTransactionReceipt,
  options: TraceOptions = { extended: false }
) {
  const provider = providers.provider(enactReceipt);
  const chainId = await providers.chainId(provider);
  const {
    acl,
    kernel,
    callsScript,
    evmScriptRegistry,
    implementations: { kernel: kernelImpl, acl: aclImpl, evmScriptRegistry: evmScriptRegistryImpl },
  } = contracts.create(config(chainId), provider);
  const addresses = getAddresses(chainId);

  const trace = await traces.trace(enactReceipt);

  if (options.extended) return trace;

  return trace
    .filter(
      omitMethodCalls([
        {
          type: "CALL",
          address: kernel.address,
          fragment: kernel.getFunction("getApp").fragment,
        },
        {
          type: "DELEGATECALL",
          address: kernelImpl.address,
          fragment: kernelImpl.getFunction("getApp").fragment,
        },
        {
          type: "CALL",
          address: kernel.address,
          fragment: kernel.getFunction("hasPermission").fragment,
        },
        {
          type: "DELEGATECALL",
          address: kernelImpl.address,
          fragment: kernelImpl.getFunction("hasPermission").fragment,
        },
        {
          type: "CALL",
          address: evmScriptRegistry.address,
          fragment: evmScriptRegistry.getFunction("getScriptExecutor").fragment,
        },
        {
          type: "DELEGATECALL",
          address: evmScriptRegistryImpl.address,
          fragment: evmScriptRegistryImpl.getFunction("getScriptExecutor").fragment,
        },
        {
          type: "CALL",
          address: acl.address,
          fragment: acl.getFunction("hasPermission(address,address,bytes32)").fragment,
        },
        {
          type: "DELEGATECALL",
          address: aclImpl.address,
          fragment: aclImpl.getFunction("hasPermission(address,address,bytes32)").fragment,
        },
        {
          type: "CALL",
          address: acl.address,
          fragment: acl.getFunction("hasPermission(address,address,bytes32,bytes)").fragment,
        },
        {
          type: "DELEGATECALL",
          address: aclImpl.address,
          fragment: aclImpl.getFunction("hasPermission(address,address,bytes32,bytes)").fragment,
        },
        {
          type: "CALL",
          address: acl.address,
          fragment: acl.getFunction("hasPermission(address,address,bytes32,uint256[])").fragment,
        },
        {
          type: "DELEGATECALL",
          address: aclImpl.address,
          fragment: aclImpl.getFunction("hasPermission(address,address,bytes32,uint256[])")
            .fragment,
        },
        {
          type: "DELEGATECALL",
          address: callsScript.address,
          fragment: callsScript.getFunction("execScript").fragment,
        },
        {
          type: "CALL",
          address: addresses.lidoLocator,
        },
        {
          type: "DELEGATECALL",
          address: addresses.lidoLocator,
        },
      ])
    )
    .filter(omitProxyDelegateCalls())
    .filter(omitStaticCalls());
}

function omitStaticCalls() {
  return (opCode: TxCallTraceItem) => {
    return opCode.type !== "STATICCALL";
  };
}

function omitProxyDelegateCalls() {
  return (opCode: TxCallTraceItem, i: number, opCodes: TxCallTraceItem[]) => {
    if (opCode.type !== "DELEGATECALL") return true;
    const prevOpcode = opCodes[i - 1]!;
    if (prevOpcode.type !== "CALL" && prevOpcode.type !== "STATICCALL") return true;
    return opCode.input !== prevOpcode.input;
  };
}

function omitMethodCalls(calls: MethodCallConfig[]) {
  return (opCode: TxCallTraceItem) =>
    !calls.some(
      (call) =>
        call.type === opCode.type &&
        bytes.isEqual(call.address, opCode.to) &&
        (call.fragment
          ? bytes.isEqual(call.fragment.selector, bytes.slice(opCode.input, 0, 4))
          : true)
    );
}
