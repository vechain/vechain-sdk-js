import { Clause, TransactionRequest } from '@thor/thorest';
import { type Address, BlockRef, HexUInt, Quantity } from '@common/vcdm';
import { SOLO_NETWORK } from '@thor/utils';
import { TEST_ACCOUNTS } from '../../fixture';
import { privateKeyToAccount } from 'viem/accounts';
import { expect } from '@jest/globals';
import {
    createWalletClient,
    type PrepareTransactionRequestRequest
} from '@viem/clients';
import { mockHttpClient } from '../../MockHttpClient';
import { PrivateKeySigner, RLPCodec } from '@thor/thorest/signer';

const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

const MOCK_URL = new URL('https://mock-url');

/**
 * @group unit/clients
 */
describe('WalletClient UNIT tests', () => {
    const mockBlockRef = BlockRef.of('0x1234567890abcdef');
    const mockGas = 21000n;
    const mockValue = Quantity.of(1000);

    const mockOriginSigner = new PrivateKeySigner(
        HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
    );

    const mockGasPayerSigner = new PrivateKeySigner(
        HexUInt.of(TRANSACTION_RECEIVER.privateKey).bytes
    );

    describe('prepareTransactionRequest', () => {
        test('ok <- thor and viem equivalence', () => {
            const expected = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: SOLO_NETWORK.chainTag,
                clauses: [
                    Clause.of({
                        to: TRANSACTION_RECEIVER.address,
                        value: mockValue.toString()
                    })
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
    });

    describe('signTransaction', () => {
        test('ok <- sign a not-sponsored unsigned transaction request', async () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: SOLO_NETWORK.chainTag,
                clauses: [
                    Clause.of({
                        to: TRANSACTION_RECEIVER.address,
                        value: mockValue.toString()
                    })
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
            const actual = RLPCodec.decode(encoded.bytes);
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- sign a sponsored unsigned transaction request', async () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [
                    Clause.of({
                        to: TRANSACTION_RECEIVER.address,
                        value: mockValue.toString()
                    })
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
            const actual = RLPCodec.decode(
                (await originWallet.signTransaction(txRequest)).bytes
            );
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });

        test('ok <- sponsor a sponsored signed transaction request', async () => {
            const txRequest = new TransactionRequest({
                blockRef: mockBlockRef,
                chainTag: 1,
                clauses: [
                    Clause.of({
                        to: TRANSACTION_RECEIVER.address,
                        value: mockValue.toString()
                    })
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
            const signedTxRequest = RLPCodec.decode(
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
            const actual = RLPCodec.decode(
                (await gasPayerWallet.signTransaction(signedTxRequest)).bytes
            );
            expect(actual.toJSON()).toEqual(expected.toJSON());
        });
    });
});
