import {
    ClauseBuilder,
    RLPCodec,
    Transaction,
    type TransactionBody
} from '@thor';
import { Address, BlockRef, Hex, HexUInt } from '@vcdm';
import { SOLO_NETWORK } from '@utils';
import { TEST_ACCOUNTS } from '../fixture';
import { privateKeyToAccount } from 'viem/accounts';
import { expect } from '@jest/globals';
import {
    createWalletClient,
    type PrepareTransactionRequestRequest
} from '@clients';
import { mockHttpClient } from '../MockHttpClient';

const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

const MOCK_URL = new URL('https://mock-url');

/**
 * @group unit/clients
 */
describe('WalletClient UNIT tests', () => {
    describe('prepareTransactionRequest', () => {
        test('ok <- delegated - thor and viem equivalence', () => {
            const latestBlock = {
                id: '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e'
            };
            const transferClause = ClauseBuilder.transferVET(
                Address.of(TRANSACTION_RECEIVER.address),
                1n
            );
            const txBody: TransactionBody = {
                chainTag: SOLO_NETWORK.chainTag,
                blockRef: BlockRef.of(latestBlock.id).toString(),
                expiration: 32,
                clauses: [transferClause],
                gasPriceCoef: 0,
                gas: 100000,
                dependsOn: null,
                nonce: 8,
                reserved: {
                    features: 1,
                    unused: []
                }
            };
            const expected = Transaction.of(txBody);

            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const walletClient = createWalletClient({
                network: MOCK_URL,
                transport: mockHttpClient({}, 'post'),
                account
            });
            const request: PrepareTransactionRequestRequest = {
                to: Address.of(transferClause.to as string),
                value: Hex.of(transferClause.value),
                blockRef: Hex.of(txBody.blockRef),
                chainTag: txBody.chainTag,
                expiration: txBody.expiration,
                gas: txBody.gas as number,
                nonce: txBody.nonce,
                gasPriceCoef: 0
            } satisfies PrepareTransactionRequestRequest;
            const actual = walletClient.prepareTransactionRequest(
                request,
                true
            );
            expect(RLPCodec.encodeTransactionRequest(actual)).toEqual(
                expected.encoded
            );
        });

        test('ok <- not delegated - thor and viem equivalence', () => {
            const latestBlock = {
                id: '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e'
            };
            const transferClause = ClauseBuilder.transferVET(
                Address.of(TRANSACTION_RECEIVER.address),
                1n
            );
            const txBody: TransactionBody = {
                chainTag: SOLO_NETWORK.chainTag,
                blockRef: BlockRef.of(latestBlock.id).toString(),
                expiration: 32,
                clauses: [transferClause],
                gasPriceCoef: 0,
                gas: 100000,
                dependsOn: null,
                nonce: 8
            };
            const expected = Transaction.of(txBody);

            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const walletClient = createWalletClient({
                network: MOCK_URL,
                transport: mockHttpClient({}, 'post'),
                account
            });
            const request: PrepareTransactionRequestRequest = {
                to: Address.of(transferClause.to as string),
                value: Hex.of(transferClause.value),
                blockRef: Hex.of(txBody.blockRef),
                chainTag: txBody.chainTag,
                expiration: txBody.expiration,
                gas: txBody.gas as number,
                nonce: txBody.nonce,
                gasPriceCoef: 0
            } satisfies PrepareTransactionRequestRequest;
            const actual = walletClient.prepareTransactionRequest(request);
            expect(RLPCodec.encodeTransactionRequest(actual)).toEqual(
                expected.encoded
            );
        });
    });

    describe('signTransaction', () => {
        test('ok <- not delegated - thor and viem equivalence', async () => {
            const latestBlock = {
                id: '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e'
            };
            const transferClause = ClauseBuilder.transferVET(
                Address.of(TRANSACTION_RECEIVER.address),
                1n
            );
            const txBody: TransactionBody = {
                chainTag: SOLO_NETWORK.chainTag,
                blockRef: latestBlock.id.toString().slice(0, 18),
                expiration: 32,
                clauses: [transferClause],
                gasPriceCoef: 0,
                gas: 100000,
                dependsOn: null,
                nonce: 8
            };

            const signedTx = Transaction.of(txBody).sign(
                HexUInt.of(TRANSACTION_SENDER.privateKey).bytes
            );
            const signedThor = HexUInt.of(signedTx.encoded);
            console.log(signedThor.toString());

            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const walletClient = createWalletClient({
                network: MOCK_URL,
                transport: mockHttpClient({}, 'post'),
                account
            });
            const request: PrepareTransactionRequestRequest = {
                to: Address.of(transferClause.to as string),
                value: Hex.of(transferClause.value),
                blockRef: Hex.of(txBody.blockRef),
                chainTag: txBody.chainTag,
                expiration: txBody.expiration,
                gas: txBody.gas as number,
                nonce: txBody.nonce,
                gasPriceCoef: 0
            } satisfies PrepareTransactionRequestRequest;
            const signedViem = await walletClient.signTransaction(
                walletClient.prepareTransactionRequest(request)
            );
            console.log(signedViem.toString());
            expect(signedViem.toString()).toEqual(signedThor.toString());
        });
    });
});
