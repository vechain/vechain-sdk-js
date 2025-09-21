import { expect, jest } from '@jest/globals';
import {
    Address,
    BlockRef,
    HexUInt,
    InvalidPrivateKeyError,
    UnsupportedOperationError
} from '@common';
import { Blake2b256 } from '@common/vcdm/hash/Blake2b256';
import { Secp256k1 } from '@common/cryptography/secp256k1';
import {
    Clause,
    OriginSignedTransactionRequest,
    SponsoredTransactionRequest,
    TransactionRequest
} from '@thor/thor-client/model/transactions';
import { PrivateKeySigner, RLPCodecTransactionRequest } from '@thor/signer';
import * as nc_utils from '@noble/curves/abstract/utils';

/**
 * @group unit/thor/thorest/signer
 */
describe('PrivateKeySigner', () => {
    // Test data
    const validPrivateKey = new Uint8Array(32).fill(1);
    const invalidPrivateKey = new Uint8Array(31).fill(1); // Wrong length
    const mockAddress = Address.of(
        '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'
    );
    const mockHash = new Uint8Array(32).fill(2);
    const mockSignature = new Uint8Array(65).fill(3);

    // Common transaction request parameters
    const transactionParams = {
        blockRef: BlockRef.of('0x1234567890abcdef'),
        chainTag: 1,
        clauses: [new Clause(mockAddress, 1000n, null, null, null)],
        dependsOn: null,
        expiration: 32,
        gas: 21000n,
        gasPriceCoef: 0n,
        nonce: 1
    };

    // Setup mocks
    beforeEach(() => {
        jest.spyOn(Secp256k1, 'isValidPrivateKey').mockImplementation(
            (key) => key.length === 32
        );

        jest.spyOn(Address, 'ofPrivateKey').mockReturnValue(mockAddress);

        jest.spyOn(Blake2b256, 'of').mockImplementation(() => {
            return HexUInt.of(mockHash) as Blake2b256;
        });

        jest.spyOn(Secp256k1, 'sign').mockReturnValue(mockSignature);

        jest.spyOn(RLPCodecTransactionRequest, 'encode').mockReturnValue(
            new Uint8Array(10).fill(4)
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('constructor', () => {
        test('ok <- create a new instance with valid private key', () => {
            const signer = new PrivateKeySigner(validPrivateKey);

            expect(signer).toBeInstanceOf(PrivateKeySigner);
            expect(signer.address).toBe(mockAddress);
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(Secp256k1.isValidPrivateKey).toHaveBeenCalledWith(
                validPrivateKey
            );
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(Address.ofPrivateKey).toHaveBeenCalledWith(validPrivateKey);
        });

        test('ok <- make a defensive copy of the private key', () => {
            const privateKey = new Uint8Array(32).fill(1);
            const signer = new PrivateKeySigner(privateKey);

            // Modify the original private key
            privateKey[0] = 99;

            // Sign to force using the private key
            const txRequest = new TransactionRequest({
                ...transactionParams,
                isIntendedToBeSponsored: false
            });

            signer.sign(txRequest);

            // Check if the correct (original) private key was used
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(Secp256k1.sign).toHaveBeenCalledWith(
                expect.any(Uint8Array),
                expect.not.arrayContaining([99]) // Should not contain the modified value
            );
        });

        test('err <- throw InvalidPrivateKeyError for invalid private key', () => {
            expect(() => new PrivateKeySigner(invalidPrivateKey)).toThrow(
                InvalidPrivateKeyError
            );
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(Secp256k1.isValidPrivateKey).toHaveBeenCalledWith(
                invalidPrivateKey
            );
        });
    });

    describe('dispose method', () => {
        test('ok <- clear the private key and set it to null', () => {
            const privateKey = new Uint8Array(32).fill(1);
            const signer = new PrivateKeySigner(privateKey);

            signer.dispose();

            // Attempt to sign to verify the private key is cleared
            const txRequest = new TransactionRequest(transactionParams);
            expect(() => signer.sign(txRequest)).toThrow(
                InvalidPrivateKeyError
            );
        });

        test('ok <- should be safe to call dispose multiple times', () => {
            const signer = new PrivateKeySigner(validPrivateKey);

            signer.dispose();
            signer.dispose(); // Second call should not throw

            expect(() => {
                signer.dispose();
            }).not.toThrow();
        });
    });

    describe('sign', () => {
        test('ok <- sign a not-sponsored unsigned transaction request', () => {
            const originSigner = new PrivateKeySigner(validPrivateKey);
            const txRequest = new TransactionRequest({
                ...transactionParams,
                isIntendedToBeSponsored: false
            });

            const signedTx = originSigner.sign(txRequest);

            expect(signedTx).toBeInstanceOf(OriginSignedTransactionRequest);
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(RLPCodecTransactionRequest.encode).toHaveBeenCalledWith(
                txRequest
            );
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(Blake2b256.of).toHaveBeenCalled();
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(Secp256k1.sign).toHaveBeenCalledWith(
                mockHash,
                expect.any(Uint8Array)
            );

            // Verify properties on the signed transaction
            expect(signedTx.origin).toBe(mockAddress);
            expect(signedTx.signature).toEqual(mockSignature);
            expect(signedTx.originSignature).toEqual(mockSignature);
            expect(signedTx.blockRef).toBe(txRequest.blockRef);
            expect(signedTx.chainTag).toBe(txRequest.chainTag);
            expect(signedTx.clauses).toBe(txRequest.clauses);
            expect(signedTx.isIntendedToBeSponsored).toBe(false);

            expect(signedTx.originSignature).toEqual(signedTx.signature);
        });

        test('ok <- sign a sponsored unsigned transaction request', () => {
            const originSigner = new PrivateKeySigner(validPrivateKey);
            const txRequest = new TransactionRequest({
                ...transactionParams,
                isIntendedToBeSponsored: true
            });

            const signedTx = originSigner.sign(txRequest);

            expect(signedTx).toBeInstanceOf(OriginSignedTransactionRequest);
            expect(signedTx.isIntendedToBeSponsored).toBe(true);

            expect(signedTx.originSignature).toEqual(signedTx.signature);
        });

        test('err <- throw error if private key is disposed before signing', () => {
            const originSigner = new PrivateKeySigner(validPrivateKey);
            const txRequest = new TransactionRequest(transactionParams);

            originSigner.dispose();

            expect(() => originSigner.sign(txRequest)).toThrow(
                InvalidPrivateKeyError
            );
        });

        test('ok <- sponsor a sponsored signed transaction request', () => {
            const originSigner = new PrivateKeySigner(
                new Uint8Array(32).fill(5)
            );
            const gasPayerSigner = new PrivateKeySigner(validPrivateKey);

            // Create a transaction request marked for sponsorship
            const txRequest = new TransactionRequest({
                ...transactionParams,
                isIntendedToBeSponsored: true
            });

            // Sign it with the origin gasPayerSigner
            const signedTx = originSigner.sign(txRequest);

            // Mock the concatenated hash
            jest.spyOn(nc_utils, 'concatBytes').mockImplementation(
                (a, b) => new Uint8Array([...a, ...b])
            );

            // Sponsor the transaction
            const sponsoredTx = gasPayerSigner.sign(
                signedTx
            ) as SponsoredTransactionRequest;

            expect(sponsoredTx).toBeInstanceOf(SponsoredTransactionRequest);
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(Blake2b256.of).toHaveBeenCalledTimes(3);
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(Secp256k1.sign).toHaveBeenCalledTimes(2);

            // Verify the sponsored transaction properties
            expect(sponsoredTx.gasPayer).toBe(mockAddress);
            expect(sponsoredTx.gasPayerSignature).toEqual(mockSignature);
            expect(sponsoredTx.origin).toBe(signedTx.origin);
            expect(sponsoredTx.originSignature).toEqual(
                signedTx.originSignature
            );
            expect(nc_utils.concatBytes).toHaveBeenCalledWith(
                signedTx.originSignature,
                mockSignature
            );

            expect(sponsoredTx.signature).toEqual(
                nc_utils.concatBytes(
                    signedTx.signature,
                    sponsoredTx.gasPayerSignature
                )
            );
        });

        test('err <- throw UnsupportedOperationError when sponsoring non-sponsored transaction', () => {
            const gasPayerSigner = new PrivateKeySigner(validPrivateKey);
            const originSigner = new PrivateKeySigner(
                new Uint8Array(32).fill(5)
            );

            // Create a regular transaction request not marked for sponsorship
            const txRequest = new TransactionRequest({
                ...transactionParams,
                isIntendedToBeSponsored: false
            });

            // Sign it with the origin gasPayerSigner
            const signedTx = originSigner.sign(txRequest);

            // Attempt to sponsor the transaction
            expect(() => gasPayerSigner.sign(signedTx)).toThrow(
                UnsupportedOperationError
            );
        });

        test('err <- throw InvalidPrivateKeyError if private key is voided before sponsoring', () => {
            const gasPayerSigner = new PrivateKeySigner(validPrivateKey);
            const originSigner = new PrivateKeySigner(
                new Uint8Array(32).fill(5)
            );

            // Create a transaction request marked for sponsorship
            const txRequest = new TransactionRequest({
                ...transactionParams,
                isIntendedToBeSponsored: true
            });

            // Sign it with the origin gasPayerSigner
            const signedTx = originSigner.sign(txRequest);

            // Void the gasPayerSigner's private key
            gasPayerSigner.dispose();

            // Attempt to sponsor the transaction
            expect(() => gasPayerSigner.sign(signedTx)).toThrow(
                InvalidPrivateKeyError
            );
        });
    });
});
