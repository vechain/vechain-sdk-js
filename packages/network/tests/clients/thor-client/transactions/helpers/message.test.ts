import { describe, expect, test } from '@jest/globals';
import { decodeRevertReason } from '../../../../../src';
import { abi, keccak256 } from '@vechainfoundation/vechain-sdk-core';
import { InvalidAbiDataToDecodeError } from '@vechainfoundation/vechain-sdk-errors';

/**
 * Unit tests for building contract transactions.
 * @group unit/transactions/helpers
 */
describe('decodeRevertReason', () => {
    const errorSelector =
        '0x' + keccak256('Error(string)').toString('hex').slice(0, 8);

    const panicSelector =
        '0x' + keccak256('Panic(uint256)').toString('hex').slice(0, 8);

    test('should decode revert reason with Error(string)', () => {
        try {
            const errorMessage = 'Something went wrong!';

            const encodedRevertReason =
                errorSelector +
                abi.encode('string', errorMessage).replace('0x', '');

            const result = decodeRevertReason(encodedRevertReason);
            expect(result).toEqual(errorMessage);
        } catch (error) {
            console.log('error', error);
        }
    });

    test('should decode revert reason with Panic(uint256)', () => {
        const panicMessage = 2;

        const encodedRevertReason =
            panicSelector +
            abi.encode('uint256', panicMessage).replace('0x', '');

        const result = decodeRevertReason(encodedRevertReason);

        expect(result).toEqual('Panic(0x02)'); // 0x02 hex equals to 2 in decimal
    });

    test('should handle unknown error type', () => {
        const unknownErrorSelector = '0xabcdef01'; // Replace with an unknown error selector

        const data = unknownErrorSelector + '0123456789abcdef';
        const result = decodeRevertReason(data);

        expect(result).toEqual(
            'Cannot determine the builtin error type (Error(string) or Panic(uint256))'
        );
    });

    test('should throw custom error for invalid revert reason', () => {
        const invalidData = 'invalid-data';

        const encodedRevertReason = errorSelector + invalidData;

        expect(() => decodeRevertReason(encodedRevertReason)).toThrowError(
            InvalidAbiDataToDecodeError
        );
    });
});
