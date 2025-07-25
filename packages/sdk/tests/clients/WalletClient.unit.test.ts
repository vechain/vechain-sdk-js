import type { RegularBlockResponseJSON } from '@thor/blocks/json';
import { ClauseBuilder, Transaction, type TransactionBody } from '@thor';
import { Address, Hex, HexUInt } from '@vcdm';
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

/**
 * @group unit/clients
 */
describe('WalletClient UNIT tests', () => {
    describe('prepareTransactionRequest', () => {
        test('ok <- thor and viem equivalence', () => {
            const latestBlock = {
                number: 88,
                id: '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e',
                size: 364,
                parentID:
                    '0x000000577127e6426fbe5a303755ba64c167f173bb4e9b60156a62bced1551d8',
                timestamp: 1749224420,
                gasLimit: '150000000',
                beneficiary: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                gasUsed: '0',
                totalScore: 88,
                txsRoot:
                    '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                txsFeatures: 1,
                stateRoot:
                    '0xe030c534b66bd1c1b156ada9508bd639cdcbeb7ea1e932f4fd998857b3c4f30a',
                receiptsRoot:
                    '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                com: false,
                signer: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                isTrunk: true,
                isFinalized: false,
                baseFeePerGas: '0x9184e72a000',
                transactions: []
            } satisfies RegularBlockResponseJSON;
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
            const expected = Transaction.of(txBody);

            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const walletClient = createWalletClient({
                httpClient: mockHttpClient({}, 'post'),
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
            expect(actual.encoded).toEqual(expected.encoded);
        });
    });

    describe('signTransaction', () => {
        test('ok <- thor and viem equivalence', async () => {
            const latestBlock = {
                number: 88,
                id: '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e',
                size: 364,
                parentID:
                    '0x000000577127e6426fbe5a303755ba64c167f173bb4e9b60156a62bced1551d8',
                timestamp: 1749224420,
                gasLimit: '150000000',
                beneficiary: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                gasUsed: '0',
                totalScore: 88,
                txsRoot:
                    '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                txsFeatures: 1,
                stateRoot:
                    '0xe030c534b66bd1c1b156ada9508bd639cdcbeb7ea1e932f4fd998857b3c4f30a',
                receiptsRoot:
                    '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
                com: false,
                signer: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                isTrunk: true,
                isFinalized: false,
                baseFeePerGas: '0x9184e72a000',
                transactions: []
            } satisfies RegularBlockResponseJSON;
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
            const thorSigned = HexUInt.of(signedTx.encoded);
            console.log(thorSigned.toString());

            const account = privateKeyToAccount(
                `0x${TRANSACTION_SENDER.privateKey}`
            );
            const walletClient = createWalletClient({
                httpClient: mockHttpClient({}, 'post'),
                account
            });
            const tx = Transaction.of(txBody);
            const signedViem = await walletClient.signTransaction(tx);
            console.log(signedViem.toString());
            expect(signedViem.toString()).toEqual(thorSigned.toString());
        });
    });
});
