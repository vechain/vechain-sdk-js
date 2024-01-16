import {
    Transaction,
    TransactionHandler,
    networkInfo
} from '@vechain/vechain-sdk-core';
import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import { expect } from 'expect';

// 1 - Create thor client for solo network
const _soloUrl = 'http://localhost:8669';
const soloNetwork = new HttpClient(_soloUrl);
const thorSoloClient = new ThorClient(soloNetwork);

// 2- Init transaction

// 2.1 - Get latest block
const latestBlock = await thorSoloClient.blocks.getBestBlock();

// 2.2 - Transaction sender and receiver
const senderAccount = {
    address: '0x2669514f9fe96bc7301177ba774d3da8a06cace4',
    privateKey: Buffer.from(
        'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5',
        'hex'
    )
};

const receiverAccount = {
    address: '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
    privateKey: Buffer.from(
        '1758771c54938e977518e4ff1c297aca882f6598891df503030734532efa790e',
        'hex'
    )
};

// 2 - Create transaction clauses and calcolate gas
const clauses = [
    {
        to: receiverAccount.address,
        value: 1000000,
        data: '0x'
    }
];

// Options to use gasPadding
const options = {
    gasPadding: 0.2 // 20%
};

// Estimate gas
const gasResult = await thorSoloClient.gas.estimateGas(
    clauses,
    senderAccount.address,
    options
);

// 4 - Create transaction

const transaction = new Transaction({
    chainTag: networkInfo.solo.chainTag,
    blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
    expiration: 32,
    clauses,
    gasPriceCoef: 128,
    gas: gasResult.totalGas,
    dependsOn: null,
    nonce: 12345678
});

// 5 - Sign transaction
const rawNormalSigned = TransactionHandler.sign(
    transaction,
    senderAccount.privateKey
).encoded;

// 6 - Send transaction

const send = await thorSoloClient.transactions.sendRawTransaction(
    `0x${rawNormalSigned.toString('hex')}`
);

// 7 - Get transaction details and receipt

const transactionDetails = await thorSoloClient.transactions.getTransaction(
    send.id
);
const transactionReceipt =
    await thorSoloClient.transactions.getTransactionReceipt(send.id);

expect(transactionDetails).toBeDefined();
expect(transactionReceipt).toBeDefined();
