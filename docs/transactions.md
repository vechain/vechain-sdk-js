---
description: Transactions related functions.
---

# Transactions

Vechain SDK provides comprehensive support for handling transactions. Developers can initialize a transaction by assembling the transaction body, adding clauses, and finally signing and sending the transaction. 

To break it down:

1. **Initializing a Transaction**: Developers can create a transaction by specifying the necessary details in the transaction body. This includes setting the chain tag, block reference, expiration, gas price coefficient, gas limit, and other relevant transaction parameters.
2. **Adding Clauses**: Clauses are the individual actions that the transaction will perform on the VechainThor blockchain. Each clause contains information such as the recipient's address, the amount of VET to be transferred, and additional data, if required.
3. **Signing the Transaction**: After assembling the transaction body with the appropriate clauses, developers can sign the transaction using their private key. Signing the transaction ensures its authenticity and prevents tampering during transmission.

```typescript { name=signtx, category=example }
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
    expiration: 32,
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

```

