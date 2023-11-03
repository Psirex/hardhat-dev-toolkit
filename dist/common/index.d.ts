export * from "./types";
export { default as prompt } from "./prompt";
export { default as format } from "./format";
declare const _default: {
    format: {
        secret: (message: string, options?: import("./prompt").SecretOptions | undefined) => Promise<string>;
        select: (message: string, choices: import("./prompt").SelectChoice[]) => Promise<any>;
        confirm: (message?: string | undefined) => Promise<any>;
        password: (message: string, options: import("./prompt").PasswordOptions) => Promise<string>;
    };
    prompt: {
        secret: (message: string, options?: import("./prompt").SecretOptions | undefined) => Promise<string>;
        select: (message: string, choices: import("./prompt").SelectChoice[]) => Promise<any>;
        confirm: (message?: string | undefined) => Promise<any>;
        password: (message: string, options: import("./prompt").PasswordOptions) => Promise<string>;
    };
};
export default _default;
