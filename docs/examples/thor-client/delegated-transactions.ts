import {
    Transaction,
    TransactionHandler,
    dataUtils,
    unitsUtils,
    contract
} from '@vechain/vechain-sdk-core';
import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import { expect } from 'expect';

// 1 - Create thor client for solo network

const _soloUrl = 'http://localhost:8669';
const soloNetwork = new HttpClient(_soloUrl);
const thorSoloClient = new ThorClient(soloNetwork);

// 2 - Get latest block

const latestBlock = await thorSoloClient.blocks.getBestBlock();

const senderAccount = {
    privateKey:
        'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5',
    address: '0x2669514f9fe96bc7301177ba774d3da8a06cace4'
};

// 3 - Create transaction clauses

const clauses = [
    contract.clauseBuilder.transferVET(
        '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
        unitsUtils.parseVET('10000')
    )
];

// Get gas @NOTE this is an approximation
const gasResult = await thorSoloClient.gas.estimateGas(
    clauses,
    senderAccount.address
);

//  4 - Create delegated transaction

const delegatedTransaction = new Transaction({
    chainTag: 0xf6,
    blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
    expiration: 32,
    clauses,
    gasPriceCoef: 128,
    gas: gasResult.totalGas,
    dependsOn: null,
    nonce: 12345678,
    reserved: {
        features: 1
    }
});

/** Private key of delegate
 * @NOTE The delegate account must have enough VET and VTHO to pay for the gas
 */
const delegatePrivateKey =
    '432f38bcf338c374523e83fdb2ebe1030aba63c7f1e81f7d76c5f53f4d42e766';

// 5 - Normal signature and delegation signature

const rawDelegatedSigned = TransactionHandler.signWithDelegator(
    delegatedTransaction,
    Buffer.from(senderAccount.privateKey, 'hex'),
    Buffer.from(delegatePrivateKey, 'hex')
).encoded;

// 6 - Send transaction

const send = await thorSoloClient.transactions.sendRawTransaction(
    `0x${rawDelegatedSigned.toString('hex')}`
);
expect(send).toBeDefined();
expect(send).toHaveProperty('id');
expect(dataUtils.isHexString(send.id)).toBe(true);

// 7 - Get transaction details and receipt

// Details of transaction
const transactionDetails = await thorSoloClient.transactions.getTransaction(
    send.id
);

// Receipt of transaction
const transactionReceipt =
    await thorSoloClient.transactions.getTransactionReceipt(send.id);

expect(transactionDetails).toBeDefined();
expect(transactionReceipt).toBeDefined();

// Destroying the Thor client
thorSoloClient.destroy();
