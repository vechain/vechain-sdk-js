import { describe, expect, test } from '@jest/globals';
import type { ThorSoloAccount } from '@vechain/sdk-solo-setup';
import { Address, Hex, HexUInt } from '@common';
import { Clause, TransactionRequest } from '@thor/thor-client';
import { PrivateKeySigner } from '../../../src/thor/signer';
import { privateKeyToAccount } from '../../../src/viem/accounts';
import { WalletClient } from '@viem';
import { mockHttpClient } from '../../MockHttpClient';

const MOCK_URL = new URL('https://mock-url');

/**
 * @group unit/clients
 */
describe('WalletClient UNIT tests', () => {
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

    describe('signTransaction', () => {
        test('ok <- dynamic fee - no sponsored', async () => {
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
            // Sign as Sender. Finalized signature.
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const originWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(Hex.of(mockSenderAccount.privateKey))
            );
            const expected = originSigner.sign(txRequest).encoded;
            const actual = (await originWallet.signTransaction(txRequest))
                .bytes;
            expect(actual).toEqual(expected.bytes);
        });

        test('ok <- dynamic fee - signed then sponsored', async () => {
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
            // Sign as Sender. Partial signature.
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSigner.sign(txRequest);
            const originWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(Hex.of(mockSenderAccount.privateKey))
            );
            const encodedSaS = (await originWallet.signTransaction(txRequest))
                .bytes;
            expect(encodedSaS).toEqual(txRequestSaS.encoded.bytes);
            // Sign as Gas Payer. Finalized signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestSaGP = gasPayerSigner.sign(txRequestSaS);
            const gasPayerWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(Hex.of(mockReceiverAccount.privateKey))
            );
            const encodedSaGP = (
                await gasPayerWallet.signTransaction(
                    TransactionRequest.decode(HexUInt.of(encodedSaS))
                )
            ).bytes;
            expect(encodedSaGP).toEqual(txRequestSaGP.encoded.bytes);
        });

        test('ok <- dynamic fee - sponsored than signed', async () => {
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
            // Objective is to compare transaction signatures
            // signed by the thor private key signer and the viem wallet client
            // STEP 1: Sign the tx request as gas payer with thor private key signer
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestThorSigned = gasPayerSigner.sign(
                txRequest,
                Address.of(mockReceiverAccount.address)
            );
            // STEP 2: Sign as gas payer with viem wallet client
            const gasPayerViemWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(Hex.of(mockReceiverAccount.privateKey))
            );
            const txRequestViemSignedEncoded =
                await gasPayerViemWallet.signTransaction(
                    txRequest,
                    Address.of(mockReceiverAccount.address)
                );
            const txRequestViemSigned = TransactionRequest.decode(
                txRequestViemSignedEncoded
            );
            // compare signatures
            const txRequestThorSignedSignature =
                txRequestThorSigned.signature ?? new Uint8Array();
            const txRequestViemSignedSignature =
                txRequestViemSigned.signature ?? new Uint8Array();
            expect(txRequestThorSignedSignature).toStrictEqual(
                txRequestViemSignedSignature
            );

            // Now sign the tx request as sender with thor private key signer
            // and same with viem wallet client
            // compare the final signatures
            // STEP 1: Sign the tx request as sender with thor private key signer
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestThorFullySigned =
                originSigner.sign(txRequestThorSigned);
            const originWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(Hex.of(mockSenderAccount.privateKey))
            );
            const txRequestViemFullySignedEncoded =
                await originWallet.signTransaction(txRequestViemSigned);
            const txRequestViemFullySigned = TransactionRequest.decode(
                txRequestViemFullySignedEncoded
            );
            const txRequestThorFullySignedSignature =
                txRequestThorFullySigned.signature ?? new Uint8Array();
            const txRequestViemFullySignedSignature =
                txRequestViemFullySigned.signature ?? new Uint8Array();
            expect(txRequestThorFullySignedSignature).toStrictEqual(
                txRequestViemFullySignedSignature
            );
        });

        test('ok <- legacy - no sponsored', async () => {
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
            // Sign as Sender. Finalized signature.
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const originWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(Hex.of(mockSenderAccount.privateKey))
            );
            const expected = originSigner.sign(txRequest).encoded;
            const actual = await originWallet.signTransaction(txRequest);
            expect(actual).toStrictEqual(expected);
        });

        test('ok <- legacy - signed then sponsored', async () => {
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
            // Sign as Sender. Partial signature.
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSigner.sign(txRequest);
            const originWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(Hex.of(mockSenderAccount.privateKey))
            );
            const encodedSaS = (await originWallet.signTransaction(txRequest))
                .bytes;
            expect(encodedSaS).toEqual(txRequestSaS.encoded.bytes);
            // Sign as Gas Payer. Finalized signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestSaGP = gasPayerSigner.sign(
                txRequestSaS,
                Address.of(mockSenderAccount.address)
            );
            const gasPayerWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(Hex.of(mockReceiverAccount.privateKey))
            );
            const encodedSaGP = await gasPayerWallet.signTransaction(
                txRequestSaS,
                Address.of(mockSenderAccount.address)
            );
            
            expect(encodedSaGP.bytes).toStrictEqual(
                txRequestSaGP.encoded.bytes
            );
        });

        test('ok <- legacy - sponsored then signed', async () => {
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
            // Sign as gas payer. Partial signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestSaGP = gasPayerSigner.sign(txRequest);
            const gasPayerWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(Hex.of(mockReceiverAccount.privateKey))
            );
            const encodedSaGP = (
                await gasPayerWallet.signTransaction(txRequest)
            ).bytes;
            expect(encodedSaGP).toEqual(txRequestSaGP.encoded.bytes);
            // Sign as Sender. Finalized signature.
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSigner.sign(txRequestSaGP);
            const originWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(Hex.of(mockSenderAccount.privateKey))
            );
            const encodedSaS = (
                await originWallet.signTransaction(
                    TransactionRequest.decode(HexUInt.of(encodedSaGP))
                )
            ).bytes;
            expect(encodedSaS).toEqual(txRequestSaS.encoded.bytes);
        });

        test('ok <- no need to decode for gas payer signature', async () => {
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
            // Sign as Sender. Partial signature.
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSigner.sign(txRequest);
            const originWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(Hex.of(mockSenderAccount.privateKey))
            );
            const encodedSaS = (await originWallet.signTransaction(txRequest))
                .bytes;
            expect(encodedSaS).toEqual(txRequestSaS.encoded.bytes);
            // Sign as Gas Payer. Finalized signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestSaGP = gasPayerSigner.sign(txRequestSaS);
            const gasPayerWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(Hex.of(mockReceiverAccount.privateKey))
            );
            const encodedSaGP = (
                await gasPayerWallet.signTransaction(Hex.of(encodedSaS))
            ).bytes;
            expect(encodedSaGP).toEqual(txRequestSaGP.encoded.bytes);
        });
    });
});
