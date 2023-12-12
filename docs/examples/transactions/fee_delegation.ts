import { networkInfo } from '@vechainfoundation/vechain-sdk-core';
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
} from '@vechainfoundation/vechain-sdk-core';
import { expect } from 'expect';

// 1 - Define clause

const clauses: TransactionClause[] = [
    {
        to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        value: unitsUtils.parseVET('10000').toString(), // VET transfer transaction
        data: '0x'
    }
];

// 2 - Define transaction body

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

// 3 - Create private keys of sender and delegate

const senderPrivateKey = secp256k1.generatePrivateKey();
const nodeDelegate = HDNode.fromMnemonic(mnemonic.generate());

const delegatorPrivateKey = nodeDelegate.privateKey;

// 4 - Get address of delegate

const delegatorAddress = nodeDelegate.address;

// 5 - Sign transaction as sender and delegate

const unsignedTx = new Transaction(body);
const signedTransaction = TransactionHandler.signWithDelegator(
    unsignedTx,
    senderPrivateKey,
    delegatorPrivateKey
);

// 5 - Encode transaction

const encodedRaw = signedTransaction.encoded;

// 6 - Decode transaction and check

const decodedTx = TransactionHandler.decode(encodedRaw, true);
expect(decodedTx.isDelegated).toBeTruthy();
expect(decodedTx.delegator).toBe(delegatorAddress);
