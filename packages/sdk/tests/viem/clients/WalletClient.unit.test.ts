import {
    Clause,
    SignedTransactionRequest,
    TransactionRequest
} from '@thor/thor-client/model/transactions';
import { ThorError } from '@thor/thorest';
import { Address, BlockRef, Hex, HexUInt, Quantity } from '@common/vcdm';
import { TEST_ACCOUNTS } from '../../fixture';
import { privateKeyToAccount } from 'viem/accounts';
import { describe, expect, test } from '@jest/globals';
import {
    createWalletClient,
    type PrepareTransactionRequestRequest,
    WalletClient
} from '@viem/clients';
import { mockHttpClient } from '../../MockHttpClient';
import { PrivateKeySigner, RLPCodecTransactionRequest } from '@thor';
import { IllegalArgumentError, UnsupportedOperationError } from '@common';

const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

const MOCK_URL = new URL('https://mock-url');

/**
 * @group unit/clients
 */
describe('WalletClient UNIT tests', () => {
    const mockBlockRef = BlockRef.of('0x1234567890abcdef');
    const mockGas = 21000n;
    const mockValue = Quantity.of(1000);
    const mockChainTag = 0xf6;

    const mockOriginSigner = new PrivateKeySigner(
        HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
    );

    const mockGasPayerSigner = new PrivateKeySigner(
        HexUInt.of(TRANSACTION_RECEIVER.privateKey).bytes
    );

    describe('constructor', () => {
        test('ok <- create WalletClient with account', () => {
            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const walletClient = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                account
            );
            expect(walletClient).toBeInstanceOf(WalletClient);
            expect(walletClient.getAddresses()).toHaveLength(1);
        });

        test('ok <- create WalletClient without account', () => {
            const walletClient = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                null
            );
            expect(walletClient).toBeInstanceOf(WalletClient);
            expect(walletClient.getAddresses()).toHaveLength(0);
        });
    });

    describe('createWalletClient', () => {
        test('ok <- create WalletClient with provided transport', () => {
            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const transport = mockHttpClient({}, 'post');
            const walletClient = createWalletClient({
                network: MOCK_URL,
                transport,
                account
            });
            expect(walletClient).toBeInstanceOf(WalletClient);
        });

        test('ok <- create WalletClient with default transport', () => {
            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const walletClient = createWalletClient({
                network: MOCK_URL,
                account
            });
            expect(walletClient).toBeInstanceOf(WalletClient);
        });

        test('ok <- create WalletClient without account', () => {
            const walletClient = createWalletClient({
                network: MOCK_URL
            });
            expect(walletClient).toBeInstanceOf(WalletClient);
            expect(walletClient.getAddresses()).toHaveLength(0);
        });
    });

    describe('getAddresses', () => {
        test('ok <- return account address when account is set', () => {
            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const walletClient = createWalletClient({
                network: MOCK_URL,
                transport: mockHttpClient({}, 'post'),
                account
            });
            const addresses = walletClient.getAddresses();
            expect(addresses).toHaveLength(1);
            expect(addresses[0].toString().toLowerCase()).toBe(
                account.address.toLowerCase()
            );
        });

        test('ok <- return empty array when account is null', () => {
            const walletClient = createWalletClient({
                network: MOCK_URL,
                transport: mockHttpClient({}, 'post')
            });
            const addresses = walletClient.getAddresses();
            expect(addresses).toHaveLength(0);
        });
    });

    describe('prepareTransactionRequest', () => {
        test('ok <- test Viem PrepareTransactionRequestRequest and Thor TransactionRequest equivalence', () => {
            const expected = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue.bi
                    )
                ],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3
            });

            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const walletClient = createWalletClient({
                network: MOCK_URL,
                transport: mockHttpClient({}, 'post'),
                account
            });
            const request: PrepareTransactionRequestRequest = {
                to: expected.clauses[0].to as Address,
                value: HexUInt.of(expected.clauses[0].value),
                blockRef: expected.blockRef,
                chainTag: expected.chainTag,
                expiration: expected.expiration,
                gas: HexUInt.of(expected.gas),
                nonce: expected.nonce,
                gasPriceCoef: Number(expected.gasPriceCoef)
            } satisfies PrepareTransactionRequestRequest;
            const actual = walletClient.prepareTransactionRequest(request);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- prepare transaction request with numeric value', () => {
            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const walletClient = createWalletClient({
                network: MOCK_URL,
                transport: mockHttpClient({}, 'post'),
                account
            });

            const request: PrepareTransactionRequestRequest = {
                to: Address.of(TRANSACTION_RECEIVER.address),
                value: 1000,
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                expiration: 32,
                gas: 21000,
                nonce: 3,
                gasPriceCoef: 0
            };

            const result = walletClient.prepareTransactionRequest(request);
            expect(result).toBeInstanceOf(TransactionRequest);
            expect(result.clauses[0].value).toBe(1000n);
        });

        test('ok <- prepare transaction request with optional fields', () => {
            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const walletClient = createWalletClient({
                network: MOCK_URL,
                transport: mockHttpClient({}, 'post'),
                account
            });

            const dependsOn = Hex.of('0xabcdef1234567890');
            const data = Hex.of('0x1234');
            const comment = 'test comment';
            const abi = Hex.of('0x5678');

            const request: PrepareTransactionRequestRequest = {
                to: Address.of(TRANSACTION_RECEIVER.address),
                value: HexUInt.of(1000),
                data,
                comment,
                abi,
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                dependsOn,
                expiration: 32,
                gas: HexUInt.of(21000),
                nonce: 3,
                gasPriceCoef: 0,
                isIntendedToBeSponsored: true
            };

            const result = walletClient.prepareTransactionRequest(request);
            expect(result).toBeInstanceOf(TransactionRequest);
            expect(result.dependsOn).toEqual(dependsOn);
            expect(result.isIntendedToBeSponsored).toBe(true);
            expect(result.clauses[0].data).toEqual(HexUInt.of(data));
            expect(result.clauses[0].comment).toBe(comment);
        });

        test('err <- throw UnsupportedOperationError for invalid request', () => {
            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const walletClient = createWalletClient({
                network: MOCK_URL,
                transport: mockHttpClient({}, 'post'),
                account
            });

            // Create an invalid request that will cause an error during processing
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const invalidRequest = {
                value: 'invalid', // This should cause an error
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                expiration: 32,
                gas: 21000,
                nonce: 3,
                gasPriceCoef: 0
            } as unknown as PrepareTransactionRequestRequest;

            expect(() =>
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                walletClient.prepareTransactionRequest(invalidRequest)
            ).toThrow(UnsupportedOperationError);
        });

        test('ok <- handle transaction request with all optional fields as undefined', () => {
            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const walletClient = createWalletClient({
                network: MOCK_URL,
                transport: mockHttpClient({}, 'post'),
                account
            });

            const request: PrepareTransactionRequestRequest = {
                value: 1000,
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                expiration: 32,
                gas: 21000,
                nonce: 3,
                gasPriceCoef: 0
                // All optional fields are undefined
            };

            const result = walletClient.prepareTransactionRequest(request);
            expect(result).toBeInstanceOf(TransactionRequest);
            expect(result.clauses[0].to).toBeNull();
            expect(result.dependsOn).toBeNull();
            expect(result.isIntendedToBeSponsored).toBe(false);
        });
    });

    describe('sendTransaction', () => {
        test('ok <- send transaction from PrepareTransactionRequestRequest', async () => {
            const expected = {
                id: Hex.of(
                    '0x0000000000000000000000000000000000000000000000001234567890abcdef'
                )
            };
            const transport = mockHttpClient(expected, 'post');

            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const walletClient = createWalletClient({
                network: MOCK_URL,
                transport,
                account
            });

            const request: PrepareTransactionRequestRequest = {
                to: Address.of(TRANSACTION_RECEIVER.address),
                value: 1000,
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                expiration: 32,
                gas: 21000,
                nonce: 3,
                gasPriceCoef: 0
            };

            const actual = await walletClient.sendTransaction(request);
            expect(actual.toString()).toEqual(expected.id.toString());
        });

        test('ok <- send transaction from SignedTransactionRequest', async () => {
            const expected = {
                id: Hex.of(
                    '0x0000000000000000000000000000000000000000000000001234567890abcdef'
                )
            };
            const transport = mockHttpClient(expected, 'post');

            const gasPayerAccount = privateKeyToAccount(
                `0x${TRANSACTION_RECEIVER.privateKey}`
            );
            const gasPayerWallet = createWalletClient({
                network: MOCK_URL,
                transport,
                account: gasPayerAccount
            });

            // Create a signed transaction request that is intended to be sponsored
            const signedTxRequest = mockOriginSigner.sign(
                new TransactionRequest({
                    blockRef: mockBlockRef,
                    chainTag: 1,
                    clauses: [
                        new Clause(
                            Address.of(TRANSACTION_RECEIVER.address),
                            mockValue.bi
                        )
                    ],
                    dependsOn: null,
                    expiration: 32,
                    gas: mockGas,
                    gasPriceCoef: 0n,
                    nonce: 3,
                    isIntendedToBeSponsored: true
                })
            );

            const actual =
                await gasPayerWallet.sendTransaction(signedTxRequest);
            expect(actual.toString()).toEqual(expected.id.toString());
        });

        test('err <- throw UnsupportedOperationError when account is not set', async () => {
            const walletClient = createWalletClient({
                network: MOCK_URL,
                transport: mockHttpClient({}, 'post')
            });

            const request: PrepareTransactionRequestRequest = {
                to: Address.of(TRANSACTION_RECEIVER.address),
                value: 1000,
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                expiration: 32,
                gas: 21000,
                nonce: 3,
                gasPriceCoef: 0
            };

            await expect(walletClient.sendTransaction(request)).rejects.toThrow(
                UnsupportedOperationError
            );
        });
    });

    describe('sendRawTransaction', () => {
        test('ok <- send raw transaction successfully', async () => {
            const expected = {
                id: Hex.of(
                    '0x0000000000000000000000000000000000000000000000001234567890abcdef'
                )
            };
            const transport = mockHttpClient(expected, 'post');

            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const walletClient = createWalletClient({
                network: MOCK_URL,
                transport,
                account
            });

            const rawTx = Hex.of('0x1234567890abcdef');
            const actual = await walletClient.sendRawTransaction(rawTx);

            expect(actual.toString()).toEqual(expected.id.toString());
        });

        test('err <- throw ThorError when sending raw transaction fails', async () => {
            const transport = mockHttpClient(null, 'post'); // Mock error

            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const walletClient = createWalletClient({
                network: MOCK_URL,
                transport,
                account
            });

            const rawTx = Hex.of('0x1234567890abcdef');
            await expect(
                walletClient.sendRawTransaction(rawTx)
            ).rejects.toThrow(ThorError);
        });
    });

    describe('signTransaction', () => {
        test('ok <- sign a not-sponsored unsigned transaction request', async () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue.bi
                    )
                ],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3
            });
            const expected = mockOriginSigner.sign(txRequest);
            const originAccount = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const originWallet = createWalletClient({
                network: MOCK_URL,
                transport: mockHttpClient({}, 'post'),
                account: originAccount
            });
            const encoded = await originWallet.signTransaction(txRequest);
            const actual = RLPCodecTransactionRequest.decode(encoded.bytes);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- sign a sponsored unsigned transaction request', async () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue.bi
                    )
                ],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3,
                isIntendedToBeSponsored: true
            });
            const expected = mockOriginSigner.sign(txRequest);

            const originAccount = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const originWallet = createWalletClient({
                network: MOCK_URL,
                transport: mockHttpClient({}, 'post'),
                account: originAccount
            });
            const actual = RLPCodecTransactionRequest.decode(
                (await originWallet.signTransaction(txRequest)).bytes
            );
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- sponsor a sponsored signed transaction request', async () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue.bi
                    )
                ],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3,
                isIntendedToBeSponsored: true
            });
            const expected = mockGasPayerSigner.sign(
                mockOriginSigner.sign(txRequest)
            );

            const originAccount = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const originWallet = createWalletClient({
                network: MOCK_URL,
                transport: mockHttpClient({}, 'post'),
                account: originAccount
            });
            const signedTxRequest = RLPCodecTransactionRequest.decode(
                (await originWallet.signTransaction(txRequest)).bytes
            );

            const gasPayerAccount = privateKeyToAccount(
                `0x${TRANSACTION_RECEIVER.privateKey}`
            );
            const gasPayerWallet = createWalletClient({
                network: MOCK_URL,
                transport: mockHttpClient({}, 'post'),
                account: gasPayerAccount
            });
            const actual = RLPCodecTransactionRequest.decode(
                (await gasPayerWallet.signTransaction(signedTxRequest)).bytes
            );
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('err <- throw UnsupportedOperationError when account is null', async () => {
            const walletClient = createWalletClient({
                network: MOCK_URL,
                transport: mockHttpClient({}, 'post')
            });

            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue.bi
                    )
                ],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3
            });

            await expect(
                walletClient.signTransaction(txRequest)
            ).rejects.toThrow(UnsupportedOperationError);
        });

        test('err <- throw UnsupportedOperationError when account has not sign method', async () => {
            // Create a mock account without sign method
            const invalidAccount = {
                address: TRANSACTION_SENDER.address,
                type: 'local' as const
            };

            const walletClient = new WalletClient(
                MOCK_URL,
                mockHttpClient({}, 'post'),
                invalidAccount as unknown
            );

            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: mockChainTag,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue.bi
                    )
                ],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3
            });

            await expect(
                walletClient.signTransaction(txRequest)
            ).rejects.toThrow(UnsupportedOperationError);
        });

        test('err <- throw IllegalArgumentError when SignedTransactionRequest is not intended to be sponsored', async () => {
            const originAccount = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const originWallet = createWalletClient({
                network: MOCK_URL,
                transport: mockHttpClient({}, 'post'),
                account: originAccount
            });

            // Create a signed transaction request that is not intended to be sponsored
            const signedTxRequest = new SignedTransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [
                    new Clause(
                        Address.of(TRANSACTION_RECEIVER.address),
                        mockValue.bi
                    )
                ],
                dependsOn: null,
                expiration: 32,
                gas: mockGas,
                gasPriceCoef: 0n,
                nonce: 3,
                isIntendedToBeSponsored: false,
                origin: Address.of(TRANSACTION_SENDER.address),
                originSignature: new Uint8Array(65),
                signature: new Uint8Array(65)
            });

            await expect(
                originWallet.signTransaction(signedTxRequest)
            ).rejects.toThrow(IllegalArgumentError);
        });
    });
});
