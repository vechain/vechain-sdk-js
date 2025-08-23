import { expect, jest } from '@jest/globals';
import {
    Clause,
    PrivateKeySigner,
    RLPCodec,
    SignedTransactionRequest,
    SponsoredTransactionRequest,
    TransactionRequest
} from '@thor';
import { Address, Blake2b256, BlockRef, HexUInt } from '@vcdm';
import { InvalidPrivateKeyError, UnsupportedOperationError } from '@errors';
import * as nc_utils from '@noble/curves/abstract/utils';
import { Secp256k1 } from '@secp256k1';
import { newTransactionFromTransactionRequest } from './RLPCodec.unit.test';

/**
 * @group unit/thor/signer
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

    const mockSender = {
        privateKey: HexUInt.of(
            'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5'
        ).bytes
    };

    const mockGasPayer = {
        privateKey: HexUInt.of(
            '432f38bcf338c374523e83fdb2ebe1030aba63c7f1e81f7d76c5f53f4d42e766'
        ).bytes
    };

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

        jest.spyOn(RLPCodec, 'encodeTransactionRequest').mockReturnValue(
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
                isSponsored: false
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

    describe('sign method with TransactionRequest', () => {
        test('ok <- sign a regular transaction request', () => {
            const signer = new PrivateKeySigner(validPrivateKey);
            const txRequest = new TransactionRequest({
                ...transactionParams,
                isSponsored: false
            });

            const signedTx = signer.sign(txRequest);

            expect(signedTx).toBeInstanceOf(SignedTransactionRequest);
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(RLPCodec.encodeTransactionRequest).toHaveBeenCalledWith(
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
            expect(signedTx.isSponsored).toBe(false);
        });

        test('ok <- signature clones the origin signature', () => {
            const txRequest = new TransactionRequest(transactionParams);
            const sender = new PrivateKeySigner(mockSender.privateKey);
            const signedTx = sender.sign(txRequest);
            expect(signedTx.originSignature).toEqual(signedTx.signature);

            // Temporary until Transaction exists.
            const expectedSignedTx = newTransactionFromTransactionRequest(
                txRequest
            ).sign(mockSender.privateKey);
            expect(signedTx.signature).toEqual(expectedSignedTx.signature);
        });

        test('ok <- sign a transaction request marked for sponsorship', () => {
            const signer = new PrivateKeySigner(validPrivateKey);
            const txRequest = new TransactionRequest({
                ...transactionParams,
                isSponsored: true
            });

            const signedTx = signer.sign(txRequest);

            expect(signedTx).toBeInstanceOf(SignedTransactionRequest);
            expect(signedTx.isSponsored).toBe(true);
        });

        test('err <- throw error if private key is voided before signing', () => {
            const signer = new PrivateKeySigner(validPrivateKey);
            const txRequest = new TransactionRequest(transactionParams);

            signer.void();

            expect(() => signer.sign(txRequest)).toThrow(
                InvalidPrivateKeyError
            );
        });
    });

    describe('sign method with SignedTransactionRequest (sponsoring)', () => {
        test('ok <- sponsor a signed transaction request', () => {
            const signer = new PrivateKeySigner(validPrivateKey);
            const originSigner = new PrivateKeySigner(
                new Uint8Array(32).fill(5)
            );

            // Create a transaction request marked for sponsorship
            const txRequest = new TransactionRequest({
                ...transactionParams,
                isSponsored: true
            });

            // Sign it with the origin signer
            const signedTx = originSigner.sign(txRequest);

            // Mock the concatenated hash
            jest.spyOn(nc_utils, 'concatBytes').mockImplementation(
                (a, b) => new Uint8Array([...a, ...b])
            );

            // Sponsor the transaction
            const sponsoredTx = signer.sign(
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
        });

        test('ok <- signature combines origin and gas payer signatures', () => {
            const txRequest = new TransactionRequest({
                ...transactionParams,
                isSponsored: true
            });
            const sender = new PrivateKeySigner(mockSender.privateKey);
            const signedTx = sender.sign(txRequest);
            const gasPayer: PrivateKeySigner = new PrivateKeySigner(
                mockGasPayer.privateKey
            );
            const sponsoredTx = gasPayer.sign(signedTx);
            expect(sponsoredTx.signature).toEqual(
                nc_utils.concatBytes(
                    signedTx.signature,
                    (sponsoredTx as SponsoredTransactionRequest)
                        .gasPayerSignature
                )
            );

            // Temporary until Transaction exists.
            const expectedSignedTx = newTransactionFromTransactionRequest(
                txRequest
            ).signAsSender(mockSender.privateKey);
            expect(sponsoredTx.originSignature).toEqual(
                expectedSignedTx.signature
            );
            const expectedSponsoredTx = expectedSignedTx.signAsGasPayer(
                sender.address,
                mockGasPayer.privateKey
            );
            expect(sponsoredTx.signature).toEqual(
                expectedSponsoredTx.signature
            );
        });

        test('err <- throw UnsupportedOperationError when sponsoring non-sponsored transaction', () => {
            const signer = new PrivateKeySigner(validPrivateKey);
            const originSigner = new PrivateKeySigner(
                new Uint8Array(32).fill(5)
            );

            // Create a regular transaction request not marked for sponsorship
            const txRequest = new TransactionRequest({
                ...transactionParams,
                isSponsored: false
            });

            // Sign it with the origin signer
            const signedTx = originSigner.sign(txRequest);

            // Attempt to sponsor the transaction
            expect(() => signer.sign(signedTx)).toThrow(
                UnsupportedOperationError
            );
        });

        test('err <- throw InvalidPrivateKeyError if private key is voided before sponsoring', () => {
            const signer = new PrivateKeySigner(validPrivateKey);
            const originSigner = new PrivateKeySigner(
                new Uint8Array(32).fill(5)
            );

            // Create a transaction request marked for sponsorship
            const txRequest = new TransactionRequest({
                ...transactionParams,
                isSponsored: true
            });

            // Sign it with the origin signer
            const signedTx = originSigner.sign(txRequest);

            // Void the signer's private key
            signer.void();

            // Attempt to sponsor the transaction
            expect(() => signer.sign(signedTx)).toThrow(InvalidPrivateKeyError);
        });
    });

    describe('void method', () => {
        test('ok <- clear the private key and set it to null', () => {
            const privateKey = new Uint8Array(32).fill(1);
            const signer = new PrivateKeySigner(privateKey);

            signer.void();

            // Attempt to sign to verify the private key is cleared
            const txRequest = new TransactionRequest(transactionParams);
            expect(() => signer.sign(txRequest)).toThrow(
                InvalidPrivateKeyError
            );
        });

        test('ok <- should be safe to call void multiple times', () => {
            const signer = new PrivateKeySigner(validPrivateKey);

            signer.void();
            signer.void(); // Second call should not throw

            expect(() => {
                signer.void();
            }).not.toThrow();
        });
    });
});
