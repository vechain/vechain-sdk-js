import { describe, expect, test } from '@jest/globals';
import type { ThorSoloAccount } from '@vechain/sdk-solo-setup';
import { Address, HexUInt } from '@common';
import { Clause, TransactionRequest } from '@thor/thor-client';
import { PrivateKeySigner, TransactionRequestRLPCodec } from '@thor';
import { privateKeyToAccount } from 'viem/accounts';
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
    const mockNonce = 3;
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
                gasPriceCoef: 0n, // Dynamic fee transactions use 0
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
                privateKeyToAccount(`0x${mockSenderAccount.privateKey}`)
            );
            const expected = TransactionRequestRLPCodec.encode(
                originSigner.sign(txRequest)
            );
            const actual = (await originWallet.signTransaction(txRequest))
                .bytes;
            expect(actual).toEqual(expected);
        });

        test('ok <- dynamic fee - signed then sponsored', async () => {
            const txRequest = new TransactionRequest({
                beggar: Address.of(mockSenderAccount.address),
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
                gasPriceCoef: 0n, // Dynamic fee transactions use 0
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
                privateKeyToAccount(`0x${mockSenderAccount.privateKey}`)
            );
            const encodedSaS = (
                await originWallet.signTransaction(txRequestSaS)
            ).bytes;
            expect(encodedSaS).toEqual(
                TransactionRequestRLPCodec.encode(txRequestSaS)
            );
            // Sign as Gas Payer. Finalized signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestSaGP = gasPayerSigner.sign(txRequestSaS);
            const gasPayerWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(`0x${mockReceiverAccount.privateKey}`)
            );
            const encodedSaGP = (
                await gasPayerWallet.signTransaction(
                    TransactionRequestRLPCodec.decode(encodedSaS)
                )
            ).bytes;
            expect(encodedSaGP).toEqual(
                TransactionRequestRLPCodec.encode(txRequestSaGP)
            );
        });

        test('ok <- dynamic fee - sponsored than signed', async () => {
            const txRequest = new TransactionRequest({
                beggar: Address.of(mockSenderAccount.address),
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
                gasPriceCoef: 0n, // Dynamic fee transactions use 0
                maxFeePerGas: mockMaxFeePerGas,
                maxPriorityFeePerGas: mockMaxPriorityFeePerGas,
                nonce: mockNonce
            });
            // Sign as gas payer. Partial signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestSaGP = gasPayerSigner.sign(txRequest);
            const gasPayerWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(`0x${mockReceiverAccount.privateKey}`)
            );
            const encodedSaGP = (
                await gasPayerWallet.signTransaction(txRequestSaGP)
            ).bytes;
            expect(encodedSaGP).toEqual(
                TransactionRequestRLPCodec.encode(txRequestSaGP)
            );
            // Sign as Sender. Finalized signature.
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSigner.sign(txRequestSaGP);
            const originWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(`0x${mockSenderAccount.privateKey}`)
            );
            const encodedSaS = (
                await originWallet.signTransaction(
                    TransactionRequestRLPCodec.decode(encodedSaGP)
                )
            ).bytes;
            expect(encodedSaS).toEqual(
                TransactionRequestRLPCodec.encode(txRequestSaS)
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
                privateKeyToAccount(`0x${mockSenderAccount.privateKey}`)
            );
            const expected = TransactionRequestRLPCodec.encode(
                originSigner.sign(txRequest)
            );
            const actual = (await originWallet.signTransaction(txRequest))
                .bytes;
            expect(actual).toEqual(expected);
        });

        test('ok <- legacy - signed then sponsored', async () => {
            const txRequest = new TransactionRequest({
                beggar: Address.of(mockSenderAccount.address),
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
            // Sign as Sender. Partial signature.
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSigner.sign(txRequest);
            const originWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(`0x${mockSenderAccount.privateKey}`)
            );
            const encodedSaS = (
                await originWallet.signTransaction(txRequestSaS)
            ).bytes;
            expect(encodedSaS).toEqual(
                TransactionRequestRLPCodec.encode(txRequestSaS)
            );
            // Sign as Gas Payer. Finalized signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestSaGP = gasPayerSigner.sign(txRequestSaS);
            const gasPayerWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(`0x${mockReceiverAccount.privateKey}`)
            );
            const encodedSaGP = (
                await gasPayerWallet.signTransaction(
                    TransactionRequestRLPCodec.decode(encodedSaS)
                )
            ).bytes;
            expect(encodedSaGP).toEqual(
                TransactionRequestRLPCodec.encode(txRequestSaGP)
            );
        });

        test('ok <- legacy - sponsored then signed', async () => {
            const txRequest = new TransactionRequest({
                beggar: Address.of(mockSenderAccount.address),
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
            // Sign as gas payer. Partial signature.
            const gasPayerSigner = new PrivateKeySigner(
                HexUInt.of(mockReceiverAccount.privateKey).bytes
            );
            const txRequestSaGP = gasPayerSigner.sign(txRequest);
            const gasPayerWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(`0x${mockReceiverAccount.privateKey}`)
            );
            const encodedSaGP = (
                await gasPayerWallet.signTransaction(txRequestSaGP)
            ).bytes;
            expect(encodedSaGP).toEqual(
                TransactionRequestRLPCodec.encode(txRequestSaGP)
            );
            // Sign as Sender. Finalized signature.
            const originSigner = new PrivateKeySigner(
                HexUInt.of(mockSenderAccount.privateKey).bytes
            );
            const txRequestSaS = originSigner.sign(txRequestSaGP);
            const originWallet = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                privateKeyToAccount(`0x${mockSenderAccount.privateKey}`)
            );
            const encodedSaS = (
                await originWallet.signTransaction(
                    TransactionRequestRLPCodec.decode(encodedSaGP)
                )
            ).bytes;
            expect(encodedSaS).toEqual(
                TransactionRequestRLPCodec.encode(txRequestSaS)
            );
        });
    });
});
