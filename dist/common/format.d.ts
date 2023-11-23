import type { Address, Stringable } from "./types";
declare function address(address: Address): string;
declare function opcode(opcode: string): string;
declare function argument(name: string, value: Stringable): string;
declare function label(label: string): string;
declare function method(name: string, args?: string): string;
declare function contract(name: string, addr: Address): string;
declare const _default: {
    label: typeof label;
    opcode: typeof opcode;
    address: typeof address;
    method: typeof method;
    argument: typeof argument;
    contract: typeof contract;
};
export default _default;
