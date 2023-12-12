import { networkInfo } from '@vechainfoundation/vechain-sdk-core';
import {
    Transaction,
    secp256k1,
    TransactionUtils,
    TransactionHandler,
    type TransactionClause,
    type TransactionBody,
    unitsUtils
} from '@vechainfoundation/vechain-sdk-core';
import { expect } from 'expect';

// 1 - Define transaction clauses

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

// 2 - Define transaction A with no dependencies

// @NOTE: This transaction has nonce = 1
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

// 3 - Define transaction B with nonce = 2

// @NOTE: at the moment dependsOn is null
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
const senderPrivateKey = secp256k1.generatePrivateKey();

// To define transaction B as dependant on transaction A
// We need to sign transaction A, and then get its Id
// and set that Id into transaction B's dependsOn field

// 4 - Get Tx A id

const txAUnsigned = new Transaction(txABody);
const txASigned = TransactionHandler.sign(txAUnsigned, senderPrivateKey);

// 5 - Set it inside tx B

txBBody.dependsOn = txASigned.id;

// 6 - Sign Tx B

const txBUnsigned = new Transaction(txBBody);
const txBSigned = TransactionHandler.sign(txBUnsigned, senderPrivateKey);

// 7 - encode Tx B

const rawTxB = txBSigned.encoded;

// Check (we can decode Tx B)
const decodedTx = TransactionHandler.decode(rawTxB, true);
expect(decodedTx.body.dependsOn).toBe(txASigned.id);
