import { networkInfo } from '@vechainfoundation/core';
import {
    Transaction,
    secp256k1,
    TransactionUtils,
    TransactionHandler,
    HDNode,
    type TransactionClause,
    type TransactionBody,
    mnemonic,
    unitsUtils
} from '@vechainfoundation/core';
import { expect } from 'expect';

// In this example a fee delegated transaction is
// created, signed (by both parties), encoded and then decoded

// Define clause
const clauses: TransactionClause[] = [
    {
        to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        value: unitsUtils.parseVET('10000').toString(), // VET transfer transaction
        data: '0x'
    }
];

// Body of transaction
const body: TransactionBody = {
    chainTag: networkInfo.mainnet.chainTag,
    blockRef: '0x0000000000000000',
    expiration: 0,
    clauses,
    gasPriceCoef: 0,
    gas: TransactionUtils.intrinsicGas(clauses),
    dependsOn: null,
    nonce: 1,
    reserved: {
        features: 1 // set the transaction to be delegated
    }
};

// Create private keys of sender and delegate
const pkSender = secp256k1.generatePrivateKey();
const nodeDelgate = HDNode.fromMnemonic(mnemonic.generate());
const pkDelegate = nodeDelgate.privateKey;
// Get address of delegate
const addrDelegate = nodeDelgate.address;

// Sign transaction as sender and delegate
const unsignedTx = new Transaction(body);
const signedTransaction = TransactionHandler.signWithDelegator(
    unsignedTx,
    pkSender,
    pkDelegate
);

// Encode transaction
const encodedRaw = signedTransaction.encoded;
// Decode transaction and check
const decodedTx = TransactionHandler.decode(encodedRaw, true);
expect(decodedTx.isDelegated).toBeTruthy();
expect(decodedTx.delegator).toBe(addrDelegate);
