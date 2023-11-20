import assert from "node:assert";
import { it, describe } from "node:test";

import node from "./nodes";
import { cheats } from "../providers/cheats";

describe("RPC node spawning", () => {
  it("default anvil node spawns properly", async () => {
    const { provider, url, host, port, stop } = await node.spawn("anvil");
    const { name } = await cheats(provider).node();
    assert.equal(name, "anvil");
    assert.equal(host, node.DEFAULT_HOST);
    assert.equal(port, node.DEFAULT_PORT);
    assert.equal(url, `http://${node.DEFAULT_HOST}:${node.DEFAULT_PORT}`);
    await stop();
  });

  it("default hardhat node spawns properly", async () => {
    const { provider, url, host, port, stop } = await node.spawn("hardhat");
    const { name } = await cheats(provider).node();
    assert.equal(name, "hardhat");
    assert.equal(host, node.DEFAULT_HOST);
    assert.equal(port, node.DEFAULT_PORT);
    assert.equal(url, `http://${node.DEFAULT_HOST}:${node.DEFAULT_PORT}`);
    await stop();
  });

  it("default ganache node spawns properly", async () => {
    const { provider, url, host, port, stop } = await node.spawn("ganache");
    const { name } = await cheats(provider).node();
    assert.equal(name, "ganache");
    assert.equal(host, node.DEFAULT_HOST);
    assert.equal(port, node.DEFAULT_PORT);
    assert.equal(url, `http://${node.DEFAULT_HOST}:${node.DEFAULT_PORT}`);
    await stop();
  });
});
