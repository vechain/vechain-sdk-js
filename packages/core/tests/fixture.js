"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomValidAddress = void 0;
const src_1 = require("../src");
/**
 * Generates a random valid address
 *
 * @returns A random valid address of 20 bytes
 */
const generateRandomValidAddress = () => {
    return src_1.Hex.of(src_1.Secp256k1.randomBytes(20)).toString();
};
exports.generateRandomValidAddress = generateRandomValidAddress;
