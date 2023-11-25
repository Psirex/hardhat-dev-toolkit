"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_assert_1 = __importDefault(require("node:assert"));
const node_test_1 = require("node:test");
const nodes_1 = __importDefault(require("./nodes"));
const cheats_1 = require("../providers/cheats");
(0, node_test_1.describe)("RPC node spawning", () => {
    (0, node_test_1.it)("default anvil node spawns properly", async () => {
        const { provider, url, host, port, stop } = await nodes_1.default.spawn("anvil");
        const { name } = await (0, cheats_1.cheats)(provider).node();
        node_assert_1.default.equal(name, "anvil");
        node_assert_1.default.equal(host, nodes_1.default.DEFAULT_HOST);
        node_assert_1.default.equal(port, nodes_1.default.DEFAULT_PORT);
        node_assert_1.default.equal(url, `http://${nodes_1.default.DEFAULT_HOST}:${nodes_1.default.DEFAULT_PORT}`);
        await stop();
    });
    (0, node_test_1.it)("default hardhat node spawns properly", async () => {
        const { provider, url, host, port, stop } = await nodes_1.default.spawn("hardhat");
        const { name } = await (0, cheats_1.cheats)(provider).node();
        node_assert_1.default.equal(name, "hardhat");
        node_assert_1.default.equal(host, nodes_1.default.DEFAULT_HOST);
        node_assert_1.default.equal(port, nodes_1.default.DEFAULT_PORT);
        node_assert_1.default.equal(url, `http://${nodes_1.default.DEFAULT_HOST}:${nodes_1.default.DEFAULT_PORT}`);
        await stop();
    });
    (0, node_test_1.it)("default ganache node spawns properly", async () => {
        const { provider, url, host, port, stop } = await nodes_1.default.spawn("ganache");
        const { name } = await (0, cheats_1.cheats)(provider).node();
        node_assert_1.default.equal(name, "ganache");
        node_assert_1.default.equal(host, nodes_1.default.DEFAULT_HOST);
        node_assert_1.default.equal(port, nodes_1.default.DEFAULT_PORT);
        node_assert_1.default.equal(url, `http://${nodes_1.default.DEFAULT_HOST}:${nodes_1.default.DEFAULT_PORT}`);
        await stop();
    });
    (0, node_test_1.it)("spawn anvil node with custom options", async () => {
        const { port, stop } = await nodes_1.default.spawn("anvil", {
            autoImpersonate: true,
            port: 8546,
            chainId: 1,
            forkBlockNumber: undefined,
        });
        node_assert_1.default.equal(port, 8546);
        await stop();
    });
    (0, node_test_1.it)("spawn ganache node with custom options", async () => {
        const { port, stop } = await nodes_1.default.spawn("ganache", {
            chain: { chainId: 1, hardfork: undefined },
            server: { port: 8546 },
        });
        node_assert_1.default.equal(port, 8546);
        await stop();
    });
});
