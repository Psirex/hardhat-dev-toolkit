import chalk from "chalk";
import type { Address, Stringable } from "./types";

function address(address: Address) {
  return chalk.cyan.underline.italic(address);
}

function opcode(opcode: string) {
  opcode = opcode.toUpperCase();
  if (opcode === "DELEGATECALL") {
    opcode = "D·CALL";
  }
  return chalk.bold.green(opcode.toUpperCase());
}

function argument(name: string, value: Stringable) {
  const valueString = value.toString();
  const formattedValueString =
    valueString.length > 2 + 32 * 2
      ? valueString.slice(0, 32) + ".." + valueString.slice(-32)
      : valueString;
  return chalk.yellow(name) + "=" + formattedValueString.toString();
}

function label(label: string) {
  return chalk.magenta.bold(label);
}

function method(name: string, args = "") {
  return chalk.blue.italic(name) + chalk.blue.italic("(") + args + chalk.blue.italic(")");
}

function contract(name: string, addr: Address) {
  return `${chalk.magenta.bold(name)}:${address(addr)}`;
}

export default {
  label,
  opcode,
  address,
  method,
  argument,
  contract,
};
