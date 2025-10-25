import { describe, expect, test } from '@jest/globals';
import { type ClauseJSON } from '@thor/thorest/json';
import { ClauseData } from '@thor';
import { IllegalArgumentError } from '@common';

/**
 * @group unit/thor/thorest/common
 */
describe('ClauseData UNIT tests', () => {
    describe('of', () => {
        test('ok <- create a ClauseData instance with valid ClauseJSON input', () => {
            const validJson: ClauseJSON = {
                to: '0xabc1230000000000000000000000000000000000',
                value: '0x64',
                data: '0x1234'
            };

            const clause = ClauseData.of(validJson);

            expect(clause.to?.toString().toLowerCase()).toEqual(validJson.to);
            expect(clause.value).toBe(BigInt(100)); // 0x64 is 100 in decimal
            expect(clause.data?.toString()).toBe(validJson.data);
        });

        it('should create a ClauseData instance with minimal valid ClauseJSON', () => {
            const validJson: ClauseJSON = {
                to: null,
                value: '0x0'
            };

            const clause = ClauseData.of(validJson);

            expect(clause.to).toBeNull(); // Null indicates contract deployment
            expect(clause.value).toBe(BigInt(0));
            expect(clause.data).toBeNull(); // No data provided
        });

        test('err <- throw an IllegalArgumentError for invalid "to" address', () => {
            const invalidJson: ClauseJSON = {
                to: 'invalidAddress',
                value: '0x64'
            };

            expect(() => ClauseData.of(invalidJson)).toThrow(
                IllegalArgumentError
            );
        });

        test('err <- throw an IllegalArgumentError for invalid "value" field', () => {
            const invalidJson: ClauseJSON = {
                to: '0xabc1230000000000000000000000000000000000',
                value: 'invalidHex'
            };

            expect(() => ClauseData.of(invalidJson)).toThrow(
                IllegalArgumentError
            );
        });

        test('err <- throw an IllegalArgumentError for invalid "data" field', () => {
            const invalidJson: ClauseJSON = {
                to: '0xabc1230000000000000000000000000000000000',
                value: '0x64',
                data: 'notHexData'
            };

            expect(() => ClauseData.of(invalidJson)).toThrow(
                IllegalArgumentError
            );
        });
    });
});
