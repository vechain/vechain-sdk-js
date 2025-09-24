import {
    Clause,
    TransactionRequest
} from '@thor/thor-client/model/transactions';
import { Address, Hex } from '@common';
import { describe, expect } from '@jest/globals';

describe('TransactionRequest', () => {
    describe('constructor', () => {
        test('ok <- initialize required properties from params', () => {
            const clauses = [new Clause(null, 1000n, null, null, null)];
            const params = {
                blockRef: Hex.of('0x12345678'),
                chainTag: 42,
                clauses,
                dependsOn: null,
                expiration: 100,
                gas: 50000n,
                gasPriceCoef: 1n,
                nonce: 1234
            };

            const transactionRequest = new TransactionRequest(params);

            expect(transactionRequest.blockRef.toString()).toBe(
                params.blockRef.toString()
            );
            expect(transactionRequest.chainTag).toBe(params.chainTag);
            expect(transactionRequest.clauses).toEqual(params.clauses);
            expect(transactionRequest.dependsOn).toBeNull();
            expect(transactionRequest.expiration).toBe(params.expiration);
            expect(transactionRequest.gas).toBe(params.gas);
            expect(transactionRequest.gasPriceCoef).toBe(params.gasPriceCoef);
            expect(transactionRequest.nonce).toBe(params.nonce);
            expect(transactionRequest.isIntendedToBeSponsored).toBe(false);
        });

        test('ok <- initialize signatures with defensive copies', () => {
            const params = {
                blockRef: Hex.of('0x12345678'),
                chainTag: 42,
                clauses: [],
                dependsOn: null,
                expiration: 100,
                gas: 50000n,
                gasPriceCoef: 1n,
                nonce: 1234
            };

            const originSignature = new Uint8Array([1, 2, 3]);
            const gasPayerSignature = new Uint8Array([4, 5, 6]);

            const transactionRequest = new TransactionRequest(
                params,
                originSignature,
                gasPayerSignature
            );

            originSignature[0] = 99;
            gasPayerSignature[0] = 99;

            expect(transactionRequest.originSignature).toEqual(
                new Uint8Array([1, 2, 3])
            );
            expect(transactionRequest.gasPayerSignature).toEqual(
                new Uint8Array([4, 5, 6])
            );
        });
    });

    describe('isDynamicFee', () => {
        test('ok <- identify as dynamic fee transaction when maxFeePerGas or maxPriorityFeePerGas is set', () => {
            const params = {
                blockRef: Hex.of('0x12345678'),
                chainTag: 42,
                clauses: [],
                dependsOn: null,
                expiration: 100,
                gas: 50000n,
                gasPriceCoef: 1n,
                nonce: 1234
            };

            const dynamicFeeTransaction = new TransactionRequest({
                ...params,
                maxFeePerGas: 100n
            });
            const legacyTransaction = new TransactionRequest(params);

            expect(dynamicFeeTransaction.isDynamicFee).toBe(true);
            expect(legacyTransaction.isDynamicFee).toBe(false);
        });
    });

    describe('isIntendedToBeSponsored', () => {
        test('false <- transaction is not intended to be sponsored', () => {
            const params = {
                blockRef: Hex.of('0x12345678'),
                chainTag: 42,
                clauses: [],
                dependsOn: null,
                expiration: 100,
                gas: 50000n,
                gasPriceCoef: 1n,
                nonce: 1234
            };
            expect(new TransactionRequest(params).isIntendedToBeSponsored).toBe(
                false
            );
        });

        test('true <- transaction is intended to be sponsored', () => {
            const params = {
                beggar: Address.of('0x123'),
                blockRef: Hex.of('0x12345678'),
                chainTag: 42,
                clauses: [],
                dependsOn: null,
                expiration: 100,
                gas: 50000n,
                gasPriceCoef: 1n,
                nonce: 1234
            };
            expect(new TransactionRequest(params).isIntendedToBeSponsored).toBe(
                true
            );
        });
    });

    describe('isSigned', () => {
        test('ok <- determine if the not intended to be sponsored transaction is signed', () => {
            const originSignature = new Uint8Array([1, 2, 3]);

            const params = {
                blockRef: Hex.of('0x12345678'),
                chainTag: 42,
                clauses: [],
                dependsOn: null,
                expiration: 100,
                gas: 50000n,
                gasPriceCoef: 1n,
                nonce: 1234
            };

            const unsignedTransaction = new TransactionRequest(params);
            const signedTransaction = new TransactionRequest(
                params,
                originSignature
            );

            expect(unsignedTransaction.isSigned).toBe(false);
            expect(signedTransaction.isSigned).toBe(true);
        });

        test('ok <- determine if the intended to be sponsored transaction is signed', () => {
            const originSignature = new Uint8Array([1, 2, 3]);
            const gasPayerSignature = new Uint8Array([4, 5, 6]);

            const params = {
                beggar: Address.of('0x123'),
                blockRef: Hex.of('0x12345678'),
                chainTag: 42,
                clauses: [],
                dependsOn: null,
                expiration: 100,
                gas: 50000n,
                gasPriceCoef: 1n,
                nonce: 1234
            };

            const unsignedTransaction = new TransactionRequest(params);
            const gasPayerSignedTransaction = new TransactionRequest(
                params,
                undefined,
                gasPayerSignature
            );
            const originSignedTransaction = new TransactionRequest(
                params,
                originSignature
            );
            const signedTransaction = new TransactionRequest(
                params,
                originSignature,
                gasPayerSignature
            );

            expect(unsignedTransaction.isSigned).toBe(false);
            expect(gasPayerSignedTransaction.isSigned).toBe(false);
            expect(originSignedTransaction.isSigned).toBe(false);
            expect(signedTransaction.isSigned).toBe(true);
        });
    });

    describe('toJSON', () => {
        test('ok <- convert to JSON representation', () => {
            const clauses = [
                new Clause(
                    Address.of('0x123'),
                    1000n,
                    Hex.of('0xabcd'),
                    null,
                    null
                )
            ];
            const params = {
                blockRef: Hex.of('0x12345678'),
                chainTag: 42,
                clauses,
                dependsOn: null,
                expiration: 100,
                gas: 50000n,
                gasPriceCoef: 1n,
                nonce: 1234,
                isIntendedToBeSponsored: true,
                maxFeePerGas: 100n,
                maxPriorityFeePerGas: 50n
            };

            const originSignature = new Uint8Array([1, 2, 3]);
            const gasPayerSignature = new Uint8Array([4, 5, 6]);

            const transactionRequest = new TransactionRequest(
                params,
                originSignature,
                gasPayerSignature
            );

            const json = transactionRequest.toJSON();

            expect(json).toEqual({
                beggar: undefined,
                blockRef: '0x12345678',
                chainTag: 42,
                clauses: clauses.map((clause) => clause.toJSON()),
                dependsOn: null,
                expiration: 100,
                gas: 50000n,
                gasPayerSignature: '4,5,6',
                gasPriceCoef: 1n,
                maxFeePerGas: 100n,
                maxPriorityFeePerGas: 50n,
                nonce: 1234,
                originSignature: '1,2,3'
            });
        });
    });
});
