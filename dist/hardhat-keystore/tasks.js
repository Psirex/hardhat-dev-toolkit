"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("hardhat/config");
const common_1 = require("../common");
const TASKS = {
    ADD: "keystore:add",
    LIST: "keystore:list",
    DELETE: "keystore:delete",
    GENERATE: "keystore:generate",
    PASSWORD: "keystore:password",
};
(0, config_1.task)(TASKS.LIST, "List available accounts").setAction(async (_, hre) => {
    const keystores = await hre.keystore.all();
    if (keystores.length === 0) {
        console.log("Accounts not found.");
        console.log(`You can add or generate account using one of the commands:`);
        console.log("  ", chalk_1.default.bold(`npx hardhat ${TASKS.ADD}`));
        console.log("  ", chalk_1.default.bold(`npx hardhat ${TASKS.GENERATE}`));
        return;
    }
    console.log(`Found ${keystores.length} accounts:`);
    for (const account of keystores) {
        console.log("  ", account.format());
    }
});
(0, config_1.task)(TASKS.ADD, "Add a new account by entering a private key")
    .addPositionalParam("name", "Name of the new account")
    .setAction(async ({ name }, hre) => {
    if (await hre.keystore.has(name)) {
        console.log(`Account "${name}" already exists`);
        return;
    }
    const newAccount = await hre.keystore.add(name);
    console.log(`A new account ${newAccount.format()} has been added`);
});
(0, config_1.task)(TASKS.GENERATE, "Add a new account with a random private key")
    .addPositionalParam("name", "Name of the new account")
    .setAction(async ({ name }, hre) => {
    if (await hre.keystore.has(name)) {
        console.log(`Account "${name}" already exists`);
        return;
    }
    const account = await hre.keystore.generate(name);
    console.log(`A new account ${account.format()} has been generated`);
});
(0, config_1.task)(TASKS.DELETE, "Delete an existing account")
    .addPositionalParam("name", "Name of the account to delete")
    .setAction(async ({ name }, hre) => {
    if (!(await hre.keystore.has(name))) {
        console.log(`Account with name ${name} not found`);
        return;
    }
    const keystore = await hre.keystore.get(name);
    const confirmed = await common_1.prompt.confirm(`Are you sure you want to delete ${keystore.format()} account?`);
    if (!confirmed) {
        console.log("Operation was canceled by the user");
        return;
    }
    const isRemoved = await hre.keystore.remove(name);
    if (isRemoved) {
        console.log(`Account ${keystore.format()} was successfully removed`);
    }
    else {
        console.log(`Removal of the account ${keystore.format()} failed`);
    }
});
(0, config_1.task)(TASKS.PASSWORD, "Change the password of an existing account")
    .addPositionalParam("name", "Name of the account to change password for")
    .setAction(async ({ name }, hre) => {
    const account = await hre.keystore.password(name);
    console.log(`Password for account ${account.format()} successfully changed`);
});
