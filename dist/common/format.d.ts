import type { Address, Stringable } from "./types";
declare function address(address: Address): string;
declare function opcode(opcode: string): string;
declare function argument(name: string, value: Stringable): string;
declare function label(label: string): string;
declare const _default: {
    label: typeof label;
    opcode: typeof opcode;
    address: typeof address;
    argument: typeof argument;
};
export default _default;
