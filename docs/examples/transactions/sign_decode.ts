import {
    Transaction,
    secp256k1,
    TransactionUtils,
    TransactionHandler,
    type TransactionClause,
    type TransactionBody
} from '@vechain-sdk/core';
import { expect } from 'expect';

// Define clauses
const clauses: TransactionClause[] = [
    {
        to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        value: 10000,
        data: '0x'
    }
];

// Calculate intrinsic gas of clauses
const gas = TransactionUtils.intrinsicGas(clauses);

// Body of transaction
const body: TransactionBody = {
    chainTag: 0x9a,
    blockRef: '0x0000000000000000',
    expiration: 0,
    clauses,
    gasPriceCoef: 128,
    gas,
    dependsOn: null,
    nonce: 12345678
};

// Create private key
const privateKey = secp256k1.generatePrivateKey();

// Sign transaction
const unsignedTx = new Transaction(body);
const signedTransaction = TransactionHandler.sign(unsignedTx, privateKey);

// Encode transaction
const encodedRaw = signedTransaction.encoded;

// Decode transaction and check
const decodedTx = TransactionHandler.decode(encodedRaw, true);
expect(decodedTx.body.chainTag).toBe(body.chainTag);
expect(decodedTx.body.nonce).toBe(body.nonce);
