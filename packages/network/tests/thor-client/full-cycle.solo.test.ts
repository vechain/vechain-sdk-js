import { describe, expect, test } from '@jest/globals';
import {
    contract,
    unitsUtils,
    networkInfo,
    Transaction,
    TransactionHandler
} from '@vechain/vechain-sdk-core';
import { HttpClient, ThorClient } from '../../src';

/**
 * Test
 *
 * @group integration/full-cycle
 */
describe('Full Cycle', () => {
    test('simple test no delegator', async () => {
        // 1 - Create the thor client
        const _soloUrl = 'http://localhost:8669/';
        const soloNetwork = new HttpClient(_soloUrl);
        const thorSoloClient = new ThorClient(soloNetwork, {
            isPollingEnabled: false
        });

        // Sender account with private key
        const senderAccount = {
            privateKey:
                'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26',
            address: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
        };

        // 2 - Create the transaction clauses
        const transaction = {
            clauses: [
                contract.clauseBuilder.transferVET(
                    '0xb717b660cd51109334bd10b2c168986055f58c1a',
                    unitsUtils.parseVET('1')
                )
            ],
            simulateTransactionOptions: {
                caller: senderAccount.address
            }
        };

        // 3 - Estimate gas
        const gasResult = await thorSoloClient.gas.estimateGas(
            transaction.clauses,
            transaction.simulateTransactionOptions.caller
        );

        // 4 - Build transaction body
        const latestBlock = await thorSoloClient.blocks.getBestBlock();
        const unsignedTx = new Transaction({
            chainTag: networkInfo.solo.chainTag,
            blockRef:
                latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
            expiration: 32,
            clauses: transaction.clauses,
            gasPriceCoef: 128,
            gas: gasResult.totalGas,
            dependsOn: null,
            nonce: 10000000
        });

        // 4 - Sign the transaction
        const signedTransaction = TransactionHandler.sign(
            unsignedTx,
            Buffer.from(senderAccount.privateKey, 'hex')
        );

        // 5 - Send the transaction
        const sendTransactionResult =
            await thorSoloClient.transactions.sendTransaction(
                signedTransaction
            );

        // 6 - Wait for transaction receipt
        const txReceipt = await thorSoloClient.transactions.waitForTransaction(
            sendTransactionResult.id
        );

        // Check the transaction receipt
        expect(txReceipt).toBeDefined();
        expect(txReceipt?.gasUsed).toBe(gasResult.totalGas);
        expect(sendTransactionResult.id).toBe(txReceipt?.meta.txID);
    });

    test('simple test with delegator - private key', async () => {
        // 1 - Create the thor client
        const _soloUrl = 'http://localhost:8669/';
        const soloNetwork = new HttpClient(_soloUrl);
        const thorSoloClient = new ThorClient(soloNetwork, {
            isPollingEnabled: false
        });

        // Sender account with private key
        const senderAccount = {
            privateKey:
                'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26',
            address: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
        };

        // Delegator account with private key
        const delegatorAccount = {
            privateKey:
                '521b7793c6eb27d137b617627c6b85d57c0aa303380e9ca4e30a30302fbc6676',
            address: '0x062F167A905C1484DE7e75B88EDC7439f82117DE'
        };

        // 2 - Create the transaction clauses
        const transaction = {
            clauses: [
                contract.clauseBuilder.transferVET(
                    '0xb717b660cd51109334bd10b2c168986055f58c1a',
                    unitsUtils.parseVET('1')
                )
            ],
            simulateTransactionOptions: {
                caller: senderAccount.address
            }
        };

        // 3 - Estimate gas
        const gasResult = await thorSoloClient.gas.estimateGas(
            transaction.clauses,
            transaction.simulateTransactionOptions.caller
        );

        // 4 - Build transaction body
        const latestBlock = await thorSoloClient.blocks.getBestBlock();
        const delegatedTransaction = new Transaction({
            chainTag: 0xf6,
            blockRef:
                latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
            expiration: 32,
            clauses: transaction.clauses,
            gasPriceCoef: 128,
            gas: gasResult.totalGas,
            dependsOn: null,
            nonce: 12345678,
            reserved: {
                features: 1
            }
        });

        // 4 - Sign the transaction
        const rawDelegatedSigned = TransactionHandler.signWithDelegator(
            delegatedTransaction,
            Buffer.from(senderAccount.privateKey, 'hex'),
            Buffer.from(delegatorAccount.privateKey, 'hex')
        );

        // Check the signed transaction
        expect(rawDelegatedSigned.isSigned).toEqual(true);
        expect(rawDelegatedSigned.isDelegated).toEqual(true);
        expect(rawDelegatedSigned.delegator).toEqual(delegatorAccount.address);

        // 5 - Send the transaction
        const sendTransactionResult =
            await thorSoloClient.transactions.sendTransaction(
                rawDelegatedSigned
            );

        // 6 - Wait for transaction receipt
        const txReceipt = await thorSoloClient.transactions.waitForTransaction(
            sendTransactionResult.id
        );

        // Check the transaction receipt
        expect(txReceipt).toBeDefined();
        expect(txReceipt?.gasUsed).toBe(gasResult.totalGas);
        expect(sendTransactionResult.id).toBe(txReceipt?.meta.txID);
    });

    test('simple test with delegator - signTransaction options', async () => {
        // 1 - Create the thor client
        const _soloUrl = 'http://localhost:8669/';
        const soloNetwork = new HttpClient(_soloUrl);
        const thorSoloClient = new ThorClient(soloNetwork, {
            isPollingEnabled: false
        });

        // Sender account with private key
        const senderAccount = {
            privateKey:
                'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26',
            address: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
        };

        // Delegator account with private key
        const delegatorAccount = {
            privateKey:
                '521b7793c6eb27d137b617627c6b85d57c0aa303380e9ca4e30a30302fbc6676',
            address: '0x062F167A905C1484DE7e75B88EDC7439f82117DE'
        };

        // 2 - Create the transaction clauses
        const transaction = {
            clauses: [
                contract.clauseBuilder.transferVET(
                    '0xb717b660cd51109334bd10b2c168986055f58c1a',
                    unitsUtils.parseVET('1')
                )
            ],
            simulateTransactionOptions: {
                caller: senderAccount.address
            }
        };

        // 3 - Estimate gas
        const gasResult = await thorSoloClient.gas.estimateGas(
            transaction.clauses,
            senderAccount.address
        );

        // 4 - Build transaction body
        const txBody = await thorSoloClient.transactions.buildTransactionBody(
            transaction.clauses,
            gasResult.totalGas,
            {
                isDelegated: true
            }
        );

        // 4 - Sign the transaction
        const signedTx = await thorSoloClient.transactions.signTransaction(
            txBody,
            senderAccount.privateKey,
            {
                delegatorPrivatekey: delegatorAccount.privateKey
            }
        );

        // Check the signed transactio
        expect(signedTx.isSigned).toEqual(true);
        expect(signedTx.isDelegated).toEqual(true);
        expect(signedTx.delegator).toEqual(delegatorAccount.address);

        // 5 - Send the transaction
        const sendTransactionResult =
            await thorSoloClient.transactions.sendTransaction(signedTx);

        // 6 - Wait for transaction receipt
        const txReceipt = await thorSoloClient.transactions.waitForTransaction(
            sendTransactionResult.id
        );

        // Check the transaction receipt
        expect(txReceipt).toBeDefined();
        expect(txReceipt?.gasUsed).toBe(gasResult.totalGas);
        expect(sendTransactionResult.id).toBe(txReceipt?.meta.txID);
    });
});
