import { clauseBuilder, unitsUtils } from '@vechain/vechain-sdk-core';
import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import { expect } from 'expect';

// 1 - Create the thor client
const _testnetUrl = 'https://testnet.vechain.org/';
const testNetwork = new HttpClient(_testnetUrl);
const thorClient = new ThorClient(testNetwork, {
    isPollingEnabled: false
});

// Sender account with private key
const senderAccount = {
    mnemonic:
        'fat draw position use tenant force south job notice soul time fruit',
    privateKey:
        '2153c1e49c14d92e8b558750e4ec3dc9b5a6ac4c13d24a71e0fa4f90f4a384b5',
    address: '0x571E3E1fBE342891778151f037967E107fb89bd0'
};

// Delegator account with private key
const delegatorAccount = {
    URL: 'https://sponsor-testnet.vechain.energy/by/269'
};

// 2 - Create the transaction clauses
const transaction = {
    clauses: [
        clauseBuilder.transferVET(
            '0xb717b660cd51109334bd10b2c168986055f58c1a',
            unitsUtils.parseVET('1')
        )
    ],
    simulateTransactionOptions: {
        caller: senderAccount.address
    }
};

// 3 - Estimate gas
const gasResult = await thorClient.gas.estimateGas(
    transaction.clauses,
    senderAccount.address
);

// 4 - Build transaction body
const txBody = await thorClient.transactions.buildTransactionBody(
    transaction.clauses,
    gasResult.totalGas,
    {
        isDelegated: true
    }
);

// 4 - Sign the transaction
const signedTx = await thorClient.transactions.signTransaction(
    txBody,
    senderAccount.privateKey,
    {
        delegatorUrl: delegatorAccount.URL
    }
);

// Check the signed transaction
expect(signedTx.isSigned).toEqual(true);
expect(signedTx.isDelegated).toEqual(true);
// expect(signedTx.delegator).toEqual(delegatorAccount.address); ---

// 5 - Send the transaction
const sendTransactionResult =
    await thorClient.transactions.sendTransaction(signedTx);

// 6 - Wait for transaction receipt
const txReceipt = await thorClient.transactions.waitForTransaction(
    sendTransactionResult.id
);

// Check the transaction receipt
expect(txReceipt).toBeDefined();
expect(txReceipt?.gasUsed).toBe(gasResult.totalGas);
expect(sendTransactionResult.id).toBe(txReceipt?.meta.txID);
