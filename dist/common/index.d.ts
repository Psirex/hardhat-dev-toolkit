export * from "./types";
export { default as bytes } from "./bytes";
export { default as format } from "./format";
export { default as prompt } from "./prompt";
declare const _default: {
    bytes: {
        join: (...bytes: string[]) => `0x${string}`;
        slice: (bytes: string, startIndex?: number | undefined, endIndex?: number | undefined) => `0x${string}`;
        encode: <T extends number | bigint>(value: T) => `0x${string}`;
        strip0x: (bytes: string) => string;
        prefix0x: <T_1 extends string>(bytes: T_1) => `0x${string}`;
        toInt: (bytes: string) => number;
        toBigInt: (bytes: string) => bigint;
        length: (bytes: string) => number;
        padStart: (bytes: string, bytesLength: number, fill?: string) => string;
        isEqual: (bytes1: string, bytes2: string) => boolean;
        isValid: (bytes: unknown) => bytes is string;
        normalize: <T_2 extends string>(bytes: T_2) => `0x${string}`;
    };
    format: {
        label: (label: string) => string;
        opcode: (opcode: string) => string;
        address: (address: `0x${string}`) => string;
        method: (name: string, args?: string) => string;
        argument: (name: string, value: import("./types").Stringable) => string;
        contract: (name: string, addr: `0x${string}`) => string;
    };
    prompt: {
        secret: (message: string, options?: import("./prompt").SecretOptions | undefined) => Promise<string>;
        select: (message: string, choices: import("./prompt").SelectChoice[]) => Promise<any>;
        confirm: (message?: string | undefined) => Promise<any>;
        password: (message: string, options: import("./prompt").PasswordOptions) => Promise<string>;
    };
};
export default _default;
