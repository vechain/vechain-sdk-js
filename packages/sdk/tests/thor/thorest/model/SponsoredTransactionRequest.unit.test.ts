import { describe, expect } from '@jest/globals';
import { Address, BlockRef } from '@common';
import {
    SignedTransactionRequest,
    SponsoredTransactionRequest,
    type SponsoredTransactionRequestParam,
    TransactionRequest
} from '@thor/thorest/model'; /*

/*
 * @group unit/thor/thorest/model
 */
describe('SponsoredTransactionRequest', () => {
    const mockOrigin = Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed');
    const mockGasPayer = Address.of(
        '0x8932d83b7b8d80addcb281a71d54fc7b3364ffe1'
    );
    const mockOriginSignature = new Uint8Array([1, 2, 3, 4, 5]);
    const mockSignature = new Uint8Array([6, 7, 8, 9, 10]);
    const mockGasPayerSignature = new Uint8Array([11, 12, 13, 14, 15]);

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
        isIntendedToBeSponsored: true,

        // SignedTransactionRequest params
        origin: mockOrigin,
        originSignature: mockOriginSignature,
        signature: mockSignature,

        // SponsoredTransactionRequest params
        gasPayer: mockGasPayer,
        gasPayerSignature: mockGasPayerSignature
    } satisfies SponsoredTransactionRequestParam;

    let sponsoredTxRequest: SponsoredTransactionRequest;

    beforeEach(() => {
        sponsoredTxRequest = new SponsoredTransactionRequest(mockParams);
    });

    describe('constructor', () => {
        test('ok <- should be an instance of SponsoredTransactionRequest', () => {
            expect(sponsoredTxRequest).toBeInstanceOf(
                SponsoredTransactionRequest
            );
        });

        test('ok <- should inherit from SignedTransactionRequest', () => {
            expect(sponsoredTxRequest).toBeInstanceOf(SignedTransactionRequest);
        });

        test('ok <- should inherit from TransactionRequest', () => {
            expect(sponsoredTxRequest).toBeInstanceOf(TransactionRequest);
        });

        test('ok <- should initialize gasPayer property', () => {
            expect(sponsoredTxRequest.gasPayer).toBe(mockGasPayer);
        });

        test('ok <- should initialize gasPayerSignature property with a defensive copy', () => {
            expect(sponsoredTxRequest.gasPayerSignature).toEqual(
                mockGasPayerSignature
            );
            expect(sponsoredTxRequest.gasPayerSignature).not.toBe(
                mockGasPayerSignature
            );
        });

        test('ok <- should inherit isSponsored flag set to true', () => {
            expect(sponsoredTxRequest.isIntendedToBeSponsored).toBe(true);
        });

        test('ok <- should inherit origin property from SignedTransactionRequest', () => {
            expect(sponsoredTxRequest.origin).toBe(mockOrigin);
        });

        test('ok <- should inherit signature properties from SignedTransactionRequest', () => {
            expect(sponsoredTxRequest.originSignature).toEqual(
                mockOriginSignature
            );
            expect(sponsoredTxRequest.signature).toEqual(mockSignature);
        });

        test('ok <- should make defensive copies of Uint8Array properties', () => {
            // Create a new instance with the same parameters
            const newRequest = new SponsoredTransactionRequest(
                sponsoredTxRequest
            );

            // Modify the original arrays
            sponsoredTxRequest.gasPayerSignature[0] = 99;
            sponsoredTxRequest.originSignature[0] = 99;
            sponsoredTxRequest.signature[0] = 99;

            // Check that the instance's arrays are not affected
            expect(newRequest.gasPayerSignature[0]).not.toBe(
                sponsoredTxRequest.gasPayerSignature[0]
            );
            expect(newRequest.originSignature[0]).not.toBe(
                sponsoredTxRequest.originSignature[0]
            );
            expect(newRequest.signature[0]).not.toBe(
                sponsoredTxRequest.signature[0]
            );
        });
    });

    describe('isSigned', () => {
        test('isSigned method should return true', () => {
            expect(sponsoredTxRequest.isSigned()).toBe(true);
        });
    });
});
