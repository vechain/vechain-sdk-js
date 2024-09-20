import { describe, expect } from '@jest/globals';
import { Address, FPN, Units, VET, type TransactionClause } from '../../src';
import { Clause } from '../../src/clause/Cluase';
import { InvalidDataType } from '@vechain/sdk-errors';

const ClauseFixture = {
    to: '0x051815fdc271780de69dd8959329b27d6604469e'
};

describe('Clause class tests', () => {
    describe('transferVET method tests', () => {
        test('Throw <- infinite VET', () => {
            expect(() => {
                Clause.transferVET(
                    Address.of(ClauseFixture.to),
                    VET.of(FPN.POSITIVE_INFINITY)
                );
            }).toThrow(InvalidDataType);
        });
        test('Throw <- NaN VET', () => {
            expect(() => {
                Clause.transferVET(
                    Address.of(ClauseFixture.to),
                    VET.of(FPN.NaN)
                );
            }).toThrow(InvalidDataType);
        });

        test('Throw <- negative VET', () => {
            expect(() => {
                Clause.transferVET(
                    Address.of(ClauseFixture.to),
                    VET.of(FPN.of('-1'))
                );
            }).toThrow(InvalidDataType);
        });

        test('Return clause <- 1 wei', () => {
            const expected = {
                to: ClauseFixture.to,
                value: `0x1`,
                data: '0x'
            } satisfies TransactionClause;
            const actual = Clause.transferVET(
                Address.of(expected.to),
                VET.of(1, Units.wei)
            ) as TransactionClause;
            expect(actual).toEqual(expected);
        });

        test('Return clause <- 100 wei VET', () => {
            const expected = {
                to: ClauseFixture.to,
                value: `0x64`,
                data: '0x'
            } satisfies TransactionClause;
            const actual = Clause.transferVET(
                Address.of(expected.to),
                VET.of('0.1', Units.kwei)
            ) as TransactionClause;
            expect(actual).toEqual(expected);
        });

        test('Return clause <- 500000000 VET', () => {
            const expected = {
                to: ClauseFixture.to,
                value: '0x19d971e4fe8401e74000000',
                data: '0x'
            } satisfies TransactionClause;
            const actual = Clause.transferVET(
                Address.of(expected.to),
                VET.of(500000000n)
            ) as TransactionClause;
            console.log(actual);
        });
    });
});
