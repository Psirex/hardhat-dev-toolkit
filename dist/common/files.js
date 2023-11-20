"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
/**
 * Resolves dir relative to the project root
 * @param path - path to create if it is not exist
 */
async function touchDir(dirPath) {
    const absoluteDirPath = path_1.default.resolve(dirPath);
    try {
        await promises_1.default.access(absoluteDirPath);
    }
    catch {
        await promises_1.default.mkdir(absoluteDirPath, { recursive: true });
    }
}
exports.default = { touchDir };
