import { expect } from '@jest/globals';
import { Address, HexUInt, InvalidTransactionField, Quantity } from '@common';
import {
    Clause,
    TransactionRequest
} from '@thor/thor-client/model/transactions';

/**
 * @group unit/thor/thor-client/transactions
 */
describe('TransactionRequest', () => {
    // Test data setup
    const mockAddress = Address.of(
        '0x7567D83b7b8d80ADdCb281A71d54Fc7B3364ffed'
    );
    const mockBeggar = Address.of('0x1234567890123456789012345678901234567890');
    const mockBlockRef = HexUInt.of('0x1234567890abcdef');
    const mockDependsOn = HexUInt.of(
        '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    );
    const mockExpiration = 32;
    const mockGas = 25000n;
    const mockGasPriceCoef = 123n;
    const mockMaxFeePerGas = 20000000000n; // 20 Gwei
    const mockMaxPriorityFeePerGas = 5000000000n; // 5 Gwei
    const mockNonce = 3n;
    const mockValue = Quantity.of(1000);
    const mockGasPayerSignature = new Uint8Array(65).fill(0xbe);
    const mockOriginSignature = new Uint8Array(65).fill(0xba);
    const mockSignature = new Uint8Array([
        ...mockOriginSignature,
        ...mockGasPayerSignature
    ]);

    describe('constructor', () => {
        test('ok <- with minimal parameters', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [new Clause(mockAddress, mockValue.bi)],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const transaction = new TransactionRequest(params);

            expect(transaction.blockRef).toBe(mockBlockRef);
            expect(transaction.chainTag).toBe(1);
            expect(transaction.clauses).toHaveLength(1);
            expect(transaction.dependsOn).toBeNull();
            expect(transaction.expiration).toBe(mockExpiration);
            expect(transaction.gas).toBe(mockGas);
            expect(transaction.gasPriceCoef).toBe(mockGasPriceCoef);
            expect(transaction.nonce).toBe(mockNonce);
            expect(transaction.beggar).toBeUndefined();
            expect(transaction.maxFeePerGas).toBeUndefined();
            expect(transaction.maxPriorityFeePerGas).toBeUndefined();
        });

        test('ok <- dynamic with all parameters', () => {
            const params = {
                beggar: mockBeggar,
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [new Clause(mockAddress, mockValue.bi)],
                dependsOn: mockDependsOn,
                expiration: mockExpiration,
                gas: mockGas,
                nonce: mockNonce,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas
            };

            const transaction = new TransactionRequest(
                params,
                mockOriginSignature,
                mockGasPayerSignature,
                mockSignature
            );

            expect(transaction.beggar).toBe(mockBeggar);
            expect(transaction.blockRef).toBe(mockBlockRef);
            expect(transaction.chainTag).toBe(1);
            expect(transaction.clauses).toHaveLength(1);
            expect(transaction.dependsOn).toBe(mockDependsOn);
            expect(transaction.expiration).toBe(mockExpiration);
            expect(transaction.gas).toBe(mockGas);
            expect(transaction.gasPriceCoef).toBe(undefined);
            expect(transaction.nonce).toBe(mockNonce);
            expect(transaction.maxFeePerGas).toBe(mockMaxFeePerGas);
            expect(transaction.maxPriorityFeePerGas).toBe(
                mockMaxPriorityFeePerGas
            );
        });

        test('ok <- legacy with all parameters', () => {
            const params = {
                beggar: mockBeggar,
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [new Clause(mockAddress, mockValue.bi)],
                dependsOn: mockDependsOn,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const transaction = new TransactionRequest(
                params,
                mockOriginSignature,
                mockGasPayerSignature,
                mockSignature
            );

            expect(transaction.beggar).toBe(mockBeggar);
            expect(transaction.blockRef).toBe(mockBlockRef);
            expect(transaction.chainTag).toBe(1);
            expect(transaction.clauses).toHaveLength(1);
            expect(transaction.dependsOn).toBe(mockDependsOn);
            expect(transaction.expiration).toBe(mockExpiration);
            expect(transaction.gas).toBe(mockGas);
            expect(transaction.gasPriceCoef).toBe(mockGasPriceCoef);
            expect(transaction.nonce).toBe(mockNonce);
            expect(transaction.maxFeePerGas).toBe(undefined);
            expect(transaction.maxPriorityFeePerGas).toBe(undefined);
        });

        test('ok <- create defensive copies of signatures', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [new Clause(mockAddress, mockValue.bi)],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const originalOriginSig = new Uint8Array([1, 2, 3]);
            const originalGasPayerSig = new Uint8Array([4, 5, 6]);
            const originalSig = new Uint8Array([7, 8, 9]);

            const transaction = new TransactionRequest(
                params,
                originalOriginSig,
                originalGasPayerSig,
                originalSig
            );

            // Modify original arrays
            originalOriginSig[0] = 99;
            originalGasPayerSig[0] = 99;
            originalSig[0] = 99;

            // Transaction should still have original values
            expect(transaction.originSignature[0]).toBe(1);
            expect(transaction.gasPayerSignature[0]).toBe(4);
            expect(transaction.signature[0]).toBe(7);
        });

        test('ok <- handle undefined signatures', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const transaction = new TransactionRequest(params);

            expect(transaction.originSignature).toEqual(new Uint8Array([]));
            expect(transaction.gasPayerSignature).toEqual(new Uint8Array([]));
            expect(transaction.signature).toEqual(new Uint8Array([]));
        });
    });

    describe('isDynamicFee getter', () => {
        test('true <- when both dynamic fee fields are set', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                nonce: mockNonce,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas
            };

            const transaction = new TransactionRequest(params);
            expect(transaction.isDynamicFee).toBe(true);
        });

        test('false <- for legacy transaction', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const transaction = new TransactionRequest(params);
            expect(transaction.isDynamicFee).toBe(false);
        });
    });

    describe('isIntendedToBeSponsored getter', () => {
        test('true <- when beggar is defined', () => {
            const params = {
                beggar: mockBeggar,
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const transaction = new TransactionRequest(params);
            expect(transaction.isIntendedToBeSponsored).toBe(true);
        });

        test('false <- when beggar is undefined', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const transaction = new TransactionRequest(params);
            expect(transaction.isIntendedToBeSponsored).toBe(false);
        });
    });

    describe('isSigned getter', () => {
        test('false <- for unsigned transaction without beggar', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const transaction = new TransactionRequest(params);
            expect(transaction.isSigned).toBe(false);
        });

        test('true <- for signed transaction without beggar', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const transaction = new TransactionRequest(
                params,
                mockOriginSignature,
                undefined,
                mockOriginSignature
            );
            expect(transaction.isSigned).toBe(true);
        });

        test('false <- for partially signed sponsored transaction', () => {
            const params = {
                beggar: mockBeggar,
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            // Only origin signature
            const transaction1 = new TransactionRequest(
                params,
                mockOriginSignature
            );
            expect(transaction1.isSigned).toBe(false);

            // Only gas payer signature
            const transaction2 = new TransactionRequest(
                params,
                undefined,
                mockGasPayerSignature
            );
            expect(transaction2.isSigned).toBe(false);
        });

        test('true <- for fully signed sponsored transaction', () => {
            const params = {
                beggar: mockBeggar,
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const transaction = new TransactionRequest(
                params,
                mockOriginSignature,
                mockGasPayerSignature,
                mockSignature
            );
            expect(transaction.isSigned).toBe(true);
        });

        test('false <- when signature length mismatch for non-sponsored', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const wrongSignature = new Uint8Array([1, 2, 3]); // Different length
            const transaction = new TransactionRequest(
                params,
                mockOriginSignature,
                undefined,
                wrongSignature
            );
            expect(transaction.isSigned).toBe(false);
        });

        test('false <- when signature length mismatch for sponsored', () => {
            const params = {
                beggar: mockBeggar,
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const wrongSignature = new Uint8Array([1, 2, 3]); // Different length
            const transaction = new TransactionRequest(
                params,
                mockOriginSignature,
                mockGasPayerSignature,
                wrongSignature
            );
            expect(transaction.isSigned).toBe(false);
        });
    });

    describe('toJSON method', () => {
        test('ok <- minimal transaction to JSON', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [new Clause(mockAddress, mockValue.bi)],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const transaction = new TransactionRequest(params);
            const json = transaction.toJSON();

            expect(json.beggar).toBeUndefined();
            expect(json.blockRef).toBe(mockBlockRef.toString());
            expect(json.chainTag).toBe(1);
            expect(json.clauses).toHaveLength(1);
            expect(json.dependsOn).toBeNull();
            expect(json.expiration).toBe(mockExpiration);
            expect(json.gas).toBe(mockGas);
            expect(json.gasPriceCoef).toBe(mockGasPriceCoef);
            expect(json.nonce).toBe(HexUInt.of(mockNonce).toString());
            expect(json.maxFeePerGas).toBeUndefined();
            expect(json.maxPriorityFeePerGas).toBeUndefined();
            expect(json.originSignature).toBeUndefined();
            expect(json.gasPayerSignature).toBeUndefined();
            expect(json.signature).toBeUndefined();
        });

        test('ok <- full dynamic transaction to JSON', () => {
            const params = {
                beggar: mockBeggar,
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [new Clause(mockAddress, mockValue.bi)],
                dependsOn: mockDependsOn,
                expiration: mockExpiration,
                gas: mockGas,
                nonce: mockNonce,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas
            };

            const transaction = new TransactionRequest(
                params,
                mockOriginSignature,
                mockGasPayerSignature,
                mockSignature
            );
            const json = transaction.toJSON();

            expect(json.beggar).toBe(mockBeggar.toString());
            expect(json.blockRef).toBe(mockBlockRef.toString());
            expect(json.chainTag).toBe(1);
            expect(json.clauses).toHaveLength(1);
            expect(json.dependsOn).toBe(mockDependsOn.toString());
            expect(json.expiration).toBe(mockExpiration);
            expect(json.gas).toBe(mockGas);
            expect(json.gasPriceCoef).toBe(undefined);
            expect(json.nonce).toBe(HexUInt.of(mockNonce).toString());
            expect(json.maxPriorityFeePerGas).toBe(mockMaxPriorityFeePerGas);
            expect(json.originSignature).toBe(
                HexUInt.of(mockOriginSignature).toString()
            );
            expect(json.gasPayerSignature).toBe(
                HexUInt.of(mockGasPayerSignature).toString()
            );
            expect(json.signature).toBe(HexUInt.of(mockSignature).toString());
        });

        test('ok <- full legacy transaction to JSON', () => {
            const params = {
                beggar: mockBeggar,
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [new Clause(mockAddress, mockValue.bi)],
                dependsOn: mockDependsOn,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const transaction = new TransactionRequest(
                params,
                mockOriginSignature,
                mockGasPayerSignature,
                mockSignature
            );
            const json = transaction.toJSON();

            expect(json.beggar).toBe(mockBeggar.toString());
            expect(json.blockRef).toBe(mockBlockRef.toString());
            expect(json.chainTag).toBe(1);
            expect(json.clauses).toHaveLength(1);
            expect(json.dependsOn).toBe(mockDependsOn.toString());
            expect(json.expiration).toBe(mockExpiration);
            expect(json.gas).toBe(mockGas);
            expect(json.gasPriceCoef).toBe(mockGasPriceCoef);
            expect(json.nonce).toBe(HexUInt.of(mockNonce).toString());
            expect(json.maxFeePerGas).toBe(undefined);
            expect(json.maxPriorityFeePerGas).toBe(undefined);
            expect(json.originSignature).toBe(
                HexUInt.of(mockOriginSignature).toString()
            );
            expect(json.gasPayerSignature).toBe(
                HexUInt.of(mockGasPayerSignature).toString()
            );
            expect(json.signature).toBe(HexUInt.of(mockSignature).toString());
        });

        test('ok <- handle zero dynamic fees correctly', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: mockNonce,
                maxFeePerGas: 0n,
                maxPriorityFeePerGas: 0n
            };

            expect(() => new TransactionRequest(params)).toThrowError(
                InvalidTransactionField
            );
        });

        test('ok <- handle positive dynamic fees correctly', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                nonce: mockNonce,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas
            };

            const transaction = new TransactionRequest(params);
            const json = transaction.toJSON();

            expect(json.maxFeePerGas).toBe(mockMaxFeePerGas);
            expect(json.maxPriorityFeePerGas).toBe(mockMaxPriorityFeePerGas);
        });

        test('ok <- handle empty clauses array', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const transaction = new TransactionRequest(params);
            const json = transaction.toJSON();

            expect(json.clauses).toEqual([]);
        });

        test('ok <- handle multiple clauses', () => {
            const clause1 = new Clause(mockAddress, mockValue.bi);
            const clause2 = new Clause(mockBeggar, mockValue.bi * 2n);
            const params = {
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [clause1, clause2],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const transaction = new TransactionRequest(params);
            const json = transaction.toJSON();

            expect(json.clauses).toHaveLength(2);
            expect(json.clauses[0]).toEqual(clause1.toJSON());
            expect(json.clauses[1]).toEqual(clause2.toJSON());
        });
    });

    describe('edge cases', () => {
        test('ok <- handle transaction with all optional fields undefined', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const transaction = new TransactionRequest(params);

            expect(transaction.beggar).toBeUndefined();
            expect(transaction.dependsOn).toBeNull();
            expect(transaction.maxFeePerGas).toBeUndefined();
            expect(transaction.maxPriorityFeePerGas).toBeUndefined();
            expect(transaction.isDynamicFee).toBe(false);
            expect(transaction.isIntendedToBeSponsored).toBe(false);
            expect(transaction.isSigned).toBe(false);
        });

        test('ok <- handle very large gas values', () => {
            const largeGas = BigInt(Number.MAX_SAFE_INTEGER) * 2n;
            const params = {
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [],
                dependsOn: null,
                expiration: mockExpiration,
                gas: largeGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            };

            const transaction = new TransactionRequest(params);
            expect(transaction.gas).toBe(largeGas);
            expect(transaction.toJSON().gas).toBe(largeGas);
        });

        test('ok <- handle zero values correctly', () => {
            const params = {
                blockRef: mockBlockRef,
                chainTag: 0,
                clauses: [],
                dependsOn: null,
                expiration: 0,
                gas: 0n,
                gasPriceCoef: 0n,
                nonce: 0n
            };

            const transaction = new TransactionRequest(params);
            expect(transaction.chainTag).toBe(0);
            expect(transaction.expiration).toBe(0);
            expect(transaction.gas).toBe(0n);
            expect(transaction.gasPriceCoef).toBe(0n);
            expect(transaction.nonce).toBe(0n);
        });
    });
});
