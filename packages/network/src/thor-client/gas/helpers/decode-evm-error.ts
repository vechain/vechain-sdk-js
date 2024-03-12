// https://docs.soliditylang.org/en/v0.8.16/control-structures.html#error-handling-assert-require-revert-and-exceptions
// builtin errors in solidity, Error(string) and Panic(uint256)

import { abi } from '@vechain/sdk-core';
import { SOLIDITY_ERROR_SELECTOR, SOLIDITY_PANIC_SELECTOR } from './const';

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
function decodeRevertReason(data: string): string | undefined {
    // Check if the revert reason starts with the error selector
    if (data.startsWith(SOLIDITY_ERROR_SELECTOR))
        // Decode the error message from the remaining data
        return abi.decode(
            'string',
            '0x' + data.slice(SOLIDITY_ERROR_SELECTOR.length)
        );

    if (data.startsWith(SOLIDITY_PANIC_SELECTOR)) {
        // Decode the panic code and format it as a string
        const decoded = abi.decode(
            'uint256',
            '0x' + data.slice(SOLIDITY_PANIC_SELECTOR.length)
        );
        return `Panic(0x${parseInt(decoded as string)
            .toString(16)
            .padStart(2, '0')})`;
    }
}

export { decodeRevertReason };
