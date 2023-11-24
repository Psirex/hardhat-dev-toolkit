import test from "node:test";
import { TxCallTrace } from "./tx-call-trace";
import { Network } from "ethers";
import { VotingFactory } from "../votings/constants";
import contracts from "../contracts";
import { Contract__factory } from "../contracts/named-contract";
import { bytes } from "../common";

const from = "0x6389cbcf38172a1e8ecf1c34c00cd7f603afb80c";

const NodeOperatorsRegistryFactory = new Contract__factory([
  {
    constant: false,
    inputs: [
      { name: "_name", type: "string" },
      { name: "_rewardAddress", type: "address" },
    ],
    name: "addNodeOperator",
    outputs: [{ name: "id", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
]);

const config = {
  voting: {
    impl: {
      address: "0x2e59a20f205bb85a89c53f1936454680651e618e",
      factory: VotingFactory,
    },
    proxy: null,
  },
  nodeOperatorsRegistry: {
    impl: {
      address: "0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5",
      factory: NodeOperatorsRegistryFactory,
    },
    proxy: null,
  },
} as const;

test("call trace formatting", () => {
  const { voting, nodeOperatorsRegistry } = contracts.instances(config);
  const trace = new TxCallTrace(
    new Network("mainnet", 1),
    from,
    [
      {
        type: "CALL",
        depth: 0,
        gas: 4978796,
        gasUsed: 1259532,
        value: 0n,
        to: "0x2e59a20f205bb85a89c53f1936454680651e618e",
        input: "0xf98a4eca00000000000000000000000000000000000000000000000000000000000000a5",
        output: "0x",
        error: undefined,
      },
      {
        type: "DELEGATECALL",
        depth: 1,
        gas: 4978796,
        gasUsed: 1259532,
        value: 0n,
        to: "0x2e59a20f205bb85a89c53f1936454680651e618e",
        input: "0xf98a4eca00000000000000000000000000000000000000000000000000000000000000a5",
        output: "0x",
        error: undefined,
      },
      {
        type: "CALL",
        depth: 2,
        gas: 3961155,
        gasUsed: 98002,
        value: 0n,
        to: "0x3e40d73eb977dc6a537af587d48316fee66e9c8c",
        input:
          "0xd948d468000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a00000000155032650b14df07b85bf18a3a3ec8e0af2e028d50000008485fa63d700000000000000000000000000000000000000000000000000000000000000400000000000000000000000005ee590effdf9456d5666002fba05fba8c3752cb7000000000000000000000000000000000000000000000000000000000000001750617261466920546563686e6f6c6f67696573204c4c43000000000000000000",
        output: "0x",
        error: undefined,
      },
      {
        type: "CALL",
        depth: 2,
        gas: 4262938,
        gasUsed: 95469,
        value: 0n,
        to: "0x55032650b14df07b85bf18a3a3ec8e0af2e028d5",
        input:
          "0x85fa63d700000000000000000000000000000000000000000000000000000000000000400000000000000000000000002a64944ebfaff8b6a0d07b222d3d83ac29c241a700000000000000000000000000000000000000000000000000000000000000034134310000000000000000000000000000000000000000000000000000000000",
        output: "0x0000000000000000000000000000000000000000000000000000000000000020",
        error: undefined,
      },
    ],
    {
      [bytes.normalize("0x2e59a20f205bb85a89c53f1936454680651e618e")]: voting,
      [bytes.normalize("0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5")]: nodeOperatorsRegistry,
    }
  );
  console.log(trace.format());
});
