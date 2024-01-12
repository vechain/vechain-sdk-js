import {
    Transaction,
    TransactionHandler,
    contract,
    networkInfo,
    unitsUtils
} from '@vechain/vechain-sdk-core';
import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import { expect } from 'expect';

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
    blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
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
    await thorSoloClient.transactions.sendTransaction(signedTransaction);

// 6 - Wait for transaction receipt
const txReceipt = await thorSoloClient.transactions.waitForTransaction(
    sendTransactionResult.id
);

// Check the transaction receipt
expect(txReceipt).toBeDefined();
expect(txReceipt?.gasUsed).toBe(gasResult.totalGas);
expect(sendTransactionResult.id).toBe(txReceipt?.meta.txID);
