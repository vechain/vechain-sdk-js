import { describe, expect, test } from '@jest/globals';
import { Address, BlockRef, Hex, HexUInt } from '@common';
import {
    Clause,
    TransactionRequest
} from '@thor/thor-client/model/transactions'; /*

/*
 * @group unit/thor/thorest/model
 */
describe('TransactionRequest UNIT tests', () => {
    // Common test values
    const mockBlockRef = BlockRef.of(
        '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e'
    );
    const mockChainTag = 27;
    const mockClause = new Clause(
        Address.of('0x9e7911de289c3c856ce7f421034f66b6cde49c39'),
        1n,
        null,
        null,
        null
    );

    const mockClauses = [mockClause];
    const mockDependsOn = Hex.of('0x123456789abcdef');
    const mockExpiration = 32;
    const mockGas = 100000n;
    const mockGasPriceCoef = 0n;
    const mockNonce = 8;
    const mockMaxFeePerGas = 141592653n;
    const mockMaxPriorityFeePerGas = 58979323846n;

    const mockOrigin = Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed');

    describe('constructor', () => {
        test('ok <- should create a TransactionRequest with all parameters', () => {
            const request = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: mockClauses,
                dependsOn: mockDependsOn,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                isIntendedToBeSponsored: true,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce,
                origin: mockOrigin
            });

            expect(request.blockRef).toBe(mockBlockRef);
            expect(request.chainTag).toBe(mockChainTag);
            expect(request.clauses).toBe(mockClauses);
            expect(request.dependsOn).toBe(mockDependsOn);
            expect(request.expiration).toBe(mockExpiration);
            expect(request.gas).toBe(mockGas);
            expect(request.gasPriceCoef).toBe(mockGasPriceCoef);
            expect(request.isIntendedToBeSponsored).toBe(true);
            expect(request.maxFeePerGas).toBe(mockMaxFeePerGas);
            expect(request.maxPriorityFeePerGas).toBe(mockMaxPriorityFeePerGas);
            expect(request.nonce).toBe(mockNonce);
            expect(request.origin).toBe(mockOrigin);
        });

        test('ok <- should create a TransactionRequest with isSponsored defaulting to false when not provided', () => {
            const request = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: mockClauses,
                dependsOn: mockDependsOn,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            }); // Type assertion to test default behavior

            expect(request.isIntendedToBeSponsored).toBe(false);
            expect(request.maxFeePerGas).toBeUndefined();
            expect(request.maxPriorityFeePerGas).toBeUndefined();
            expect(request.origin).toBeUndefined();
        });

        test('ok <- should handle null dependsOn', () => {
            const request = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: mockClauses,
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });

            expect(request.dependsOn).toBeNull();
        });

        test('ok <- should accept empty clauses array', () => {
            const request = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
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
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [clause1, clause2],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });

            expect(request.clauses.length).toBe(2);
            expect(request.clauses[0]).toBe(clause1);
            expect(request.clauses[1]).toBe(clause2);
        });
    });

    describe('isSigned', () => {
        test('ok <- should return false', () => {
            const request = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: mockClauses,
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });

            expect(request.isSigned()).toBe(false);
        });
    });

    describe('toJSON', () => {
        test('ok <- should convert TransactionRequest to JSON with all properties', () => {
            const request = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: mockClauses,
                dependsOn: mockDependsOn,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce,
                isIntendedToBeSponsored: true
            });

            const json = request.toJSON();

            expect(json.blockRef).toBe(mockBlockRef.toString());
            expect(json.chainTag).toBe(mockChainTag);
            expect(json.clauses).toHaveLength(1);
            expect(json.clauses[0]).toEqual(mockClause.toJSON());
            expect(json.dependsOn).toBe(mockDependsOn.toString());
            expect(json.expiration).toBe(mockExpiration);
            expect(json.gas).toBe(mockGas);
            expect(json.gasPriceCoef).toBe(mockGasPriceCoef);
            expect(json.nonce).toBe(mockNonce);
            expect(json.isIntendedToBeSponsored).toBe(true);
        });

        test('ok <- should convert TransactionRequest to JSON with null dependsOn', () => {
            const request = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: mockClauses,
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce,
                isIntendedToBeSponsored: false
            });

            const json = request.toJSON();

            expect(json.dependsOn).toBeNull();
            expect(json.isIntendedToBeSponsored).toBe(false);
        });

        test('ok <- should convert TransactionRequest to JSON with empty clauses array', () => {
            const request = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
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
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [clause1, clause2],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });

            const json = request.toJSON();

            expect(json.clauses).toHaveLength(2);
            expect(json.clauses[0]).toEqual(clause1.toJSON());
            expect(json.clauses[1]).toEqual(clause2.toJSON());
        });

        test('ok <- should convert TransactionRequest to JSON with default isIntendedToBeSponsored', () => {
            const request = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: mockClauses,
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
                // isIntendedToBeSponsored not provided, should default to false
            });

            const json = request.toJSON();

            expect(json.isIntendedToBeSponsored).toBe(false);
        });

        test('ok <- should convert TransactionRequest to JSON with undefined or zero maxFeePerGas and maxPriorityFeePerGas equivalence', () => {
            const expected = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: mockClauses,
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            }).toJSON();
            const actual = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: mockClauses,
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                maxFeePerGas: 0n,
                maxPriorityFeePerGas: 0n,
                nonce: mockNonce
            }).toJSON();
            expect(actual).toEqual(expected);
        });

        test('ok <- should convert TransactionRequest to JSON with bigint values preserved', () => {
            const largeGas = 999999999999999999n;
            const largeGasPriceCoef = 123456789n;

            const request = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: mockClauses,
                dependsOn: null,
                expiration: mockExpiration,
                gas: largeGas,
                gasPriceCoef: largeGasPriceCoef,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            });

            const json = request.toJSON();

            expect(json.gas).toBe(largeGas);
            expect(json.gasPriceCoef).toBe(largeGasPriceCoef);
            expect(typeof json.gas).toBe('bigint');
            expect(typeof json.gasPriceCoef).toBe('bigint');
            expect(typeof json.maxFeePerGas).toBe('bigint');
            expect(typeof json.maxPriorityFeePerGas).toBe('bigint');
        });

        test('ok <- should convert TransactionRequest to JSON with all string values properly formatted', () => {
            const request = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: mockClauses,
                dependsOn: mockDependsOn,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce,
                origin: mockOrigin
            });

            const json = request.toJSON();

            expect(typeof json.blockRef).toBe('string');
            expect(typeof json.dependsOn).toBe('string');
            expect(typeof json.origin).toBe('string');
            expect(json.blockRef.startsWith('0x')).toBe(true);
            expect(json.dependsOn?.startsWith('0x')).toBe(true);
            expect(json.origin?.startsWith('0x')).toBe(true);
        });

        test('ok <- should produce JSON that satisfies TransactionRequestJSON interface', () => {
            const request = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: mockClauses,
                dependsOn: mockDependsOn,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                isIntendedToBeSponsored: true,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce,
                origin: mockOrigin
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
            expect(json).toHaveProperty('isIntendedToBeSponsored');
            expect(json).toHaveProperty('maxFeePerGas');
            expect(json).toHaveProperty('maxPriorityFeePerGas');
            expect(json).toHaveProperty('nonce');
            expect(json).toHaveProperty('origin');

            expect(typeof json.blockRef).toBe('string');
            expect(typeof json.chainTag).toBe('number');
            expect(Array.isArray(json.clauses)).toBe(true);
            expect(
                typeof json.dependsOn === 'string' || json.dependsOn === null
            ).toBe(true);
            expect(typeof json.expiration).toBe('number');
            expect(typeof json.gas).toBe('bigint');
            expect(typeof json.gasPriceCoef).toBe('bigint');
            expect(typeof json.isIntendedToBeSponsored).toBe('boolean');
            expect(typeof json.maxFeePerGas).toBe('bigint');
            expect(typeof json.maxPriorityFeePerGas).toBe('bigint');
            expect(typeof json.nonce).toBe('number');
            expect(typeof json.origin).toBe('string');
        });
    });
});
