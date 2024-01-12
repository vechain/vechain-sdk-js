import { contract, unitsUtils } from '@vechain/vechain-sdk-core';
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
