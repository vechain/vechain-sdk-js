import {
    Transaction,
    secp256k1,
    TransactionUtils,
    TransactionHandler,
    networkInfo,
    type TransactionClause,
    type TransactionBody,
    unitsUtils
} from '@vechain-sdk/core';
import { expect } from 'expect';

// In this example a transaction is created that
// has its expiry set to a specified block height

// Define clause
const clauses: TransactionClause[] = [
    {
        to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        value: unitsUtils.parseVET('1000').toString(), // VET transfer transaction
        data: '0x'
    }
];

// Body of transaction
const body: TransactionBody = {
    chainTag: networkInfo.mainnet.chainTag,
    blockRef: '0x00ffecb8ac3142c4', // first 8 bytes of block id from block #16772280
    expiration: 32, // tx will expire after block #16772280 + 32
    clauses,
    gasPriceCoef: 0,
    gas: TransactionUtils.intrinsicGas(clauses),
    dependsOn: null,
    nonce: 1
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
expect(decodedTx.body.blockRef).toBe(body.blockRef);
expect(decodedTx.body.expiration).toBe(body.expiration);
