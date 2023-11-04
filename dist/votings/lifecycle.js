"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.wait = exports.start = void 0;
const constants_1 = require("./constants");
const providers_1 = __importDefault(require("../providers"));
const vote_script_1 = require("./vote-script");
const contracts_1 = __importDefault(require("../contracts"));
async function start(creator, evmScript, meta, castVote = false, overrides) {
    const { voting, tokenManager } = contracts_1.default.create((0, constants_1.config)(await providers_1.default.chainId(creator)));
    const startVoteScript = (0, vote_script_1.evm)((0, vote_script_1.call)(voting.newVote, [evmScript, meta, castVote, false]));
    return tokenManager.connect(creator).forward(startVoteScript, overrides ?? {});
}
exports.start = start;
async function wait(tx) {
    const receipt = await tx.wait();
    if (!receipt) {
        throw new Error("Invalid confirmations value");
    }
    const { voting } = contracts_1.default.create((0, constants_1.config)(await providers_1.default.chainId(tx)));
    const startVoteLog = receipt.logs.find((log) => log.topics[0] === voting.interface.getEvent("StartVote").topicHash);
    if (!startVoteLog) {
        throw new Error("StartVote log not found");
    }
    const startVoteEvent = voting.interface.parseLog({
        data: startVoteLog?.data,
        topics: [...startVoteLog?.topics],
    });
    const voteId = startVoteEvent.args[0];
    return { voteId, receipt };
}
exports.wait = wait;
async function execute(executor, voteId, overrides) {
    const { voting } = contracts_1.default.create((0, constants_1.config)(await providers_1.default.chainId(executor)));
    const tx = await voting.executeVote(voteId, overrides ?? {});
    const receipt = await tx.wait();
    if (!receipt) {
        throw new Error("transaction wait failed");
    }
    return receipt;
}
exports.execute = execute;
