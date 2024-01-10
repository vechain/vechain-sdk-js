import { describe, test } from '@jest/globals';
import {
    type TransactionBody,
    TransactionUtils,
    contract,
    secp256k1,
    unitsUtils,
    networkInfo,
    Transaction,
    TransactionHandler
} from '@vechainfoundation/vechain-sdk-core';
import { HttpClient, ThorClient } from '../../src';

/**
 * Test
 *
 * @group integration/full-cycle
 */
describe('Full Cycle', () => {
    test('test', async () => {
        const _soloUrl = 'http://localhost:8669/';
        const soloNetwork = new HttpClient(_soloUrl);
        const thorSoloClient = new ThorClient(soloNetwork, {
            isPollingEnabled: false
        });

        // 2 - create the transaction
        const transaction = {
            clauses: [
                contract.clauseBuilder.transferVET(
                    '0xb717b660cd51109334bd10b2c168986055f58c1a',
                    unitsUtils.parseVET('1')
                )
            ],
            simulateTransactionOptions: {
                caller: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
            }
        };

        // 3 - Simulate the transaction
        const simulatedTx =
            await thorSoloClient.transactions.simulateTransaction(
                transaction.clauses,
                {
                    ...transaction.simulateTransactionOptions
                }
            );

        console.log(simulatedTx);

        // Create private key
        const privateKey = secp256k1.generatePrivateKey();

        // 4 - Sign transaction

        const gas = TransactionUtils.intrinsicGas(transaction.clauses);

        const body: TransactionBody = {
            chainTag: networkInfo.solo.chainTag,
            blockRef: '0x0000000000000000',
            expiration: 0,
            clauses: transaction.clauses,
            gasPriceCoef: 128,
            gas,
            dependsOn: null,
            nonce: 12345678
        };

        const unsignedTx = new Transaction(body);
        const signedTransaction = TransactionHandler.sign(
            unsignedTx,
            privateKey
        );

        console.log(signedTransaction);

        await thorSoloClient.transactions.sendTransaction(signedTransaction);
    });
});
