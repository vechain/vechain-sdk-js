"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHardhatContext = void 0;
const path_1 = __importDefault(require("path"));
/**
 * Set hardhat context function.
 *
 * This function is used to set the hardhat context for the tests.
 * Basically, every test will be an isolated hardhat environment (a hardhat project).
 *
 * @param hardhatProjectName - The name of the hardhat project to set the context
 */
const setHardhatContext = (hardhatProjectName) => {
    // Init node environment directory
    process.chdir(path_1.default.join(__dirname, 'hardhat-mock-projects', hardhatProjectName));
};
exports.setHardhatContext = setHardhatContext;
