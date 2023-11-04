"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
function address(address) {
    return chalk_1.default.green.underline.italic(address);
}
function opcode(opcode) {
    return chalk_1.default.whiteBright.bold(opcode.toUpperCase());
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
exports.default = {
    label,
    opcode,
    address,
    argument,
};
