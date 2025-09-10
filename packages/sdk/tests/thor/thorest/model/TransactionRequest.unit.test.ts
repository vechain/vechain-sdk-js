import { describe, expect, test } from '@jest/globals';
import { Address, BlockRef, Hex, HexUInt } from '@common';
import { Clause, TransactionRequest } from '@thor/thorest/model';

/*
 * @group unit/thor/thorest/model
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
                isIntendedToBeSponsored: true
            });

            expect(request.blockRef).toBe(validBlockRef);
            expect(request.chainTag).toBe(validChainTag);
            expect(request.clauses).toBe(validClauses);
            expect(request.dependsOn).toBe(validDependsOn);
            expect(request.expiration).toBe(validExpiration);
            expect(request.gas).toBe(validGas);
            expect(request.gasPriceCoef).toBe(validGasPriceCoef);
            expect(request.nonce).toBe(validNonce);
            expect(request.isIntendedToBeSponsored).toBe(true);
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
            }); // Type assertion to test default behavior

            expect(request.isIntendedToBeSponsored).toBe(false);
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

    describe('toJSON', () => {
        test('ok <- should convert TransactionRequest to JSON with all properties', () => {
            const request = new TransactionRequest({
                blockRef: validBlockRef,
                chainTag: validChainTag,
                clauses: validClauses,
                dependsOn: validDependsOn,
                expiration: validExpiration,
                gas: validGas,
                gasPriceCoef: validGasPriceCoef,
                nonce: validNonce,
                isIntendedToBeSponsored: true
            });

            const json = request.toJSON();

            expect(json.blockRef).toBe(validBlockRef.toString());
            expect(json.chainTag).toBe(validChainTag);
            expect(json.clauses).toHaveLength(1);
            expect(json.clauses[0]).toEqual(validClause.toJSON());
            expect(json.dependsOn).toBe(validDependsOn.toString());
            expect(json.expiration).toBe(validExpiration);
            expect(json.gas).toBe(validGas);
            expect(json.gasPriceCoef).toBe(validGasPriceCoef);
            expect(json.nonce).toBe(validNonce);
            expect(json.isIntendedToBeSponsored).toBe(true);
        });

        test('ok <- should convert TransactionRequest to JSON with null dependsOn', () => {
            const request = new TransactionRequest({
                blockRef: validBlockRef,
                chainTag: validChainTag,
                clauses: validClauses,
                dependsOn: null,
                expiration: validExpiration,
                gas: validGas,
                gasPriceCoef: validGasPriceCoef,
                nonce: validNonce,
                isIntendedToBeSponsored: false
            });

            const json = request.toJSON();

            expect(json.dependsOn).toBeNull();
            expect(json.isIntendedToBeSponsored).toBe(false);
        });

        test('ok <- should convert TransactionRequest to JSON with empty clauses array', () => {
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

            const json = request.toJSON();

            expect(json.clauses).toEqual([]);
            expect(Array.isArray(json.clauses)).toBe(true);
        });

        test('ok <- should convert TransactionRequest to JSON with multiple clauses', () => {
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

            const json = request.toJSON();

            expect(json.clauses).toHaveLength(2);
            expect(json.clauses[0]).toEqual(clause1.toJSON());
            expect(json.clauses[1]).toEqual(clause2.toJSON());
        });

        test('ok <- should convert TransactionRequest to JSON with default isIntendedToBeSponsored', () => {
            const request = new TransactionRequest({
                blockRef: validBlockRef,
                chainTag: validChainTag,
                clauses: validClauses,
                dependsOn: null,
                expiration: validExpiration,
                gas: validGas,
                gasPriceCoef: validGasPriceCoef,
                nonce: validNonce
                // isIntendedToBeSponsored not provided, should default to false
            });

            const json = request.toJSON();

            expect(json.isIntendedToBeSponsored).toBe(false);
        });

        test('ok <- should convert TransactionRequest to JSON with bigint values preserved', () => {
            const largeGas = 999999999999999999n;
            const largeGasPriceCoef = 123456789n;

            const request = new TransactionRequest({
                blockRef: validBlockRef,
                chainTag: validChainTag,
                clauses: validClauses,
                dependsOn: null,
                expiration: validExpiration,
                gas: largeGas,
                gasPriceCoef: largeGasPriceCoef,
                nonce: validNonce
            });

            const json = request.toJSON();

            expect(json.gas).toBe(largeGas);
            expect(json.gasPriceCoef).toBe(largeGasPriceCoef);
            expect(typeof json.gas).toBe('bigint');
            expect(typeof json.gasPriceCoef).toBe('bigint');
        });

        test('ok <- should convert TransactionRequest to JSON with all string values properly formatted', () => {
            const request = new TransactionRequest({
                blockRef: validBlockRef,
                chainTag: validChainTag,
                clauses: validClauses,
                dependsOn: validDependsOn,
                expiration: validExpiration,
                gas: validGas,
                gasPriceCoef: validGasPriceCoef,
                nonce: validNonce
            });

            const json = request.toJSON();

            expect(typeof json.blockRef).toBe('string');
            expect(typeof json.dependsOn).toBe('string');
            expect(json.blockRef.startsWith('0x')).toBe(true);
            expect(json.dependsOn?.startsWith('0x')).toBe(true);
        });

        test('ok <- should produce JSON that satisfies TransactionRequestJSON interface', () => {
            const request = new TransactionRequest({
                blockRef: validBlockRef,
                chainTag: validChainTag,
                clauses: validClauses,
                dependsOn: validDependsOn,
                expiration: validExpiration,
                gas: validGas,
                gasPriceCoef: validGasPriceCoef,
                nonce: validNonce,
                isIntendedToBeSponsored: true
            });

            const json = request.toJSON();

            // Verify all required properties exist and have correct types
            expect(json).toHaveProperty('blockRef');
            expect(json).toHaveProperty('chainTag');
            expect(json).toHaveProperty('clauses');
            expect(json).toHaveProperty('dependsOn');
            expect(json).toHaveProperty('expiration');
            expect(json).toHaveProperty('gas');
            expect(json).toHaveProperty('gasPriceCoef');
            expect(json).toHaveProperty('nonce');
            expect(json).toHaveProperty('isIntendedToBeSponsored');

            expect(typeof json.blockRef).toBe('string');
            expect(typeof json.chainTag).toBe('number');
            expect(Array.isArray(json.clauses)).toBe(true);
            expect(
                typeof json.dependsOn === 'string' || json.dependsOn === null
            ).toBe(true);
            expect(typeof json.expiration).toBe('number');
            expect(typeof json.gas).toBe('bigint');
            expect(typeof json.gasPriceCoef).toBe('bigint');
            expect(typeof json.nonce).toBe('number');
            expect(typeof json.isIntendedToBeSponsored).toBe('boolean');
        });
    });
});
