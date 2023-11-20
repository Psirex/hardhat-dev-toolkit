import * as events from "./events";
import * as launch from "./lifecycle";
import * as script from "./vote-script";
import * as testing from "./test-helpers";
import * as inspect from "./trace";
import * as parser from "./evm-script-parser";
export * from "./trace";
export * from "./events";
export * from "./lifecycle";
export * from "./vote-script";
export * from "./test-helpers";
export * from "./evm-script-parser";
declare const _default: {
    events: typeof events;
    launch: typeof launch;
    script: {
        EvmScriptParser: typeof parser.EvmScriptParser;
        evm(...calls: parser.EvmCall[]): `0x${string}`;
        call<T extends {
            name: string;
            fragment: import("ethers").FunctionFragment;
            estimateGas: (...args: any[] | [...any[], import("./types").PayableOverrides]) => Promise<bigint>;
            getFragment: (...args: any[] | [...any[], import("./types").PayableOverrides]) => import("ethers").FunctionFragment;
            populateTransaction: (...args: any[] | [...any[], import("./types").PayableOverrides]) => Promise<import("ethers").ContractTransaction>;
            staticCall: (...args: any[] | [...any[], {
                type?: number | null | undefined;
                value?: import("ethers").BigNumberish | null | undefined;
                chainId?: import("ethers").BigNumberish | null | undefined;
                gasLimit?: import("ethers").BigNumberish | null | undefined;
                gasPrice?: import("ethers").BigNumberish | null | undefined;
                from?: import("ethers").AddressLike | null | undefined;
                nonce?: number | null | undefined;
                maxPriorityFeePerGas?: import("ethers").BigNumberish | null | undefined;
                maxFeePerGas?: import("ethers").BigNumberish | null | undefined;
                accessList?: import("ethers").AccessListish | null | undefined;
                customData?: any;
                blockTag?: import("ethers").BlockTag | undefined;
                enableCcipRead?: boolean | undefined;
            }]) => Promise<any>;
            send: (...args: any[] | [...any[], import("./types").PayableOverrides]) => Promise<import("ethers").ContractTransactionResponse>;
        }>(method: T, args: Parameters<T["staticCall"]>): script.ContractEvmCall;
        forward(forwarder: script.AragonForwarder, calls: script.ContractEvmCall[]): script.AragonEvmForward;
        AragonEvmForward: typeof script.AragonEvmForward;
        ContractEvmCall: typeof script.ContractEvmCall;
    };
    testing: typeof testing;
    inspect: typeof inspect;
};
export default _default;
