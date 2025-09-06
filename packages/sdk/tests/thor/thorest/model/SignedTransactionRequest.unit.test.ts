import { beforeEach, describe, expect, test } from '@jest/globals';
import { Address, BlockRef, HexUInt } from '@common';
import { TransactionRequest } from '@thor/thorest/model/TransactionRequest';
import {
    Clause,
    SignedTransactionRequest,
    type SignedTransactionRequestParam
} from '@thor/thorest/model';

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

    describe('toJSON', () => {
        test('ok <- should convert SignedTransactionRequest to JSON with all properties including signatures', () => {
            const json = signedTxRequest.toJSON();

            // Verify all base TransactionRequest properties are included
            expect(json.blockRef).toBe(mockParams.blockRef.toString());
            expect(json.chainTag).toBe(mockParams.chainTag);
            expect(json.clauses).toEqual([]);
            expect(json.dependsOn).toBeNull();
            expect(json.expiration).toBe(mockParams.expiration);
            expect(json.gas).toBe(mockParams.gas);
            expect(json.gasPriceCoef).toBe(mockParams.gasPriceCoef);
            expect(json.nonce).toBe(mockParams.nonce);
            expect(json.isIntendedToBeSponsored).toBe(
                mockParams.isIntendedToBeSponsored
            );

            // Verify signed-specific properties
            expect(json.origin).toBe(mockParams.origin.toString());
            expect(json.originSignature).toBe('0x0102030405');
            expect(json.signature).toBe('0x060708090a');
        });

        test('ok <- should convert SignedTransactionRequest to JSON with clauses', () => {
            const clauseParams = {
                ...mockParams,
                clauses: [new Clause(mockOrigin, 1000n, null, null, null)]
            };
            const signedRequestWithClause = new SignedTransactionRequest(
                clauseParams
            );

            const json = signedRequestWithClause.toJSON();

            expect(json.clauses).toHaveLength(1);
            expect(json.clauses[0]).toEqual(clauseParams.clauses[0].toJSON());
        });

        test('ok <- should convert SignedTransactionRequest to JSON with dependsOn value', () => {
            const dependsOnValue = BlockRef.of(
                '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
            );
            const paramsWithDependsOn = {
                ...mockParams,
                dependsOn: dependsOnValue
            };
            const signedRequestWithDependsOn = new SignedTransactionRequest(
                paramsWithDependsOn
            );

            const json = signedRequestWithDependsOn.toJSON();

            expect(json.dependsOn).toBe(dependsOnValue.toString());
        });

        test('ok <- should convert SignedTransactionRequest to JSON with isIntendedToBeSponsored true', () => {
            const sponsoredParams = {
                ...mockParams,
                isIntendedToBeSponsored: true
            };
            const sponsoredSignedRequest = new SignedTransactionRequest(
                sponsoredParams
            );

            const json = sponsoredSignedRequest.toJSON();

            expect(json.isIntendedToBeSponsored).toBe(true);
        });

        test('ok <- should properly convert Uint8Array signatures to hex strings', () => {
            const largeOriginSignature = new Uint8Array([
                255, 254, 253, 252, 251, 0, 1, 2
            ]);
            const largeSignature = new Uint8Array([
                10, 20, 30, 40, 50, 60, 70, 80, 90, 100
            ]);

            const paramsWithLargeSignatures = {
                ...mockParams,
                originSignature: largeOriginSignature,
                signature: largeSignature
            };
            const signedRequestWithLargeSignatures =
                new SignedTransactionRequest(paramsWithLargeSignatures);

            const json = signedRequestWithLargeSignatures.toJSON();

            expect(json.originSignature).toEqual(
                HexUInt.of(largeOriginSignature).toString()
            );
            expect(json.signature).toEqual(
                HexUInt.of(largeSignature).toString()
            );
            expect(typeof json.originSignature).toBe('string');
            expect(typeof json.signature).toBe('string');
        });

        test('ok <- should handle empty signature arrays', () => {
            const emptySignatureParams = {
                ...mockParams,
                originSignature: new Uint8Array([]),
                signature: new Uint8Array([])
            };
            const signedRequestWithEmptySignatures =
                new SignedTransactionRequest(emptySignatureParams);

            const json = signedRequestWithEmptySignatures.toJSON();

            expect(json.originSignature).toBe('0x');
            expect(json.signature).toBe('0x');
        });

        test('ok <- should handle single byte signatures', () => {
            const singleByteParams = {
                ...mockParams,
                originSignature: new Uint8Array([42]),
                signature: new Uint8Array([123])
            };
            const signedRequestWithSingleByte = new SignedTransactionRequest(
                singleByteParams
            );

            const json = signedRequestWithSingleByte.toJSON();

            expect(json.originSignature).toBe('0x2a');
            expect(json.signature).toBe('0x7b');
        });

        test('ok <- should produce JSON that extends TransactionRequestJSON with signature properties', () => {
            const json = signedTxRequest.toJSON();

            // Verify all TransactionRequestJSON properties exist
            expect(json).toHaveProperty('blockRef');
            expect(json).toHaveProperty('chainTag');
            expect(json).toHaveProperty('clauses');
            expect(json).toHaveProperty('dependsOn');
            expect(json).toHaveProperty('expiration');
            expect(json).toHaveProperty('gas');
            expect(json).toHaveProperty('gasPriceCoef');
            expect(json).toHaveProperty('nonce');
            expect(json).toHaveProperty('isIntendedToBeSponsored');

            // Verify additional SignedTransactionRequestJSON properties exist
            expect(json).toHaveProperty('origin');
            expect(json).toHaveProperty('originSignature');
            expect(json).toHaveProperty('signature');

            // Verify types
            expect(typeof json.origin).toBe('string');
            expect(typeof json.originSignature).toBe('string');
            expect(typeof json.signature).toBe('string');

            // Verify hex format
            expect(json.origin.startsWith('0x')).toBe(true);
            expect(json.originSignature.startsWith('0x')).toBe(true);
            expect(json.signature.startsWith('0x')).toBe(true);
        });

        test('ok <- should handle defensive copy mutation protection in JSON conversion', () => {
            // Modify the original signature arrays after construction
            const originalOriginSignature = new Uint8Array(
                mockParams.originSignature
            );
            const originalSignature = new Uint8Array(mockParams.signature);

            mockParams.originSignature[0] = 255;
            mockParams.signature[0] = 255;

            const json = signedTxRequest.toJSON();

            // The JSON should reflect the original values, not the modified ones
            expect(json.originSignature).toBe('0x0102030405');
            expect(json.signature).toBe('0x060708090a');

            // Restore original values for other tests
            mockParams.originSignature.set(originalOriginSignature);
            mockParams.signature.set(originalSignature);
        });
    });
});
