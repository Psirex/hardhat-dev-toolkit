import { BaseContract, ContractTransactionReceipt, EventFragment, EventLog, Log } from "ethers";
import { TypedContractEvent } from "./types";
import { OverloadedInputResultMap } from "./overloaded-types-helper";
export interface Event {
    args?: unknown[];
    address: Address;
    fragment: EventFragment;
}
export interface EventsGroup {
    name: string;
    events: Event[];
}
type TypedContract = BaseContract & {
    getEvent(key: string): TypedContractEvent;
};
interface MakeEventCheckParams<T extends TypedContract, K extends keyof OverloadedInputResultMap<T["getEvent"]>> {
    args?: Parameters<OverloadedInputResultMap<T["getEvent"]>[K]["getFragment"]>;
    emitter?: Address | BaseContract;
}
export declare function event<T extends TypedContract, K extends keyof OverloadedInputResultMap<T["getEvent"]>>(contract: T, event: K, { args, emitter: address }?: MakeEventCheckParams<T, K>): Event;
export declare function group(events: (string | Event)[], defaultName?: string): EventsGroup[];
export declare function subsequence(logs: (Log | EventLog)[], subsequence: Event[], fromIndex: number): number[];
export declare function emits(receipt: ContractTransactionReceipt, events: (string | Event)[], fromIndex?: number): number;
export {};
