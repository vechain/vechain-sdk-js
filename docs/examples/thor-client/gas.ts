import { HexUInt, networkInfo, TransactionHandler } from '@vechain/sdk-core';
import { THOR_SOLO_URL, ThorClient } from '@vechain/sdk-network';
import { expect } from 'expect';

// START_SNIPPET: GasSnippet

// 1 - Create thor client for solo network
const thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL);

// 2- Init transaction

// 2.1 - Get latest block
const latestBlock = await thorSoloClient.blocks.getBestBlockCompressed();

// 2.2 - Transaction sender and receiver
const senderAccount = {
    address: '0x2669514f9fe96bc7301177ba774d3da8a06cace4',
    privateKey: HexUInt.of(
        'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5'
    )
};

const receiverAccount = {
    address: '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
    privateKey: HexUInt.of(
        '1758771c54938e977518e4ff1c297aca882f6598891df503030734532efa790e'
    ).bytes
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

const transactionBody = {
    chainTag: networkInfo.solo.chainTag,
    blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
    expiration: 32,
    clauses,
    gasPriceCoef: 128,
    gas: gasResult.totalGas,
    dependsOn: null,
    nonce: 12345678
};

// 5 - Sign transaction
const rawNormalSigned = TransactionHandler.sign(
    transactionBody,
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

// END_SNIPPET: GasSnippet

expect(transactionDetails).toBeDefined();
expect(transactionReceipt).toBeDefined();
