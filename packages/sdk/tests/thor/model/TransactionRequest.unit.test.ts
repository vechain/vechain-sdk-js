import { describe, expect, test } from '@jest/globals';
import { Address, BlockRef, Hex, HexUInt } from '@vcdm';
import { Clause, TransactionRequest } from '@thor';

/*
 * @group unit/thor/model
 */
describe('TransactionRequest UNIT tests', () => {
    // Common test values
    const validBlockRef = BlockRef.of(
        '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e'
    );
    const validChainTag = 27;
    const validClause = new Clause(
        Address.of('0x9e7911de289c3c856ce7f421034f66b6cde49c39'),
        1n,
        null,
        null,
        null
    );
    const validClauses = [validClause];
    const validDependsOn = Hex.of('0x123456789abcdef');
    const validExpiration = 32;
    const validGas = 100000n;
    const validGasPriceCoef = 0n;
    const validNonce = 8;

    describe('constructor', () => {
        test('ok <- should create a TransactionRequest with all required parameters', () => {
            const request = new TransactionRequest({
                blockRef: validBlockRef,
                chainTag: validChainTag,
                clauses: validClauses,
                dependsOn: validDependsOn,
                expiration: validExpiration,
                gas: validGas,
                gasPriceCoef: validGasPriceCoef,
                nonce: validNonce,
                isSponsored: true
            });

            expect(request.blockRef).toBe(validBlockRef);
            expect(request.chainTag).toBe(validChainTag);
            expect(request.clauses).toBe(validClauses);
            expect(request.dependsOn).toBe(validDependsOn);
            expect(request.expiration).toBe(validExpiration);
            expect(request.gas).toBe(validGas);
            expect(request.gasPriceCoef).toBe(validGasPriceCoef);
            expect(request.nonce).toBe(validNonce);
            expect(request.isSponsored).toBe(true);
        });

        test('ok <- should create a TransactionRequest with isSponsored defaulting to false when not provided', () => {
            const request = new TransactionRequest({
                blockRef: validBlockRef,
                chainTag: validChainTag,
                clauses: validClauses,
                dependsOn: validDependsOn,
                expiration: validExpiration,
                gas: validGas,
                gasPriceCoef: validGasPriceCoef,
                nonce: validNonce
            } as any); // Type assertion to test default behavior

            expect(request.isSponsored).toBe(false);
        });

        test('ok <- should handle null dependsOn', () => {
            const request = new TransactionRequest({
                blockRef: validBlockRef,
                chainTag: validChainTag,
                clauses: validClauses,
                dependsOn: null,
                expiration: validExpiration,
                gas: validGas,
                gasPriceCoef: validGasPriceCoef,
                nonce: validNonce
            });

            expect(request.dependsOn).toBeNull();
        });

        test('ok <- should accept empty clauses array', () => {
            const request = new TransactionRequest({
                blockRef: validBlockRef,
                chainTag: validChainTag,
                clauses: [],
                dependsOn: null,
                expiration: validExpiration,
                gas: validGas,
                gasPriceCoef: validGasPriceCoef,
                nonce: validNonce
            });

            expect(request.clauses).toEqual([]);
        });

        test('ok <- should accept multiple clauses', () => {
            const clause1 = new Clause(
                Address.of('0x9e7911de289c3c856ce7f421034f66b6cde49c39'),
                1n,
                null,
                null,
                null
            );
            const clause2 = new Clause(
                Address.of('0x8e7911de289c3c856ce7f421034f66b6cde49c38'),
                2n,
                HexUInt.of('0x12345'),
                'Test clause',
                null
            );

            const request = new TransactionRequest({
                blockRef: validBlockRef,
                chainTag: validChainTag,
                clauses: [clause1, clause2],
                dependsOn: null,
                expiration: validExpiration,
                gas: validGas,
                gasPriceCoef: validGasPriceCoef,
                nonce: validNonce
            });

            expect(request.clauses.length).toBe(2);
            expect(request.clauses[0]).toBe(clause1);
            expect(request.clauses[1]).toBe(clause2);
        });
    });

    describe('isSigned', () => {
        test('ok <- should return false', () => {
            const request = new TransactionRequest({
                blockRef: validBlockRef,
                chainTag: validChainTag,
                clauses: validClauses,
                dependsOn: null,
                expiration: validExpiration,
                gas: validGas,
                gasPriceCoef: validGasPriceCoef,
                nonce: validNonce
            });

            expect(request.isSigned()).toBe(false);
        });
    });
});
