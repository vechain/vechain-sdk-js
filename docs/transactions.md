---
description: Transactions related functions.
---

# Transactions

Vechain SDK provides comprehensive support for handling transactions. Developers can initialize a transaction by assembling the transaction body, adding clauses, and finally signing and sending the transaction. 

To break it down:

1. **Initializing a Transaction**: Developers can create a transaction by specifying the necessary details in the transaction body. This includes setting the chain tag, block reference, expiration, gas price coefficient, gas limit, and other relevant transaction parameters.
2. **Adding Clauses**: Clauses are the individual actions that the transaction will perform on the VechainThor blockchain. Each clause contains information such as the recipient's address, the amount of VET to be transferred, and additional data, if required.
3. **Signing the Transaction**: After assembling the transaction body with the appropriate clauses, developers can sign the transaction using their private key. Signing the transaction ensures its authenticity and prevents tampering during transmission.

## Example: Signing and Decoding
In this example a simple transaction with a single clause is created, signed, encoded and then decoded

```typescript { name=sign_decode, category=example }
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

// In this example a simple single clause transaction is
// created, signed, encoded and then decoded

// Define clauses
const clauses: TransactionClause[] = [
    {
        to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        value: unitsUtils.parseVET('10000').toString(),
        data: '0x'
    }
];

// Calculate intrinsic gas of clauses
const gas = TransactionUtils.intrinsicGas(clauses);

// Body of transaction
const body: TransactionBody = {
    chainTag: networkInfo.mainnet.chainTag,
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

```

## Example: Multiple Clauses
In VechainThor blockchain a transaction can be composed of multiple clauses. \
Clauses allow to send multiple payloads to different recipients within a single transaction.

```typescript { name=multiple_clauses, category=example }
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

// In this example a multiple clause transaction is
// created, signed, encoded and then decoded

// Define multiple clauses
const clauses: TransactionClause[] = [
    {
        to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        value: unitsUtils.parseVET('10000').toString(), // VET transfer clause
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
    chainTag: networkInfo.mainnet.chainTag,
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

```

## Example: Fee Delegation
Fee delegation is a feature on the VechainThor blockchain which enables the transaction sender to request another entity, a sponsor, to pay for the transaction fee on the sender's behalf.

```typescript { name=fee_delegation, category=example }
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
const nodeDelegate = HDNode.fromMnemonic(mnemonic.generate());
const pkDelegate = nodeDelegate.privateKey;
// Get address of delegate
const addrDelegate = nodeDelegate.address;

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

```

## Example: BlockRef and Expiration
Using the _BlockRef_ and _Expiration_ fields a transaction can be set to be processed or expired by a particular block. _BlockRef_ should match the first eight bytes of the ID of the block. The sum of _BlockRef_ and _Expiration_ defines the height of the last block that the transaction can be included.

```typescript { name=blockref_expiration, category=example }
import {
    Transaction,
    secp256k1,
    TransactionUtils,
    TransactionHandler,
    networkInfo,
    type TransactionClause,
    type TransactionBody,
    unitsUtils
} from '@vechainfoundation/vechain-sdk-core';
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

```

## Example: Transaction Dependency
A transaction can be set to only be processed after another transaction, therefore defining an execution order for transactions. The _DependsOn_ field is the Id of the transaction on which the current transaction depends on. If the transaction does not depend on others _DependsOn_ can be set to _null_

```typescript { name=tx_dependency, category=example }
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

```

