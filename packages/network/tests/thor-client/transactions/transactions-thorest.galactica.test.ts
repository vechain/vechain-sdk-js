import { beforeEach, describe, expect, test } from '@jest/globals';
import { SOLO_GENESIS_ACCOUNTS } from '../../fixture';
import { HexUInt, Transaction, Address, Secp256k1 } from '@vechain/sdk-core';
import { THOR_SOLO_URL, ThorClient } from '../../../src';

/**
 * ThorClient tests for Galactica dev network.
 *
 * @group galactica
 */
describe('ThorClient - Transactions Module', () => {
    // ThorClient instance
    let thorSoloClient: ThorClient;

    beforeEach(() => {
        thorSoloClient = ThorClient.at(THOR_SOLO_URL);
    });

    /**
     * sendTransaction tests
     */
    describe('sendTransaction', () => {
        test('Send Dynamic Fee Vet Transaction', async () => {
            // Vet transfer clause
            const clauses = [
                {
                    to: SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                        .address,
                    value: 1,
                    data: '0x'
                }
            ];

            // Get latest block
            const latestBlock =
                await thorSoloClient.blocks.getBestBlockCompressed();

            // Estimate the gas required for the transfer transaction
            const gasResult = await thorSoloClient.gas.estimateGas(
                clauses,
                SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            );

            // Create transactions
            const transactionBody = {
                chainTag: 0xf6, // 0xf6 for Galactica dev network
                blockRef:
                    latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
                expiration: 32,
                clauses,
                gas: gasResult.totalGas,
                maxFeePerGas: 10000000000000,
                maxPriorityFeePerGas: 1000000,
                dependsOn: null,
                nonce: 12345677
            };

            // create transaction
            const unsignedTx = Transaction.of(transactionBody);
            expect(unsignedTx.transactionType).toBe('eip1559');

            // get signeded tx
            const signedTx = unsignedTx.sign(
                HexUInt.of(
                    SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                        .privateKey
                ).bytes
            );

            // encoded signed tx
            const signedEncodedTx = signedTx.encoded;

            // check if raw transactions have valid prefix
            expect(signedEncodedTx[0]).toBe(0x51);
            console.log('raw tx', HexUInt.of(signedEncodedTx).toString());

            // send raw transactions
            const send = await thorSoloClient.transactions.sendRawTransaction(
                HexUInt.of(signedEncodedTx).toString()
            );
            expect(send).toBeDefined();
            expect(send).toHaveProperty('id');
            expect(HexUInt.isValid0x(send.id)).toBe(true);

            // 3 - Get transaction AND transaction receipt
            const transaction =
                await thorSoloClient.transactions.getTransaction(send.id);
            const transactionReceipt =
                await thorSoloClient.transactions.getTransactionReceipt(
                    send.id
                );

            expect(transaction).toBeDefined();
            expect(transactionReceipt).toBeDefined();
        });
    });
});
