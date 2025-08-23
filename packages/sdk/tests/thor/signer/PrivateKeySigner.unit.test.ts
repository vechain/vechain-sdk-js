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

/**
 * @group unit/thor/signer
 */
describe('PrivateKeySigner', () => {
    // Test data
    const mockSender = {
        privateKey: HexUInt.of(
            'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5'
        ).bytes
    };
    const mockReceiver = {
        address: Address.of('0x9e7911de289c3c856ce7f421034f66b6cde49c39')
    };
    const mockGasPAyer = {
        privateKey: HexUInt.of(
            '432f38bcf338c374523e83fdb2ebe1030aba63c7f1e81f7d76c5f53f4d42e766'
        ).bytes
    };
    const invalidPrivateKey = new Uint8Array(31).fill(1); // Wrong length

    // Common transaction request parameters
    const transactionParams = {
        blockRef: BlockRef.of('0x1234567890abcdef'),
        chainTag: 1,
        clauses: [new Clause(mockReceiver.address, 1000n, null, null, null)],
        dependsOn: null,
        expiration: 32,
        gas: 21000n,
        gasPriceCoef: 0n,
        nonce: 1
    };

    describe('constructor', () => {
        test('ok <- should create a new instance with valid private key', () => {
            const signer = new PrivateKeySigner(mockSender.privateKey);
            const address = Address.ofPrivateKey(mockSender.privateKey);
            expect(signer).toBeInstanceOf(PrivateKeySigner);
            expect(signer.address).toBe(address);
        });

        test('ok <- should make a defensive copy of the private key', () => {
            const privateKey = new Uint8Array(mockSender.privateKey);
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
            expect(Secp256k1.sign).toHaveBeenCalledWith(
                expect.any(Uint8Array),
                expect.not.arrayContaining([99]) // Should not contain the modified value
            );
        });

        test('should throw InvalidPrivateKeyError for invalid private key', () => {
            expect(() => new PrivateKeySigner(invalidPrivateKey)).toThrow(
                InvalidPrivateKeyError
            );
            expect(Secp256k1.isValidPrivateKey).toHaveBeenCalledWith(
                invalidPrivateKey
            );
        });
    });

    describe('sign method with TransactionRequest', () => {
        test('should sign a regular transaction request', () => {
            const signer = new PrivateKeySigner(validPrivateKey);
            const txRequest = new TransactionRequest({
                ...transactionParams,
                isSponsored: false
            });

            const signedTx = signer.sign(txRequest);

            expect(signedTx).toBeInstanceOf(SignedTransactionRequest);
            expect(RLPCodec.encodeTransactionRequest).toHaveBeenCalledWith(
                txRequest
            );
            expect(Blake2b256.of).toHaveBeenCalled();
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

        test('should sign a transaction request marked for sponsorship', () => {
            const signer = new PrivateKeySigner(validPrivateKey);
            const txRequest = new TransactionRequest({
                ...transactionParams,
                isSponsored: true
            });

            const signedTx = signer.sign(txRequest);

            expect(signedTx).toBeInstanceOf(SignedTransactionRequest);
            expect(signedTx.isSponsored).toBe(true);
        });

        test('should throw error if private key is voided before signing', () => {
            const signer = new PrivateKeySigner(validPrivateKey);
            const txRequest = new TransactionRequest(transactionParams);

            signer.void();

            expect(() => signer.sign(txRequest)).toThrow(
                InvalidPrivateKeyError
            );
        });
    });

    describe('sign method with SignedTransactionRequest (sponsoring)', () => {
        test('should sponsor a signed transaction request', () => {
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
            expect(Blake2b256.of).toHaveBeenCalledTimes(2);
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

        test('should throw UnsupportedOperationError when sponsoring non-sponsored transaction', () => {
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

        test('should throw InvalidPrivateKeyError if private key is voided before sponsoring', () => {
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
        test('should clear the private key and set it to null', () => {
            const privateKey = new Uint8Array(32).fill(1);
            const signer = new PrivateKeySigner(privateKey);

            signer.void();

            // Attempt to sign to verify the private key is cleared
            const txRequest = new TransactionRequest(transactionParams);
            expect(() => signer.sign(txRequest)).toThrow(
                InvalidPrivateKeyError
            );
        });

        test('should be safe to call void multiple times', () => {
            const signer = new PrivateKeySigner(validPrivateKey);

            signer.void();
            signer.void(); // Second call should not throw

            expect(() => signer.void()).not.toThrow();
        });
    });
});
