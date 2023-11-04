import chalk from "chalk";
import type { Address } from "./types";

interface Stringable {
  toString(...args: any[]): string;
}

function address(address: Address) {
  return chalk.green.underline.italic(address);
}

function opcode(opcode: string) {
  return chalk.whiteBright.bold(opcode.toUpperCase());
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

export default {
  label,
  opcode,
  address,
  argument,
};
