"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = exports.prompt = void 0;
__exportStar(require("./types"), exports);
const prompt_1 = __importDefault(require("./prompt"));
const prompt_2 = __importDefault(require("./prompt"));
var prompt_3 = require("./prompt");
Object.defineProperty(exports, "prompt", { enumerable: true, get: function () { return __importDefault(prompt_3).default; } });
var format_1 = require("./format");
Object.defineProperty(exports, "format", { enumerable: true, get: function () { return __importDefault(format_1).default; } });
exports.default = { format: prompt_2.default, prompt: prompt_1.default };
