"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PANIC_SELECTOR = exports.ERROR_SELECTOR = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
/**
 * The selector for the error event.
 */
const ERROR_SELECTOR = sdk_core_1.Keccak256.of(sdk_core_1.Txt.of('Error(string)').bytes)
    .toString()
    .slice(0, 10);
exports.ERROR_SELECTOR = ERROR_SELECTOR;
/**
 * The selector for the panic event.
 */
const PANIC_SELECTOR = sdk_core_1.Keccak256.of(sdk_core_1.Txt.of('Panic(uint256)').bytes)
    .toString()
    .slice(0, 10);
exports.PANIC_SELECTOR = PANIC_SELECTOR;
