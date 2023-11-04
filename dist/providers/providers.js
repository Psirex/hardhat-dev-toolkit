"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheats_1 = require("./cheats");
const utils_1 = require("./utils");
function provider(runner) {
    const { provider } = runner;
    if (!provider) {
        throw new Error("Provider is empty");
    }
    if (!(0, utils_1.isJsonRpcProvider)(provider) && !(0, utils_1.isHardhatEthersProvider)(provider)) {
        throw new utils_1.UnsupportedProviderError(provider);
    }
    return provider;
}
async function chainId(runner) {
    const { chainId } = await provider(runner).getNetwork();
    return chainId;
}
exports.default = { cheats: cheats_1.cheats, provider, chainId };
