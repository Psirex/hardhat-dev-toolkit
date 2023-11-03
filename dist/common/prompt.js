"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompts_1 = __importDefault(require("prompts"));
class OperationAbortedError extends Error {
    constructor() {
        super("Operation was aborted by the user");
    }
}
class PasswordConfirmationMismatchError extends Error {
    constructor() {
        super("Password confirmation does not mismatch the password. Aborting...");
    }
}
const DEFAULT_PROMPTS_OPTIONS = {
    onCancel() {
        throw new OperationAbortedError();
    },
};
async function confirm(message) {
    const { isConfirmed } = await (0, prompts_1.default)({
        type: "confirm",
        name: "isConfirmed",
        message: message ?? "Confirm?",
    }, DEFAULT_PROMPTS_OPTIONS);
    return isConfirmed;
}
async function select(message, choices) {
    const { value } = await (0, prompts_1.default)({
        name: "value",
        type: "select",
        message,
        choices,
    }, DEFAULT_PROMPTS_OPTIONS);
    return value;
}
async function secret(message, options) {
    const { value } = await (0, prompts_1.default)({
        name: "value",
        message,
        type: options?.invisible === true ? "invisible" : "password",
    }, DEFAULT_PROMPTS_OPTIONS);
    return value;
}
async function password(message, options) {
    const password = await secret(message ?? "Enter the password:", {
        invisible: true,
    });
    if (options.confirmation ?? true) {
        const confirmation = await secret("Confirm the password:", {
            invisible: true,
        });
        if (password !== confirmation) {
            throw new PasswordConfirmationMismatchError();
        }
    }
    return password;
}
exports.default = {
    secret,
    select,
    confirm,
    password,
};
