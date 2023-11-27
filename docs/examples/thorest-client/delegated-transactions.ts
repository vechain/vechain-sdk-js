import {
    Transaction,
    TransactionUtils,
    TransactionHandler,
    dataUtils
} from '@vechainfoundation/vechain-sdk-core';
import {
    HttpClient,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';
import { expect } from 'expect';

/**
 * Url of the solo network
 */
const _soloUrl = 'http://localhost:8669';

/**
 * Solo network instance
 */
const soloNetwork = new HttpClient(_soloUrl);

/**
 * Thorest client solo instance
 */
const thorestSoloClient = new ThorestClient(soloNetwork);

// Get latest block
const latestBlock = await thorestSoloClient.blocks.getBestBlock();

// Create clauses
const clauses = [
    {
        to: '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
        value: 1000000,
        data: '0x'
    }
];

// Get gas @NOTE this is an approximation
const gas = 5000 + TransactionUtils.intrinsicGas(clauses) * 5;

// Create delegated transaction
const delegatedTransaction = new Transaction({
    chainTag: 0xf6,
    blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
    expiration: 32,
    clauses,
    gasPriceCoef: 128,
    gas,
    dependsOn: null,
    nonce: 12345678,
    reserved: {
        features: 1
    }
});

// Normal signature and delegation signature
const rawDelegatedSigned = TransactionHandler.signWithDelegator(
    delegatedTransaction,
    Buffer.from(
        'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5',
        'hex'
    ),
    Buffer.from(
        '432f38bcf338c374523e83fdb2ebe1030aba63c7f1e81f7d76c5f53f4d42e766',
        'hex'
    )
).encoded;

// Send transaction
const send = await thorestSoloClient.transactions.sendTransaction(
    `0x${rawDelegatedSigned.toString('hex')}`
);
expect(send).toBeDefined();
expect(send).toHaveProperty('id');
expect(dataUtils.isHexString(send.id)).toBe(true);

// Get transaction details and receipt
const transactionDetails = await thorestSoloClient.transactions.getTransaction(
    send.id
);
const transactionReceipt =
    await thorestSoloClient.transactions.getTransactionReceipt(send.id);

expect(transactionDetails).toBeDefined();
expect(transactionReceipt).toBeDefined();
