"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adopt = exports.pass = exports.creator = void 0;
const providers_1 = __importDefault(require("../providers"));
const constants_1 = require("./constants");
const lifecycle_1 = require("./lifecycle");
const contracts_1 = __importDefault(require("../contracts"));
async function creator(provider) {
    const { unlock, lock } = providers_1.default.cheats(provider);
    const { ldo } = contracts_1.default.create((0, constants_1.config)(await providers_1.default.chainId(provider)), provider);
    const [creator, creatorLdoBalance] = await Promise.all([
        unlock(constants_1.CREATOR, constants_1.CREATOR_ETH_BALANCE),
        ldo.balanceOf(constants_1.CREATOR),
    ]);
    if (creatorLdoBalance === 0n) {
        const whaleAddress = (0, constants_1.getWhale)(await providers_1.default.chainId(provider));
        const whaleBalanceBefore = await provider.getBalance(whaleAddress);
        const whale = await unlock(whaleAddress, 10n * 10n ** 18n);
        await ldo.connect(whale).transfer(constants_1.CREATOR, constants_1.CREATOR_LDO_BALANCE);
        await lock(whaleAddress, whaleBalanceBefore);
    }
    return creator;
}
exports.creator = creator;
async function pass(provider, voteId, overrides = { gasLimit: constants_1.DEFAULT_GAS_LIMIT }) {
    const chainId = await providers_1.default.chainId(provider);
    const { unlock, lock, increaseTime } = providers_1.default.cheats(provider);
    const whaleAddress = (0, constants_1.getWhale)(chainId);
    const whaleBalanceBefore = await provider.getBalance(whaleAddress);
    const whale = await unlock(whaleAddress, 10n * 10n ** 18n);
    const { ldo, voting } = contracts_1.default.create((0, constants_1.config)(await providers_1.default.chainId(provider)), whale);
    await ldo.transfer(constants_1.CREATOR, constants_1.CREATOR_LDO_BALANCE);
    await voting.vote(voteId, true, false);
    await increaseTime(constants_1.VOTE_DURATION);
    const tx = await voting.executeVote(voteId, overrides);
    await lock(whaleAddress, whaleBalanceBefore);
    const receipt = await tx.wait();
    if (!receipt) {
        throw new Error("transaction wait failed");
    }
    return receipt;
}
exports.pass = pass;
async function adopt(provider, voteScript, description, overrides = { gasLimit: constants_1.DEFAULT_GAS_LIMIT }) {
    const { voteId, receipt: createReceipt } = await (0, lifecycle_1.wait)(await (0, lifecycle_1.start)(await creator(provider), voteScript, description));
    const enactReceipt = await pass(provider, voteId, overrides);
    return { voteId, createReceipt, enactReceipt };
}
exports.adopt = adopt;
