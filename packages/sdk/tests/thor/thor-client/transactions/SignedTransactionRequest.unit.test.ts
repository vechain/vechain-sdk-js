import {
    SignedTransactionRequest,
    TransactionRequest
} from '@thor/thor-client/model/transactions';
import { expect } from '@jest/globals';
import { Address, HexUInt } from '@common';

/*
 * @group unit/thor/thor-client/transactions
 */
describe('SignedTransactionRequest', () => {
    describe('constructor', () => {
        test('ok <- set the signature in the constructor', () => {
            const transactionRequest = new TransactionRequest(
                {
                    beggar: undefined,
                    blockRef: HexUInt.of('0x12345678'),
                    chainTag: 44,
                    clauses: [],
                    dependsOn: null,
                    expiration: 720,
                    gas: 100000n,
                    gasPriceCoef: 1n,
                    nonce: 12345
                },
                new Uint8Array([1, 2, 3])
            );
            const signature = new Uint8Array([10, 20, 30]);
            const signedTransactionRequest = new SignedTransactionRequest(
                transactionRequest,
                signature
            );

            expect(signedTransactionRequest.signature).toBeDefined();
            expect(signedTransactionRequest.signature).not.toBe(signature); // Defensive copy
            expect(signedTransactionRequest.signature).toEqual(signature);
        });

        test('ok <- verify signature is defensive copy in constructor', () => {
            const transactionRequest = new TransactionRequest(
                {
                    beggar: undefined,
                    blockRef: HexUInt.of('0x12345678'),
                    chainTag: 44,
                    clauses: [],
                    dependsOn: null,
                    expiration: 720,
                    gas: 100000n,
                    gasPriceCoef: 1n,
                    nonce: 12345
                },
                new Uint8Array([1, 2, 3])
            );

            const signature = new Uint8Array([10, 20, 30]);
            const signedTransactionRequest = new SignedTransactionRequest(
                transactionRequest,
                signature
            );

            signature[0] = 99; // Mutate the original array
            expect(signedTransactionRequest.signature[0]).toBe(10); // Defensive copy prevents changes
        });

        test('ok <- correctly inherit properties from TransactionRequest', () => {
            const transactionRequest = new TransactionRequest(
                {
                    beggar: Address.of('0x123'),
                    blockRef: HexUInt.of('0x12345678'),
                    chainTag: 44,
                    clauses: [],
                    dependsOn: null,
                    expiration: 720,
                    gas: 100000n,
                    gasPriceCoef: 1n,
                    nonce: 12345
                },
                new Uint8Array([1, 2, 3])
            );

            const signature = new Uint8Array([10, 20, 30]);
            const signedTransactionRequest = new SignedTransactionRequest(
                transactionRequest,
                signature
            );

            expect(signedTransactionRequest.beggar).toBe(
                transactionRequest.beggar
            );
            expect(signedTransactionRequest.blockRef).toBe(
                transactionRequest.blockRef
            );
            expect(signedTransactionRequest.chainTag).toBe(
                transactionRequest.chainTag
            );
            expect(signedTransactionRequest.expiration).toBe(
                transactionRequest.expiration
            );
        });
    });

    describe('toJSON', () => {
        test('ok <- convert to JSON with signature', () => {
            const transactionRequest = new TransactionRequest(
                {
                    beggar: undefined,
                    blockRef: HexUInt.of('0x12345678'),
                    chainTag: 44,
                    clauses: [],
                    dependsOn: null,
                    expiration: 720,
                    gas: 100000n,
                    gasPriceCoef: 1n,
                    nonce: 12345
                },
                new Uint8Array([1, 2, 3])
            );

            const signature = new Uint8Array([10, 20, 30]);
            const signedTransactionRequest = new SignedTransactionRequest(
                transactionRequest,
                signature
            );

            const json = signedTransactionRequest.toJSON();

            expect(json).toHaveProperty('signature');
            expect(json.signature).toBe(signature.toString());
        });
    });
});
