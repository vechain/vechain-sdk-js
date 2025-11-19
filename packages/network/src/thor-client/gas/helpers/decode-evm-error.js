"use strict";
// https://docs.soliditylang.org/en/v0.8.16/control-structures.html#error-handling-assert-require-revert-and-exceptions
// builtin errors in solidity, Error(string) and Panic(uint256)
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeRevertReason = decodeRevertReason;
const sdk_core_1 = require("@vechain/sdk-core");
const const_1 = require("./const");
/**
 * Decodes revert reasons from a given hex-encoded data string, identifying whether the revert is due to an "Error(string)" or a "Panic(uint256)".
 *
 * @param data - Hex-encoded data containing revert information.
 * @returns Decoded revert reason or an error message if decoding fails.
 *
 * @example
 * ```typescript
 * const revertReason = decodeRevertReason('0x0123456789abcdef0123456789abcdef');
 * console.log(revertReason); // 'Decoded Revert Reason'
 * ```
 */
function decodeRevertReason(data) {
    // Check if the revert reason starts with the error selector
    if (data.startsWith(const_1.SOLIDITY_ERROR_SELECTOR))
        // Decode the error message from the remaining data
        return sdk_core_1.ABI.ofEncoded('string', '0x' + data.slice(const_1.SOLIDITY_ERROR_SELECTOR.length)).getFirstDecodedValue();
    if (data.startsWith(const_1.SOLIDITY_PANIC_SELECTOR)) {
        // Decode the panic code and format it as a string
        const decoded = sdk_core_1.ABI.ofEncoded('uint256', '0x' + data.slice(const_1.SOLIDITY_PANIC_SELECTOR.length)).getFirstDecodedValue();
        return `Panic(0x${parseInt(decoded).toString(16).padStart(2, '0')})`;
    }
}
