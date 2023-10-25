import {
    Transaction,
    secp256k1,
    TransactionUtils,
    TransactionHandler,
    type TransactionClause,
    type TransactionBody
} from '@vechain-sdk/core';
import { expect } from 'expect';

// Define multiple clauses
const clauses: TransactionClause[] = [
    {
        to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        value: 10000, // VET transfer clause
        data: '0x'
    },
    {
        to: '0x0000000000000000000000000000456E65726779',
        value: 0, // Contract call to transfer VTHO
        data: '0xa9059cbb0000000000000000000000007567d83b7b8d80addcb\
281a71d54fc7b3364ffed0000000000000000000000000000000000000000\
0000000000000000000003e8'
    }
];

// Calculate intrinsic gas of both clauses
const gas = TransactionUtils.intrinsicGas(clauses);

// Body of transaction
const body: TransactionBody = {
    chainTag: 0x9a,
    blockRef: '0x0000000000000000',
    expiration: 32,
    clauses,
    gasPriceCoef: 0,
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
expect(decodedTx.body.clauses.length).toBe(clauses.length);
