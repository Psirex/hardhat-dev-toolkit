import chalk from "chalk";
import { Address } from "./types";

function address(address: Address) {
  return chalk.green.underline.italic(address);
}

export default {
  address,
};
