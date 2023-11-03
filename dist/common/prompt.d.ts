export interface SelectChoice {
    value: string;
    title: string;
}
export interface SecretOptions {
    invisible?: boolean;
}
export interface PasswordOptions {
    confirmation?: boolean;
}
declare function confirm(message?: string): Promise<any>;
declare function select(message: string, choices: SelectChoice[]): Promise<any>;
declare function secret(message: string, options?: SecretOptions): Promise<string>;
declare function password(message: string, options: PasswordOptions): Promise<string>;
declare const _default: {
    secret: typeof secret;
    select: typeof select;
    confirm: typeof confirm;
    password: typeof password;
};
export default _default;
