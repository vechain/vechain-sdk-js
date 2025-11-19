"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOLIDITY_PANIC_SELECTOR = exports.SOLIDITY_ERROR_SELECTOR = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
/**
 * The selector of the `Error(string)` function in Solidity.
 */
const SOLIDITY_ERROR_SELECTOR = sdk_core_1.Keccak256.of(sdk_core_1.Txt.of('Error(string)').bytes)
    .toString()
    .slice(0, 10);
exports.SOLIDITY_ERROR_SELECTOR = SOLIDITY_ERROR_SELECTOR;
/**
 * The selector of the `Panic(uint256)` function in Solidity.
 */
const SOLIDITY_PANIC_SELECTOR = sdk_core_1.Keccak256.of(sdk_core_1.Txt.of('Panic(uint256)').bytes)
    .toString()
    .slice(0, 10);
exports.SOLIDITY_PANIC_SELECTOR = SOLIDITY_PANIC_SELECTOR;
