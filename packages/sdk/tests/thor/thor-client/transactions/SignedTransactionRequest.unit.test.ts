import { describe, expect, test, beforeEach } from '@jest/globals';
import { Address, BlockRef } from '@common';
import { TransactionRequest } from '@thor/thor-client/model/transactions/TransactionRequest';
import {
    Clause,
    SignedTransactionRequest,
    type SignedTransactionRequestParam
} from '@thor/thor-client/model/transactions';

/*
 * @group unit/thor/thorest/model
 */
describe('SignedTransactionRequest', () => {
    // Mock data for testing
    const mockOrigin = Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed');
    const mockOriginSignature = new Uint8Array([1, 2, 3, 4, 5]);
    const mockSignature = new Uint8Array([6, 7, 8, 9, 10]);

    const mockParams = {
        // Base TransactionRequest params
        blockRef: BlockRef.of('0x1234567890abcdef'),
        chainTag: 1,
        clauses: [],
        dependsOn: null,
        expiration: 32,
        gas: 21000n,
        gasPriceCoef: 0n,
        nonce: 1,
        isIntendedToBeSponsored: false,

        // SignedTransactionRequest params
        origin: mockOrigin,
        originSignature: mockOriginSignature,
        signature: mockSignature
    } satisfies SignedTransactionRequestParam;

    let signedTxRequest: SignedTransactionRequest;

    beforeEach(() => {
        signedTxRequest = new SignedTransactionRequest(mockParams);
    });

    describe('constructor', () => {
        test('ok <- should create a new instance with the correct properties', () => {
            // Test that all properties were assigned correctly
            expect(signedTxRequest.blockRef).toEqual(mockParams.blockRef);
            expect(signedTxRequest.chainTag).toEqual(mockParams.chainTag);
            expect(signedTxRequest.clauses).toEqual(mockParams.clauses);
            expect(signedTxRequest.dependsOn).toEqual(mockParams.dependsOn);
            expect(signedTxRequest.expiration).toEqual(mockParams.expiration);
            expect(signedTxRequest.gas).toEqual(mockParams.gas);
            expect(signedTxRequest.gasPriceCoef).toEqual(
                mockParams.gasPriceCoef
            );
            expect(signedTxRequest.nonce).toEqual(mockParams.nonce);
            expect(signedTxRequest.isIntendedToBeSponsored).toEqual(
                mockParams.isIntendedToBeSponsored
            );
            expect(signedTxRequest.origin).toEqual(mockParams.origin);

            // Test that signature properties match (but are not the same reference)
            expect(Array.from(signedTxRequest.originSignature)).toEqual(
                Array.from(mockParams.originSignature)
            );
            expect(Array.from(signedTxRequest.signature)).toEqual(
                Array.from(mockParams.signature)
            );
        });

        test('ok <- should inherit from TransactionRequest', () => {
            expect(signedTxRequest).toBeInstanceOf(TransactionRequest);
        });

        test('ok <- should make defensive copies of Uint8Array properties', () => {
            // Create a new instance with the same parameters
            const newRequest = new SignedTransactionRequest(signedTxRequest);

            // Modify the original arrays
            signedTxRequest.originSignature[0] = 99;
            signedTxRequest.signature[0] = 99;

            // Check that the instance's arrays are not affected
            expect(newRequest.originSignature[0]).not.toBe(
                signedTxRequest.originSignature[0]
            );
            expect(newRequest.signature[0]).not.toBe(
                signedTxRequest.signature[0]
            );
        });
    });

    describe('isSigned', () => {
        test('ok <- should override isSigned() to return true', () => {
            expect(signedTxRequest.isSigned()).toBe(true);

            // Create a normal transaction request for comparison
            const txRequest = new TransactionRequest({
                blockRef: BlockRef.of(
                    '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e'
                ),
                chainTag: 1,
                clauses: [new Clause(mockOrigin, 1n, null, null, null)],
                dependsOn: null,
                expiration: 32,
                gas: 100000n,
                gasPriceCoef: 0n,
                nonce: 8
            });

            // Verify that the parent class method returns false
            expect(txRequest.isSigned()).toBe(false);
        });
    });
});
