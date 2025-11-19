"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getABI = getABI;
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
const node_fs_1 = __importDefault(require("node:fs"));
function getABI(contractName) {
    try {
        // Read the file
        const contractFile = JSON.parse(node_fs_1.default.readFileSync(`./artifacts/contracts/${contractName}.sol/${contractName}.json`, 'utf8'));
        // Get the ABI from the file
        return contractFile.abi;
    }
    catch (error) {
        console.error(`Error: Unable to find ABI for ${contractName}`);
        console.error(error);
    }
}
