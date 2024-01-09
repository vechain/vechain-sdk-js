import {
    Transaction,
    TransactionUtils,
    TransactionHandler,
    dataUtils,
    unitsUtils,
    contract
} from '@vechainfoundation/vechain-sdk-core';
import { HttpClient, ThorClient } from '@vechainfoundation/vechain-sdk-network';
import { expect } from 'expect';

// 1 - Create thor client for solo network

const _soloUrl = 'http://localhost:8669';
const soloNetwork = new HttpClient(_soloUrl);
const thorSoloClient = new ThorClient(soloNetwork);

// 2 - Get latest block

const latestBlock = await thorSoloClient.blocks.getBestBlock();

// 3 - Create clauses

const clauses = [
    contract.clauseBuilder.transferVET(
        '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
        unitsUtils.parseVET('10000')
    )
];

// 4 - Create transaction

const transaction = new Transaction({
    chainTag: 0xf6,
    blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
    expiration: 32,
    clauses,
    gasPriceCoef: 128,
    gas: 5000 + TransactionUtils.intrinsicGas(clauses) * 5,
    dependsOn: null,
    nonce: 12345678
});

// Private keys of sender
const senderPrivateKey =
    'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5';

// 5 - Normal signature (NO delegation)

const rawNormalSigned = TransactionHandler.sign(
    transaction,
    Buffer.from(senderPrivateKey, 'hex')
).encoded;

// 6 - Send transaction

const send = await thorSoloClient.transactions.sendRawTransaction(
    `0x${rawNormalSigned.toString('hex')}`
);
expect(send).toBeDefined();
expect(send).toHaveProperty('id');
expect(dataUtils.isHexString(send.id)).toBe(true);

// 7 - Get transaction details and receipt

const transactionDetails = await thorSoloClient.transactions.getTransaction(
    send.id
);
const transactionReceipt =
    await thorSoloClient.transactions.getTransactionReceipt(send.id);

expect(transactionDetails).toBeDefined();
expect(transactionReceipt).toBeDefined();

// Destroying the Thor client
thorSoloClient.destroy();
