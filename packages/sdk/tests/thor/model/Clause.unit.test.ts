// Clause.test.ts
import { expect } from '@jest/globals';
import { Clause } from '@thor/model/Clause';
import { IllegalArgumentError } from '@errors';
import { Address } from '@vechain/sdk';
import { type ClauseJSON } from '@thor/json';

/**
 * @group unit/thor/model
 */
describe('Clause', () => {
    describe('constructor', () => {
        test('ok <- should create a Clause instance with valid JSON', () => {
            const input = {
                to: Address.of(
                    '0x1234567890abcdef1234567890abcdef12345678'
                ).toString(), // EIP-55 checksum address
                value: '0x10',
                data: '0xabcdef',
                comment: 'Test comment',
                abi: 'testABI'
            };
            const clause = new Clause(input);

            expect(clause.to?.toString()).toBe(input.to);
            expect(clause.value).toBe(BigInt(16)); // 0x10 in decimal
            expect(clause.data?.toString()).toBe(input.data);
            expect(clause.comment).toBe(input.comment);
            expect(clause.abi).toBe(input.abi);
        });

        test('ok <- should handle null as the `to` address', () => {
            const input = {
                to: null,
                value: '0x0',
                data: '0x'
            } satisfies ClauseJSON;
            const clause = new Clause(input);

            expect(clause.to).toBeNull();
            expect(clause.value).toBe(BigInt(0));
            expect(clause.data?.toString()).toBe('0x');
            expect(clause.comment).toBeNull();
            expect(clause.abi).toBeNull();
        });

        test('err <- should throw IllegalArgumentError for invalid JSON values', () => {
            const badInput = {
                to: 'invalid_address',
                value: 'invalid_value'
            } satisfies ClauseJSON;

            expect(() => new Clause(badInput)).toThrow(IllegalArgumentError);
        });
    });

    describe('toJSON', () => {
        test('ok <- should convert Clause instance to a valid JSON representation', () => {
            const input = {
                to: Address.of(
                    '0x1234567890abcdef1234567890abcdef12345678'
                ).toString(), // // EIP-55 checksum address
                value: '0x10',
                data: '0xabcdef',
                comment: 'Test comment',
                abi: 'testABI'
            };
            const clause = new Clause(input);
            const json = clause.toJSON();

            expect(json).toEqual(input);
        });

        it('ok <- should handle null or undefined properties in the JSON output', () => {
            const input = {
                to: null,
                value: '0x0'
            } satisfies ClauseJSON;
            const clause = new Clause(input);
            const json = clause.toJSON();

            expect(json).toEqual({
                to: null,
                value: '0x0',
                data: '0x',
                comment: undefined,
                abi: undefined
            });
        });
    });
});
