import { networkInfo } from '@vechain-sdk/core';
import {
    Transaction,
    secp256k1,
    TransactionUtils,
    TransactionHandler,
    type TransactionClause,
    type TransactionBody,
    unitsUtils
} from '@vechain-sdk/core';
import { expect } from 'expect';

// In this example transaction A is created with no dependencies
// Transaction B is the created as being dependant on transaction A

// Define transaction clauses
const txAClauses: TransactionClause[] = [
    {
        to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        value: unitsUtils.parseVET('1000').toString(), // VET transfer transaction
        data: '0x'
    }
];
const txBClauses: TransactionClause[] = [
    {
        to: '0x7ccadeea14dd6727845b58f8aa7aad0f41a002a2',
        value: 2000, // VET transfer transaction
        data: '0x'
    }
];

// Define transaction A with no dependencies
// Note: This transaction has nonce = 1
const txABody: TransactionBody = {
    chainTag: networkInfo.mainnet.chainTag,
    blockRef: '0x0000000000000000',
    expiration: 0,
    clauses: txAClauses,
    gasPriceCoef: 0,
    gas: TransactionUtils.intrinsicGas(txAClauses),
    dependsOn: null,
    nonce: 1
};

// Define transaction B with nonce = 2
// Note at the moment dependsOn is null
const txBBody: TransactionBody = {
    chainTag: networkInfo.mainnet.chainTag,
    blockRef: '0x0000000000000000',
    expiration: 0,
    clauses: txBClauses,
    gasPriceCoef: 0,
    gas: TransactionUtils.intrinsicGas(txBClauses),
    dependsOn: null,
    nonce: 2
};

// Define the senders private key
const pkSender = secp256k1.generatePrivateKey();

// To define transaction B as dependant on transaction A
// We need to sign transaction A, and then get its Id
// and set that Id into transaction B's dependsOn field

// get tx A id
const txAUnsigned = new Transaction(txABody);
const txASigned = TransactionHandler.sign(txAUnsigned, pkSender);
const txAId = txASigned.id;
// set it inside tx B
txBBody.dependsOn = txAId;

// sign Tx B
const txBUnsigned = new Transaction(txBBody);
const txBSigned = TransactionHandler.sign(txBUnsigned, pkSender);
// encode Tx B
const rawTxB = txBSigned.encoded;

// To check we can decode Tx B
const decodedTx = TransactionHandler.decode(rawTxB, true);
expect(decodedTx.body.dependsOn).toBe(txAId);
