import { HexStrPrefixed } from "../common/bytes";
/**
 * Data of the EVM script call
 * @param contract - address of the contract to call
 * @param calldata - ABI encoded calldata passed with call
 */
export interface EvmCall {
    address: Address;
    calldata: HexStrPrefixed;
}
type EncodedEvmScript = HexStrPrefixed;
interface DecodedEvmScript {
    specId: string;
    calls: EvmCall[];
}
export declare class EvmScriptParser {
    static readonly SPEC_ID_LENGTH = 4;
    static readonly CALLDATA_LENGTH = 4;
    static readonly CALLDATA_LENGTH_LENGTH = 4;
    static readonly DEFAULT_SPEC_ID = "0x00000001";
    static isEvmScript(script: unknown, specId?: string): script is EncodedEvmScript;
    static encode(calls: EvmCall[], specId?: string): HexStrPrefixed;
    static decode(evmScript: EncodedEvmScript): Required<DecodedEvmScript>;
    private static encodeEvmScriptCall;
}
export {};
