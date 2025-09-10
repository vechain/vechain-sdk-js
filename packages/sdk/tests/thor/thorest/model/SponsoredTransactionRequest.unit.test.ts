import { describe, expect } from '@jest/globals';
import { Address, BlockRef, HexUInt } from '@common';
import {
    Clause,
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

    describe('toJSON', () => {
        test('ok <- should convert SponsoredTransactionRequest to JSON with all properties including gas payer info', () => {
            const json = sponsoredTxRequest.toJSON();

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

            // Verify SignedTransactionRequest properties are included
            expect(json.origin).toBe(mockParams.origin.toString());
            expect(json.originSignature).toBe('0x0102030405');
            expect(json.signature).toBe('0x060708090a');

            // Verify SponsoredTransactionRequest specific properties
            expect(json.gasPayer).toBe(mockParams.gasPayer.toString());
            expect(json.gasPayerSignature).toBe('0x0b0c0d0e0f');
        });

        test('ok <- should convert SponsoredTransactionRequest to JSON with clauses', () => {
            const clauseParams = {
                ...mockParams,
                clauses: [new Clause(mockOrigin, 1000n, null, null, null)]
            };
            const sponsoredRequestWithClause = new SponsoredTransactionRequest(
                clauseParams
            );

            const json = sponsoredRequestWithClause.toJSON();

            expect(json.clauses).toHaveLength(1);
            expect(json.clauses[0]).toEqual(clauseParams.clauses[0].toJSON());
        });

        test('ok <- should convert SponsoredTransactionRequest to JSON with dependsOn value', () => {
            const dependsOnValue = BlockRef.of(
                '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
            );
            const paramsWithDependsOn = {
                ...mockParams,
                dependsOn: dependsOnValue
            };
            const sponsoredRequestWithDependsOn =
                new SponsoredTransactionRequest(paramsWithDependsOn);

            const json = sponsoredRequestWithDependsOn.toJSON();

            expect(json.dependsOn).toBe(dependsOnValue.toString());
        });

        test('ok <- should properly convert Uint8Array gas payer signature to hex string', () => {
            const largeGasPayerSignature = new Uint8Array([
                255, 254, 253, 252, 251, 250, 249, 248
            ]);

            const paramsWithLargeGasPayerSignature = {
                ...mockParams,
                gasPayerSignature: largeGasPayerSignature
            };
            const sponsoredRequestWithLargeGasPayerSignature =
                new SponsoredTransactionRequest(
                    paramsWithLargeGasPayerSignature
                );

            const json = sponsoredRequestWithLargeGasPayerSignature.toJSON();

            expect(json.gasPayerSignature).toEqual(
                HexUInt.of(largeGasPayerSignature).toString()
            );
            expect(typeof json.gasPayerSignature).toBe('string');
        });

        test('ok <- should handle empty gas payer signature array', () => {
            const emptyGasPayerSignatureParams = {
                ...mockParams,
                gasPayerSignature: new Uint8Array([])
            };
            const sponsoredRequestWithEmptyGasPayerSignature =
                new SponsoredTransactionRequest(emptyGasPayerSignatureParams);

            const json = sponsoredRequestWithEmptyGasPayerSignature.toJSON();

            expect(json.gasPayerSignature).toBe('0x');
        });

        test('ok <- should handle single byte gas payer signature', () => {
            const singleByteGasPayerSignatureParams = {
                ...mockParams,
                gasPayerSignature: new Uint8Array([200])
            };
            const sponsoredRequestWithSingleByteGasPayerSignature =
                new SponsoredTransactionRequest(
                    singleByteGasPayerSignatureParams
                );

            const json =
                sponsoredRequestWithSingleByteGasPayerSignature.toJSON();

            expect(json.gasPayerSignature).toBe('0xc8');
        });

        test('ok <- should handle all signature arrays with different values', () => {
            const differentSignaturesParams = {
                ...mockParams,
                originSignature: new Uint8Array([10, 20, 30]),
                signature: new Uint8Array([40, 50, 60]),
                gasPayerSignature: new Uint8Array([70, 80, 90])
            };
            const sponsoredRequestWithDifferentSignatures =
                new SponsoredTransactionRequest(differentSignaturesParams);

            const json = sponsoredRequestWithDifferentSignatures.toJSON();

            expect(json.originSignature).toBe('0x0a141e');
            expect(json.signature).toBe('0x28323c');
            expect(json.gasPayerSignature).toBe('0x46505a');
        });

        test('ok <- should produce JSON that extends SignedTransactionRequestJSON with gas payer properties', () => {
            const json = sponsoredTxRequest.toJSON();

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

            // Verify SignedTransactionRequestJSON properties exist
            expect(json).toHaveProperty('origin');
            expect(json).toHaveProperty('originSignature');
            expect(json).toHaveProperty('signature');

            // Verify additional SponsoredTransactionRequestJSON properties exist
            expect(json).toHaveProperty('gasPayer');
            expect(json).toHaveProperty('gasPayerSignature');

            // Verify types for gas payer properties
            expect(typeof json.gasPayer).toBe('string');
            expect(typeof json.gasPayerSignature).toBe('string');

            // Verify hex format for gas payer properties
            expect(json.gasPayer.startsWith('0x')).toBe(true);
            expect(json.gasPayerSignature.startsWith('0x')).toBe(true);
        });

        test('ok <- should handle defensive copy mutation protection in JSON conversion', () => {
            // Modify the original signature arrays after construction
            const originalGasPayerSignature = new Uint8Array(
                mockParams.gasPayerSignature
            );

            mockParams.gasPayerSignature[0] = 255;

            const json = sponsoredTxRequest.toJSON();

            // The JSON should reflect the original values, not the modified ones
            expect(json.gasPayerSignature).toBe('0x0b0c0d0e0f');

            // Restore original values for other tests
            mockParams.gasPayerSignature.set(originalGasPayerSignature);
        });

        test('ok <- should maintain consistency with different gas payer addresses', () => {
            const differentGasPayerParams = {
                ...mockParams,
                gasPayer: Address.of(
                    '0x1234567890123456789012345678901234567890'
                )
            };
            const sponsoredRequestWithDifferentGasPayer =
                new SponsoredTransactionRequest(differentGasPayerParams);

            const json = sponsoredRequestWithDifferentGasPayer.toJSON();

            expect(json.gasPayer).toBe(
                '0x1234567890123456789012345678901234567890'
            );
            expect(json.origin).toBe(mockParams.origin.toString());
            expect(json.gasPayer).not.toBe(json.origin);
        });

        test('ok <- should handle sponsored transaction with isIntendedToBeSponsored true', () => {
            // This should always be true for sponsored transactions
            expect(sponsoredTxRequest.isIntendedToBeSponsored).toBe(true);

            const json = sponsoredTxRequest.toJSON();

            expect(json.isIntendedToBeSponsored).toBe(true);
        });
    });
});
