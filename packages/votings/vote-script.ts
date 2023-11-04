import { BaseContract, BytesLike, FunctionFragment, isHexString } from "ethers";

import contracts from "../contracts";
import bytes, { HexStrPrefixed } from "../common/bytes";
import { TypedContractMethod } from "./types";

type _TypedContractMethod = Omit<TypedContractMethod, "staticCallResult">;
type _TypedContractArgs<T extends _TypedContractMethod> = Parameters<T["staticCall"]>;

type EncodedEvmScript = HexStrPrefixed;

type ForwardContractMethod = TypedContractMethod<[_evmScript: BytesLike], [void], "nonpayable">;
interface AragonForwarder extends BaseContract {
  forward: ForwardContractMethod;
}

/**
 * Data of the EVM script call
 * @param contract - address of the contract to call
 * @param calldata - ABI encoded calldata passed with call
 */
export interface EvmCall {
  address: Address;
  calldata: HexStrPrefixed;
}

export interface FormattedEvmCall extends EvmCall {
  format(padding?: number): string;
}

interface DecodedEvmScript {
  specId: string;
  calls: EvmCall[];
}

const ADDRESS_LENGTH = 20;

class AragonEvmForward implements FormattedEvmCall {
  constructor(
    private readonly forwarder: AragonForwarder,
    private readonly calls: ContractEvmCall[]
  ) {}

  get address(): Address {
    return contracts.address(this.forwarder);
  }

  get calldata(): HexStrPrefixed {
    return bytes.normalize(
      this.forwarder.interface.encodeFunctionData("forward", [evm(...this.calls)])
    );
  }

  format(padding: number = 0): string {
    const label = contracts.label(this.forwarder);

    const methodName = this.forwarder.forward.name;
    const argNames = this.forwarder.forward.fragment.inputs
      .map((input) => input.type + " " + input.name)
      .join(", ");
    const signature = `${label}.${methodName}(${argNames})`;

    const subcalls = this.calls.map((call) => call.format(padding + 4));
    return [
      padLeft(signature, padding),
      padLeft("Parsed EVM Script calls:", padding + 2),
      ...subcalls,
    ].join("\n");
  }
}

class ContractEvmCall implements FormattedEvmCall {
  constructor(
    private readonly contract: BaseContract,
    private readonly method: FunctionFragment,
    private readonly args: any[]
  ) {}

  get address(): Address {
    return contracts.address(this.contract);
  }

  get calldata(): HexStrPrefixed {
    return bytes.normalize(
      this.contract.interface.encodeFunctionData(
        this.method,
        this.args.map((arg) => (arg && arg.target ? arg.target : arg))
      )
    );
  }

  format(padding: number = 0): string {
    const label = contracts.label(this.contract);
    const methodName = this.method.name;
    const argNames = this.method.inputs.map((input) => input.type).join(", ");
    const signature = padLeft(`${label}.${methodName}(${argNames})`, padding);
    const args = this.method.inputs.map((input, index) =>
      padLeft(`  ${input.name}: ${this.formatArgument(this.args[index])}`, padding)
    );
    return [signature, ...args].join("\n");
  }

  private formatArgument(arg: unknown) {
    if (arg instanceof BaseContract) {
      return contracts.label(arg);
    }
    return arg;
  }
}

function padLeft(str: string, padding: number) {
  return " ".repeat(padding) + str;
}

export class EvmScriptParser {
  public static readonly SPEC_ID_LENGTH = 4;
  public static readonly CALLDATA_LENGTH = 4;
  public static readonly CALLDATA_LENGTH_LENGTH = 4;
  public static readonly DEFAULT_SPEC_ID = "0x00000001";

  public static isEvmScript(
    script: unknown,
    specId: string = this.DEFAULT_SPEC_ID
  ): script is HexStrPrefixed {
    return bytes.isValid(script) && script.startsWith(specId);
  }

  public static encode(calls: EvmCall[], specId: string = this.DEFAULT_SPEC_ID): HexStrPrefixed {
    const res = calls.reduce(
      (evmScript, call) => bytes.join(evmScript, this.encodeEvmScriptCall(call)),
      specId
    );
    return bytes.normalize(res);
  }

  public static decode(evmScript: EncodedEvmScript) {
    const evmScriptLength = bytes.length(evmScript);
    if (evmScriptLength < this.SPEC_ID_LENGTH) {
      throw new Error("Invalid evmScript length");
    }
    const res: Required<DecodedEvmScript> = {
      specId: bytes.slice(evmScript, 0, this.SPEC_ID_LENGTH),
      calls: [],
    };
    let startIndex = this.SPEC_ID_LENGTH;
    while (startIndex < evmScriptLength) {
      const contract = bytes.slice(evmScript, startIndex, (startIndex += ADDRESS_LENGTH));
      const calldataLength = bytes.toInt(
        bytes.slice(evmScript, startIndex, (startIndex += this.CALLDATA_LENGTH))
      );
      const calldata = bytes.slice(evmScript, startIndex, (startIndex += calldataLength));
      res.calls.push({ address: contract, calldata });
    }

    if (startIndex !== evmScriptLength) {
      throw new Error("Invalid evmScript length");
    }
    return res;
  }

  private static encodeEvmScriptCall(call: EvmCall) {
    return bytes.join(
      call.address,
      bytes.padStart(bytes.encode(bytes.length(call.calldata)), this.CALLDATA_LENGTH_LENGTH),
      call.calldata
    );
  }
}

/**
 *
 * @param calls - calls to encode as EVM script
 * @returns EVM script for the sequence of the calls
 */
export function evm(...calls: EvmCall[]): HexStrPrefixed {
  return EvmScriptParser.encode(calls);
}

/**
 * Creates an instance of the EVM call
 * @param method - method on the contract to call
 * @param args - args to use with the contract call
 * @returns an instance of the EVM call
 */
export function call<T extends _TypedContractMethod>(
  method: T,
  args: _TypedContractArgs<T>
): ContractEvmCall {
  const contract: unknown = (method as any)._contract;

  if (!contract) {
    throw new Error(`Method does not have property _contract`);
  }

  if (!(contract instanceof BaseContract)) {
    throw new Error(`_contract is not an BaseContract instance`);
  }

  const address = contract.target;

  if (typeof address !== "string" || !isHexString(address)) {
    throw new Error(`contract.target must contain valid address, but received ${address}`);
  }

  return new ContractEvmCall(contract, method.fragment, args);
}

/**
 * Creates a call of the forward(evmScript) method
 * @param forwarder - contracts which support forwarding of the EVM scripts
 * @param calls - calls to pass encode as EVM Script and pass as and argument to forward method
 * @returns instance of the EVMCall with forward method call
 */
export function forward(forwarder: AragonForwarder, calls: ContractEvmCall[]): AragonEvmForward {
  return new AragonEvmForward(forwarder, calls);
}
