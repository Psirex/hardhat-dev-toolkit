"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
function address(address) {
    return chalk_1.default.cyan.underline.italic(address);
}
function opcode(opcode) {
    opcode = opcode.toUpperCase();
    if (opcode === "DELEGATECALL") {
        opcode = "D·CALL";
    }
    return chalk_1.default.bold.green(opcode.toUpperCase());
}
function argument(name, value) {
    const valueString = value.toString();
    const formattedValueString = valueString.length > 2 + 32 * 2
        ? valueString.slice(0, 32) + ".." + valueString.slice(-32)
        : valueString;
    return chalk_1.default.yellow(name) + "=" + formattedValueString.toString();
}
function label(label) {
    return chalk_1.default.magenta.bold(label);
}
function method(name, args = "") {
    return chalk_1.default.blue.italic(name) + chalk_1.default.blue.italic("(") + args + chalk_1.default.blue.italic(")");
}
function contract(name, addr) {
    return (chalk_1.default.magenta.bold(name) + chalk_1.default.magenta.bold("[") + address(addr) + chalk_1.default.magenta.bold("]"));
}
exports.default = {
    label,
    opcode,
    address,
    method,
    argument,
    contract,
};
