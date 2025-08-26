import { beforeEach, describe, expect, test } from '@jest/globals';
import { SOLO_GENESIS_ACCOUNTS } from '../../fixture';
import { HexUInt, Transaction } from '@vechain/sdk-core';
import { THOR_SOLO_URL, ThorClient } from '../../../src';
import { retryOperation } from '../../test-utils';

/**
 * ThorClient tests for dynamic fee transactions on solo network
 *
 * @group galactica/integration/clients/thor-client/transactions
 */
describe('ThorClient - Transactions Module Dynamic Fees', () => {
    // ThorClient instance
    let thorSoloClient: ThorClient;

    beforeEach(() => {
        thorSoloClient = ThorClient.at(THOR_SOLO_URL);
    });

    /**
     * sendTransaction tests
     */
    describe('sendTransaction', () => {
        test('Send Dynamic Fee Vet Transaction and Verify in Expanded Block', async () => {
            const clauses = [
                {
                    to: SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                        .address,
                    value: 1,
                    data: '0x'
                }
            ];

            const latestBlock = await retryOperation(
                async () => await thorSoloClient.blocks.getBestBlockCompressed()
            );

            const gasResult = await retryOperation(
                async () =>
                    await thorSoloClient.gas.estimateGas(
                        clauses,
                        SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                            .address
                    )
            );

            const transactionBody = {
                chainTag: 0xf6,
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

            const unsignedTx = Transaction.of(transactionBody);
            const signedTx = unsignedTx.sign(
                HexUInt.of(
                    SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                        .privateKey
                ).bytes
            );
            const signedEncodedTx = signedTx.encoded;

            const send = await retryOperation(
                async () =>
                    await thorSoloClient.transactions.sendRawTransaction(
                        HexUInt.of(signedEncodedTx).toString()
                    )
            );
            expect(send).toBeDefined();
            expect(send).toHaveProperty('id');

            const receipt = await retryOperation(
                async () =>
                    await thorSoloClient.transactions.waitForTransaction(
                        send.id
                    )
            );
            expect(receipt).toBeDefined();
            expect(receipt?.reverted).toBe(false);

            // Fetch the expanded block using the receipt blockID
            const blockID = receipt?.meta.blockID;
            expect(blockID).toBeDefined(); // This already guarantees it's not undefined

            const expandedBlock = await retryOperation(
                async () =>
                    await thorSoloClient.blocks.getBlockExpanded(
                        blockID as string
                    )
            );
            expect(expandedBlock).not.toBeNull();
            expect(Array.isArray(expandedBlock?.transactions)).toBe(true);

            // Locate the transaction inside the block
            if (
                expandedBlock == null ||
                !Array.isArray(expandedBlock.transactions)
            ) {
                throw new Error(
                    'Expanded block is null or missing transactions'
                );
            }

            const txInBlock = expandedBlock.transactions.find(
                (tx) => tx.id === send.id
            );

            if (txInBlock == null) {
                throw new Error('Transaction not found in block');
            }

            expect(txInBlock).toBeDefined();
            expect(txInBlock?.origin).toBe(
                SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            );

            // Validate fields in the transaction
            expect(txInBlock.clauses.length).toBe(1);
            const clauseTo = txInBlock.clauses[0].to;
            expect(clauseTo).not.toBeNull();

            // Explicit null check for `clauseTo`
            if (clauseTo === null || clauseTo === undefined) {
                throw new Error("Clause 'to' field is null or undefined");
            }
            expect(clauseTo.toLowerCase()).toBe(
                SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address.toLowerCase()
            );
            expect(txInBlock.clauses[0].value).toBe('0x1');
            expect(txInBlock.gas).toBe(gasResult.totalGas);
            expect(txInBlock.maxFeePerGas).toBe('0x9184e72a000'); // 10000000000000
            expect(txInBlock.maxPriorityFeePerGas).toBe('0xf4240'); // 1000000
            expect(txInBlock.nonce).toBe('0xbc614d'); // 12345677 in hex
            expect(txInBlock.chainTag).toBe(0xf6);
        });
    });
});
