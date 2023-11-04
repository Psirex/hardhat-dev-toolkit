"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.NamedContractsResolver = void 0;
var named_contracts_resolver_1 = require("./named-contracts-resolver");
Object.defineProperty(exports, "NamedContractsResolver", { enumerable: true, get: function () { return named_contracts_resolver_1.NamedContractsResolver; } });
var contracts_1 = require("./contracts");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(contracts_1).default; } });
