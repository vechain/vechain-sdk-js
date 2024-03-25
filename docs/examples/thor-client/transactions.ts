import {
    TransactionHandler,
    unitsUtils,
    clauseBuilder,
    Hex0x
} from '@vechain/sdk-core';
import { HttpClient, ThorClient } from '@vechain/sdk-network';
import { expect } from 'expect';

// START_SNIPPET: TransactionsSnippet

// Sender account with private key
const senderAccount = {
    privateKey:
        'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5',
    address: '0x2669514f9fe96bc7301177ba774d3da8a06cace4'
};

// 1 - Create thor client for solo network

const _soloUrl = 'http://localhost:8669';
const soloNetwork = new HttpClient(_soloUrl);
const thorSoloClient = new ThorClient(soloNetwork);

// 2 - Get latest block

const latestBlock = await thorSoloClient.blocks.getBestBlockCompressed();

// 3 - Create clauses

const clauses = [
    clauseBuilder.transferVET(
        '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
        unitsUtils.parseVET('10000')
    )
];

// Get gas estimate
const gasResult = await thorSoloClient.gas.estimateGas(
    clauses,
    senderAccount.address
);

// 4 - Create transaction

const transactionBody = {
    chainTag: 0xf6,
    blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
    expiration: 32,
    clauses,
    gasPriceCoef: 128,
    gas: gasResult.totalGas,
    dependsOn: null,
    nonce: 12345678
};

// 5 - Normal signature (NO delegation)

const rawNormalSigned = TransactionHandler.sign(
    transactionBody,
    Buffer.from(senderAccount.privateKey, 'hex')
).encoded;

// 6 - Send transaction

const send = await thorSoloClient.transactions.sendRawTransaction(
    `0x${rawNormalSigned.toString('hex')}`
);
expect(send).toBeDefined();
expect(send).toHaveProperty('id');
expect(Hex0x.isValid(send.id)).toBe(true);

// 7 - Get transaction details and receipt

const transactionDetails = await thorSoloClient.transactions.getTransaction(
    send.id
);
const transactionReceipt =
    await thorSoloClient.transactions.getTransactionReceipt(send.id);

// END_SNIPPET: TransactionsSnippet

expect(send).toBeDefined();
expect(send).toHaveProperty('id');
expect(Hex0x.isValid(send.id)).toBe(true);
expect(transactionDetails).toBeDefined();
expect(transactionReceipt).toBeDefined();
