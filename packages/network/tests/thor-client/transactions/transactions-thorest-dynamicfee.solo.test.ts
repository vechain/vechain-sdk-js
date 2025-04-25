import { beforeEach, describe, expect, test } from '@jest/globals';
import { SOLO_GENESIS_ACCOUNTS } from '../../fixture';
import {
    fromTransactionType,
    HexUInt,
    Transaction,
    TransactionType
} from '@vechain/sdk-core';
import { THOR_SOLO_URL, ThorClient } from '../../../src';

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

    test('e2e <- Send Dynamic Fee Vet Transfer Transaction with maxFeePerGas and maxPriorityFeePerGas specified', async () => {
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
        const gasResult = await thorSoloClient.transactions.estimateGas(
            clauses,
            SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
        );

        // Create transaction body
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
                SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey
            ).bytes
        );

        // encoded signed tx
        const signedEncodedTx = signedTx.encoded;

        // check if raw transactions have valid prefix
        expect(signedEncodedTx[0]).toBe(0x51);
        console.log('raw tx', HexUInt.of(signedEncodedTx).toString());

        // decode transaction and check
        const decodedTx = Transaction.decode(signedEncodedTx, true);
        expect(decodedTx.transactionType).toBe(TransactionType.EIP1559);
        expect(decodedTx.body.maxFeePerGas).toBe(10000000000000); // 10000000000000 in hex
        expect(decodedTx.body.maxPriorityFeePerGas).toBe(1000000); // 1000000 in hex
        expect(decodedTx.body.chainTag).toBe(0xf6);
        expect(decodedTx.body.blockRef).toBe(
            latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0'
        );

        // send raw transactions
        const send = await thorSoloClient.transactions.sendRawTransaction(
            HexUInt.of(signedEncodedTx).toString()
        );
        expect(send).toBeDefined();
        expect(send).toHaveProperty('id');
        expect(HexUInt.isValid0x(send.id)).toBe(true);

        // wait for transaction to be mined and get receipt
        const receipt = await thorSoloClient.transactions.waitForTransaction(
            send.id
        );
        expect(receipt).toBeDefined();
        expect(receipt?.reverted).toBe(false);
        expect(receipt?.gasUsed).toBeGreaterThan(0);
        expect(receipt?.gasUsed).toBeLessThanOrEqual(gasResult.totalGas);

        // Get transaction object from blockchain
        const onChainTx = await thorSoloClient.transactions.getTransaction(
            send.id
        );
        expect(onChainTx).toBeDefined();
        expect(onChainTx?.type).toBe(
            fromTransactionType(TransactionType.EIP1559)
        );
        expect(onChainTx?.maxFeePerGas).toBe('0x9184E72A000'.toLowerCase()); // 10000000000000 in hex
        expect(onChainTx?.maxPriorityFeePerGas).toBe('0xF4240'.toLowerCase()); // 1000000 in hex
    });

    test('e2e <- Send Dynamic Fee Vet Transfer Transaction with only maxFeePerGas specified', async () => {
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
        const gasResult = await thorSoloClient.transactions.estimateGas(
            clauses,
            SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
        );

        // Create transaction body
        const transactionBody = {
            chainTag: 0xf6, // 0xf6 for Galactica dev network
            blockRef:
                latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
            expiration: 32,
            clauses,
            gas: gasResult.totalGas,
            maxFeePerGas: 10000000000000,
            dependsOn: null,
            nonce: 12345677
        };

        // set default value for maxPriorityFeePerGas
        const updatedBody =
            await thorSoloClient.transactions.fillTransactionBody(
                transactionBody
            );
        // create transaction
        const unsignedTx = Transaction.of(updatedBody);
        expect(unsignedTx.transactionType).toBe('eip1559');
        expect(unsignedTx.body.maxFeePerGas).toBe(10000000000000); // unchanged
        expect(unsignedTx.body.maxPriorityFeePerGas).toBeDefined(); // computed

        // get signeded tx
        const signedTx = unsignedTx.sign(
            HexUInt.of(
                SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey
            ).bytes
        );

        // encoded signed tx
        const signedEncodedTx = signedTx.encoded;

        // check if raw transactions have valid prefix
        expect(signedEncodedTx[0]).toBe(0x51);
        console.log('raw tx', HexUInt.of(signedEncodedTx).toString());

        // decode transaction and check
        const decodedTx = Transaction.decode(signedEncodedTx, true);
        expect(decodedTx.transactionType).toBe(TransactionType.EIP1559);
        expect(decodedTx.body.maxFeePerGas).toBe(10000000000000);
        expect(decodedTx.body.maxPriorityFeePerGas).toBeGreaterThan(0);
        expect(decodedTx.body.chainTag).toBe(0xf6);
        expect(decodedTx.body.blockRef).toBe(
            latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0'
        );

        // send raw transactions
        const send = await thorSoloClient.transactions.sendRawTransaction(
            HexUInt.of(signedEncodedTx).toString()
        );
        expect(send).toBeDefined();
        expect(send).toHaveProperty('id');
        expect(HexUInt.isValid0x(send.id)).toBe(true);

        // wait for transaction to be mined and get receipt
        const receipt = await thorSoloClient.transactions.waitForTransaction(
            send.id
        );
        expect(receipt).toBeDefined();
        expect(receipt?.reverted).toBe(false);
        expect(receipt?.gasUsed).toBeGreaterThan(0);
        expect(receipt?.gasUsed).toBeLessThanOrEqual(gasResult.totalGas);

        // Get transaction object from blockchain
        const onChainTx = await thorSoloClient.transactions.getTransaction(
            send.id
        );
        expect(onChainTx).toBeDefined();
        expect(onChainTx?.type).toBe(
            fromTransactionType(TransactionType.EIP1559)
        );
        expect(onChainTx?.maxFeePerGas).toBe('0x9184E72A000'.toLowerCase()); // 10000000000000 in hex
        expect(onChainTx?.maxPriorityFeePerGas).toBeDefined(); // computed
    });
});
