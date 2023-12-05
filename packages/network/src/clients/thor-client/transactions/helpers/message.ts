// https://docs.soliditylang.org/en/v0.8.16/control-structures.html#error-handling-assert-require-revert-and-exceptions
// builtin errors in solidity, Error(string) and Panic(uint256)

import { abi, keccak256 } from '@vechainfoundation/vechain-sdk-core';
import { buildError, ERROR_CODES } from '@vechainfoundation/vechain-sdk-errors';

const errorSelector =
    '0x' + keccak256('Error(string)').toString('hex').slice(0, 8);
const panicSelector =
    '0x' + keccak256('Panic(uint256)').toString('hex').slice(0, 8);
/**
 * Decodes revert reasons from a given hex-encoded data string, identifying whether the revert is due to an "Error(string)" or a "Panic(uint256)".
 *
 * @param data - Hex-encoded data containing revert information.
 * @returns Decoded revert reason or an error message if decoding fails.
 * @throws {InvalidAbiDataToDecodeError} Throws a custom error if decoding the revert reason fails.
 *
 * @example
 * ```typescript
 * const revertReason = decodeRevertReason('0x0123456789abcdef0123456789abcdef');
 * console.log(revertReason); // 'Decoded Revert Reason'
 * ```
 */
export function decodeRevertReason(data: string): string {
    try {
        // Check if the revert reason starts with the error selector
        if (data.startsWith(errorSelector)) {
            // Decode the error message from the remaining data
            return abi.decode(
                'string',
                '0x' + data.slice(errorSelector.length)
            );
        } else if (data.startsWith(panicSelector)) {
            // Decode the panic code and format it as a string
            const decoded = abi.decode(
                'uint256',
                '0x' + data.slice(panicSelector.length)
            );
            return `Panic(0x${parseInt(decoded as string)
                .toString(16)
                .padStart(2, '0')})`;
        } else {
            // Indicate that the error type cannot be determined
            return 'Cannot determine the builtin error type (Error(string) or Panic(uint256))';
        }
    } catch (error) {
        // If an error occurs during decoding, throw a custom error
        throw buildError(
            ERROR_CODES.ABI.INVALID_DATA_TO_DECODE,
            'Cannot decode revert reason',
            { data },
            error
        );
    }
}
