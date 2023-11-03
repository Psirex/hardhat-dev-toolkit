"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const plugins_1 = require("hardhat/plugins");
const config_1 = require("hardhat/config");
// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
require("./tasks");
require("./type-extensions");
const keystores_1 = require("./keystores");
(0, config_1.extendConfig)((config, userConfig) => {
    // We apply our default config here. Any other kind of config resolution
    // or normalization should be placed here.
    //
    // `config` is the resolved config, which will be used during runtime and
    // you should modify.
    // `userConfig` is the config as provided by the user. You should not modify
    // it.
    //
    // If you extended the `HardhatConfig` type, you need to make sure that
    // executing this function ensures that the `config` object is in a valid
    // state for its type, including its extensions. For example, you may
    // need to apply a default value, like in this example.
    const keystorePath = userConfig.keystore.path;
    if (keystorePath === undefined) {
        config.keystore.path = path_1.default.join(config.paths.root, "keystores");
    }
    else {
        if (path_1.default.isAbsolute(keystorePath)) {
            config.keystore.path = keystorePath;
        }
        else {
            // We resolve relative paths starting from the project's root.
            // Please keep this convention to avoid confusion.
            config.keystore.path = path_1.default.normalize(path_1.default.join(config.paths.root, keystorePath));
        }
    }
});
(0, config_1.extendEnvironment)((hre) => {
    // We add a field to the Hardhat Runtime Environment here.
    // We use lazyObject to avoid initializing things until they are actually
    // needed.
    hre.keystore = (0, plugins_1.lazyObject)(() => new keystores_1.NamedKeystoreService(keystores_1.NamedKeystoreStorage.create(hre.config.keystore.path)));
});
