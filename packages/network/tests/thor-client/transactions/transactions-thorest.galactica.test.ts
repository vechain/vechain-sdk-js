import { beforeEach, describe, expect, test } from '@jest/globals';
import { TEST_ACCOUNTS, SOLO_GENESIS_ACCOUNTS } from '../../fixture';
import { HexUInt, Transaction } from '@vechain/sdk-core';
import { sendTransactionErrors } from './fixture-thorest';
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
        /**
         * SendTransaction - correct cases
         */
        sendTransactionErrors.correct.forEach((testCase) => {
            test(testCase.testName, async () => {
                // 1- Init transaction

                // Get latest block
                const latestBlock =
                    await thorSoloClient.blocks.getBestBlockCompressed();

                // Estimate the gas required for the transfer transaction
                const gasResult = await thorSoloClient.gas.estimateGas(
                    testCase.transaction.clauses,
                    TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                );

                // Create transactions
                const transactionBody = {
                    chainTag: 0xf6,
                    blockRef:
                        latestBlock !== null
                            ? latestBlock.id.slice(0, 18)
                            : '0x0',
                    expiration: 32,
                    clauses: testCase.transaction.clauses,
                    gas: gasResult.totalGas,
                    dependsOn: null,
                    nonce: 12345678,
                    maxFeePerGas: '0x9184e72a000',
                    maxPriorityFeePerGas: '0x2'
                };

                const delegatedTransactionBody = {
                    chainTag: 0xf6,
                    blockRef:
                        latestBlock !== null
                            ? latestBlock.id.slice(0, 18)
                            : '0x0',
                    expiration: 32,
                    clauses: testCase.transaction.clauses,
                    gas: gasResult.totalGas,
                    dependsOn: null,
                    nonce: 12345678,
                    maxFeePerGas: '0x9184e72a000',
                    maxPriorityFeePerGas: '0x2',
                    reserved: {
                        features: 1
                    }
                };

                // create transaction
                const undelgatedTransaction = Transaction.of(transactionBody);
                const delegatedTransaction = Transaction.of(
                    delegatedTransactionBody
                );
                expect(undelgatedTransaction.transactionType).toBe('eip1559');
                expect(delegatedTransaction.transactionType).toBe('eip1559');

                // get signed encoded transaction
                const undelgatedRawSigned = undelgatedTransaction.sign(
                    HexUInt.of(
                        SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                            .privateKey
                    ).bytes
                ).encoded;
                const delegatedRawSigned =
                    delegatedTransaction.signAsSenderAndGasPayer(
                        HexUInt.of(
                            SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                                .privateKey
                        ).bytes,
                        HexUInt.of(
                            SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                                .privateKey
                        ).bytes
                    ).encoded;

                console.log(
                    'signer',
                    SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
                );

                // check if raw transactions have valid prefix
                expect(undelgatedRawSigned[0]).toBe(0x51);
                expect(delegatedRawSigned[0]).toBe(0x51);
                console.log(
                    'undelgatedRawSigned',
                    HexUInt.of(undelgatedRawSigned).toString()
                );

                // decode raw transactions
                const undelgatedDecoded = Transaction.decode(
                    undelgatedRawSigned,
                    true
                );
                const delegatedDecoded = Transaction.decode(
                    delegatedRawSigned,
                    true
                );
                console.log('undelgatedDecoded', undelgatedDecoded);
                console.log('delegatedDecoded', delegatedDecoded);

                // send raw transactions
                for (const raw of [undelgatedRawSigned, delegatedRawSigned]) {
                    const send =
                        await thorSoloClient.transactions.sendRawTransaction(
                            HexUInt.of(raw).toString()
                        );
                    expect(send).toBeDefined();
                    expect(send).toHaveProperty('id');
                    expect(HexUInt.isValid0x(send.id)).toBe(true);

                    // 3 - Get transaction AND transaction receipt
                    const transaction =
                        await thorSoloClient.transactions.getTransaction(
                            send.id
                        );
                    const transactionReceipt =
                        await thorSoloClient.transactions.getTransactionReceipt(
                            send.id
                        );

                    expect(transaction).toBeDefined();
                    expect(transactionReceipt).toBeDefined();
                }
            });
        });
    });
});
