// Clause.test.ts

import { Address, Hex } from '@common';
import { Clause } from '@thor/thor-client/model/transactions';
import { expect } from '@jest/globals';

describe('Clause', () => {
    describe('Constructor', () => {
        it('ok <- initialize with all parameters', () => {
            const mockTo = Address.of(
                '0x0123456789abcdef0123456789abcdef01234567'
            );
            const mockValue = BigInt('1000000000000000000'); // 1 VET
            const mockData = Hex.of('0xdeadbeef');
            const comment = 'Test transaction';
            const abi = 'mockAbi';

            const clause = new Clause(
                mockTo,
                mockValue,
                mockData,
                comment,
                abi
            );

            expect(clause.to).toBe(mockTo);
            expect(clause.value).toBe(mockValue);
            expect(clause.data).toBe(mockData);
            expect(clause.comment).toBe(comment);
            expect(clause.abi).toBe(abi);
        });

        it('ok <- handle nullable parameters correctly', () => {
            const mockValue = BigInt(0);

            const clause = new Clause(null, mockValue, null, null, null);

            expect(clause.to).toBeNull();
            expect(clause.value).toBe(mockValue);
            expect(clause.data).toBeNull();
            expect(clause.comment).toBeNull();
            expect(clause.abi).toBeNull();
        });
    });

    describe('of', () => {
        it('ok <- create a Clause instance from ClauseJSON', () => {
            const mockJson = {
                to: '0x0123456789abcDEF0123456789abCDef01234567',
                value: '0xde0b6b3a7640000', // 1 VET in hexadecimal
                data: '0xdeadbeef'
            };

            const clause = Clause.of(mockJson);

            expect(clause.to?.toString()).toBe(mockJson.to);
            expect(clause.value).toBe(BigInt('0xde0b6b3a7640000'));
            expect(clause.data?.toString()).toBe(mockJson.data);
            expect(clause.comment).toBeNull();
            expect(clause.abi).toBeNull();
        });

        it('err <- invalid ClauseJSON input', () => {
            const invalidJson = {
                to: 'invalid_address',
                value: 'not_hex'
            };

            expect(() => Clause.of(invalidJson as any)).toThrowError();
        });
    });

    describe('toJSON', () => {
        it('ok <- serialize to ClauseJSON format', () => {
            const mockTo = Address.of(
                '0x0123456789abcdef0123456789abcdef01234567'
            );
            const mockValue = BigInt('1000000000000000000'); // 1 VET
            const mockData = Hex.of('0xdeadbeef');

            const clause = new Clause(mockTo, mockValue, mockData, null, null);
            const json = clause.toJSON();

            expect(json.to).toBe(mockTo.toString());
            expect(json.value).toBe('0xde0b6b3a7640000');
            expect(json.data).toBe(mockData.toString());
        });

        it('ok <- serialize null data as "0x"', () => {
            const mockTo = Address.of(
                '0x0123456789abcdef0123456789abcdef01234567'
            );
            const mockValue = BigInt('0');

            const clause = new Clause(mockTo, mockValue, null, null, null);
            const json = clause.toJSON();

            expect(json.to).toBe(mockTo.toString());
            expect(json.value).toBe('0x0');
            expect(json.data).toBe('0x');
        });
    });
});
