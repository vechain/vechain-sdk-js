import { describe, expect, test } from '@jest/globals';
import {
    Address,
    HexUInt,
    InvalidPrivateKeyError,
    InvalidSignatureError,
    Secp256k1
} from '@common';
import { PrivateKeySigner } from '@thor';
import { Clause, TransactionRequest } from '@thor/thor-client';
import { type ThorSoloAccount } from '@vechain/sdk-solo-setup';

/**
 * @group unit/thor/signer
 */
describe('PrivateKeySigner UNIT test', () => {
    const mockSenderAccount = {
        privateKey:
            '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
        address: '0x3db469a79593dcc67f07DE1869d6682fC1eaf535'
    } satisfies ThorSoloAccount;
    const mockReceiverAccount = {
        privateKey:
            '62183dac319418f40e47dec7b60f104d0d6a9e248860b005e8b6d36cf9e8f11a',
        address: '0x9E4E0efb170070e35A6b76b683aEE91dd77805B3'
    } satisfies ThorSoloAccount;

    const mockBlockRef = HexUInt.of('0x000000b7b1994856');
    const mockChainTag = 246;
    const mockExpiration = 32;
    const mockGas = 25000n;
    const mockGasPriceCoef = 128n; // 123n
    const mockMaxFeePerGas = 10027000000000n; // 20 Gwei
    const mockMaxPriorityFeePerGas = 27000000000n; // 5 Gwei
    const mockNonce = 3n;
    const mockValue = 10n ** 15n; // .001 VET

    describe('constructor', () => {
        test('ok <- create instance with valid private key', () => {
            const privateKeyBytes = HexUInt.of(
                mockSenderAccount.privateKey
            ).bytes;
            const signer = new PrivateKeySigner(privateKeyBytes);

            // Should create the instance successfully
            expect(signer).toBeInstanceOf(PrivateKeySigner);
            expect(signer.address).toBeInstanceOf(Address);
            expect(signer.address.toString()).toBe(mockSenderAccount.address);
        });

        test('ok <- make defensive copy of private key', () => {
            const originalPrivateKey = HexUInt.of(
                mockSenderAccount.privateKey
            ).bytes;
            const privateKeyCopy = new Uint8Array(originalPrivateKey);

            // Create signer with the copy
            const signer = new PrivateKeySigner(privateKeyCopy);

            // Modify the original array after construction
            privateKeyCopy.fill(0);

            // Signer should still be functional (proving it made a defensive copy)
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });

            // Should still be able to sign (proving internal copy wasn't affected)
            expect(() => signer.sign(txRequest)).not.toThrow();
            const signedTx = signer.sign(txRequest);
            expect(signedTx.isSigned).toBe(true);
        });

        test('err <- throw InvalidPrivateKeyError for invalid private key - zero key', () => {
            // All zeros private key is invalid
            const invalidPrivateKey = new Uint8Array(32).fill(0);

            expect(() => {
                // eslint-disable-next-line sonarjs/constructor-for-side-effects,no-new
                new PrivateKeySigner(invalidPrivateKey);
            }).toThrow(InvalidPrivateKeyError);
        });

        test('err <- throw InvalidPrivateKeyError for invalid private key - wrong length', () => {
            // Private key with wrong length
            const shortPrivateKey = new Uint8Array(31).fill(1);
            const longPrivateKey = new Uint8Array(33).fill(1);

            expect(() => {
                // eslint-disable-next-line sonarjs/constructor-for-side-effects,no-new
                new PrivateKeySigner(shortPrivateKey);
            }).toThrow(InvalidPrivateKeyError);

            expect(() => {
                // eslint-disable-next-line sonarjs/constructor-for-side-effects,no-new
                new PrivateKeySigner(longPrivateKey);
            }).toThrow(InvalidPrivateKeyError);
        });

        test('err <- throw InvalidPrivateKeyError for invalid private key - exceeds curve order', () => {
            // Private key that exceeds secp256k1 curve order
            const invalidPrivateKey = new Uint8Array(32).fill(0xff);

            expect(() => {
                // eslint-disable-next-line sonarjs/constructor-for-side-effects,no-new
                new PrivateKeySigner(invalidPrivateKey);
            }).toThrow(InvalidPrivateKeyError);
        });
    });

    describe('dispose', () => {
        test('err <- sign throws after disponse call ', () => {
            // Create a valid private key
            const privateKeyBytes = HexUInt.of(
                mockSenderAccount.privateKey
            ).bytes;
            const signer = new PrivateKeySigner(privateKeyBytes);

            // Verify signer is functional before disposal
            expect(signer.address.toString()).toBe(mockSenderAccount.address);

            // Create a simple transaction request to test signing before disposal
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });

            // Should be able to sign before disposal
            const signedTx = signer.sign(txRequest);
            expect(signedTx.isSigned).toBe(true);

            // Dispose the signer
            signer.dispose();

            // After disposal, signing should fail with InvalidPrivateKeyError
            expect(() => {
                signer.sign(txRequest);
            }).toThrow('signing failed');
        });
    });

    describe('sign', () => {
        test('ok <- dynamic fee - no sponsored', () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            });
            expect(txRequest.isSigned).toBe(false);
            // Sign as Sender. Finalized signature.
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSigner.sign(txRequest);
            expect(txRequestSaS.isSigned).toBe(true);
            expect(txRequestSaS.signature).toStrictEqual(
                txRequestSaS.signature
            );
        });

        test('ok <- dynamic fee - signed then sponsored', () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            });
            expect(txRequest.isSigned).toBe(false);
            expect(txRequest.isSigned).toBe(false);
            // Sign as Sender. Partial signature.
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSigner.sign(txRequest);
            expect(txRequestSaS.signature?.length).toBe(
                Secp256k1.SIGNATURE_LENGTH
            );
            expect(txRequestSaS.isSigned).toBe(false);
            // Sign as Gas Payer. Finalized signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestSaGP = gasPayerSigner.sign(
                txRequestSaS,
                Address.of(mockSenderAccount.address)
            );
            expect(txRequestSaGP.signature?.length).toBe(
                Secp256k1.SIGNATURE_LENGTH * 2
            );
            expect(txRequestSaGP.isSigned).toBe(true);
        });

        test('ok <- dynamic fee - sponsored than signed', () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            });
            // Sign as Gas Payer. Partial signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestSaGP = gasPayerSigner.sign(
                txRequest,
                Address.of(mockSenderAccount.address)
            );
            expect(txRequestSaGP.signature?.length).toBe(
                Secp256k1.SIGNATURE_LENGTH
            );
            expect(txRequestSaGP.isSigned).toBe(false);
            // Sign as Sender
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSigner.sign(txRequestSaGP);
            // expect only origin signature to remain
            expect(txRequestSaS.signature?.length).toBe(
                Secp256k1.SIGNATURE_LENGTH
            );
            expect(txRequestSaS.isSigned).toBe(false);
        });

        test('ok <- dynamic fee - x-flow aka ghostbuster test', () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            });

            // Sign as Gas Payer. Partial signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const originSignedTxRequest = originSigner.sign(
                gasPayerSigner.sign(txRequest)
            );
            const fullySignedTxRequest = gasPayerSigner.sign(
                originSigner.sign(txRequest),
                Address.of(mockSenderAccount.address)
            );
            // check signature lengths
            expect(originSignedTxRequest.signature?.length).toBe(
                Secp256k1.SIGNATURE_LENGTH
            );
            expect(fullySignedTxRequest.signature?.length).toBe(
                Secp256k1.SIGNATURE_LENGTH * 2
            );
        });

        test('ok <- legacy - no sponsored', () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });
            expect(txRequest.isSigned).toBe(false);
            // Sign as Sender. Finalized signature.
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSigner.sign(txRequest);
            expect(txRequestSaS.isSigned).toBe(true);
            expect(txRequestSaS.signature).toStrictEqual(
                txRequestSaS.signature
            );
        });

        test('ok <- legacy - signed then sponsored', () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            });
            expect(txRequest.isSigned).toBe(false);
            // Sign as Sender. Partial signature.
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSigner.sign(txRequest);
            expect(txRequestSaS.signature?.length).toBe(
                Secp256k1.SIGNATURE_LENGTH
            );
            expect(txRequestSaS.isSigned).toBe(false);
            // Sign as Gas Payer. Finalized signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestSaGP = gasPayerSigner.sign(
                txRequestSaS,
                Address.of(mockSenderAccount.address)
            );
            expect(txRequestSaGP.signature?.length).toBe(
                Secp256k1.SIGNATURE_LENGTH * 2
            );
            expect(txRequestSaGP.isSigned).toBe(true);
        });

        test('ok <- legacy - sponsored then signed', () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            });
            expect(txRequest.isSigned).toBe(false);
            // Sign as Gas Payer. Partial signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestSaGP = gasPayerSigner.sign(
                txRequest,
                Address.of(mockSenderAccount.address)
            );
            expect(txRequestSaGP.signature?.length).toBe(
                Secp256k1.SIGNATURE_LENGTH
            );
            expect(txRequestSaGP.isSigned).toBe(false);
            // Sign as Sender
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSigner.sign(txRequestSaGP);
            // expect only origin signature to remain
            expect(txRequestSaS.signature?.length).toBe(
                Secp256k1.SIGNATURE_LENGTH
            );
            expect(txRequestSaS.isSigned).toBe(false);
        });

        test('ok <- legacy - x-flow aka ghostbuster test', () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            });
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const originSignedTxRequest = originSigner.sign(
                gasPayerSigner.sign(txRequest)
            );
            const fullySignedTxRequest = gasPayerSigner.sign(
                originSigner.sign(txRequest),
                Address.of(mockSenderAccount.address)
            );
            // check signature lengths
            expect(originSignedTxRequest.signature?.length).toBe(
                Secp256k1.SIGNATURE_LENGTH
            );
            expect(fullySignedTxRequest.signature?.length).toBe(
                Secp256k1.SIGNATURE_LENGTH * 2
            );
        });

        test('err <- sign as origin - throws when private key is null', () => {
            // Create a valid signer first
            const signer = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );

            // Create a transaction request
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce
            });

            // Dispose the signer to set private key to null
            signer.dispose();

            // Try to call signAsOrigin - need to access the private method
            expect(() => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                (signer as unknown).signAsOrigin(txRequest);
            }).toThrow(InvalidPrivateKeyError);

            // Verify the specific error message
            try {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                (signer as unknown).signAsOrigin(txRequest);
            } catch (error) {
                expect(error).toBeInstanceOf(InvalidPrivateKeyError);
            }
        });

        test('err <- sign as gas payer - throws when private key is null', () => {
            // Create a valid signer first
            const signer = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );

            // Create a sponsored transaction request
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(mockReceiverAccount.address),
                        mockValue
                    )
                ],
                dependsOn: null,
                expiration: mockExpiration,
                gas: mockGas,
                gasPriceCoef: mockGasPriceCoef,
                nonce: mockNonce,
                reserved: {
                    features: 1,
                    unused: []
                }
            });

            // Dispose the signer to set private key to null
            signer.dispose();

            // Try to call sign - need to access the private method
            expect(() => {
                signer.sign(txRequest);
            }).toThrow(InvalidSignatureError);

            // verify the caused error
            try {
                signer.sign(txRequest);
            } catch (error) {
                expect(error).toBeInstanceOf(InvalidSignatureError);
                const innerError = (error as InvalidSignatureError).cause;
                expect(innerError).toBeInstanceOf(InvalidPrivateKeyError);
            }
        });
    });
});
