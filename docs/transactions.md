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

// 1 - Define clauses

const clauses: TransactionClause[] = [
    {
        to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        value: unitsUtils.parseVET('10000').toString(),
        data: '0x'
    }
];

// 2 - Calculate intrinsic gas of clauses

const gas = TransactionUtils.intrinsicGas(clauses);

// 3 - Body of transaction

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

// 4 - Sign transaction

const unsignedTx = new Transaction(body);
const signedTransaction = TransactionHandler.sign(unsignedTx, privateKey);

// 5 - Encode transaction

const encodedRaw = signedTransaction.encoded;

// 6 - Decode transaction and check

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

// 1 - Define multiple clauses

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

// 2 - Calculate intrinsic gas of both clauses

const gas = TransactionUtils.intrinsicGas(clauses);

// 3 - Body of transaction

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

// 4 - Sign transaction

const unsignedTx = new Transaction(body);
const signedTransaction = TransactionHandler.sign(unsignedTx, privateKey);

// 5 - Encode transaction

const encodedRaw = signedTransaction.encoded;

// 6 - Decode transaction and check

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

// 1 - Define clauses

const clauses: TransactionClause[] = [
    {
        to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        value: unitsUtils.parseVET('1000').toString(), // VET transfer transaction
        data: '0x'
    }
];

// 2 - Define transaction body

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

// 3 - Create private key

const privateKey = secp256k1.generatePrivateKey();

// 4 - Sign transaction

const unsignedTx = new Transaction(body);
const signedTransaction = TransactionHandler.sign(unsignedTx, privateKey);

// 5 - Encode transaction

const encodedRaw = signedTransaction.encoded;

// 6 - Decode transaction and check

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

```

## Example: Transaction Simulation
Simulates the execution of a transaction and allows (1) to estimate the gas cost of a transaction without sending it and (2) to check the return value/result(s) of the transaction.
Note - the result of a transaction might be different depending on the state(block) you are executing against.

```typescript { name=simulation, category=example }
import { expect } from 'expect';
import {
    HttpClient,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';
import {contract, dataUtils} from "@vechainfoundation/vechain-sdk-core";

// TODO: reserve an account on Confluence for this test and change to use unreserved accounts and add constants for the addresses

// In this example we simulate a transaction of sending 1 VET to another account

// 1 - Create client for solo network
const _soloUrl = 'http://localhost:8669';
const soloNetwork = new HttpClient(_soloUrl);
const thorestSoloClient = new ThorestClient(soloNetwork);

// 2(a) - create the transaction for a VET transfer
const transaction1 = {
    clauses: [
        {
            to: '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
            value: '1000000000000000000',
            data: '0x'
        }
    ],
    simulateTransactionOptions: {
        caller: '0x2669514f9fe96bc7301177ba774d3da8a06cace4'
    }
}

// 2(b) - define the expected result
const expected1 =
    [{
        data: '0x',
        events: [],
        transfers: [
            {
                sender: '0x2669514f9fe96bc7301177ba774d3da8a06cace4',
                recipient:
                    '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
                amount: '0xde0b6b3a7640000'
            }
        ],
        gasUsed: 0,
        reverted: false,
        vmError: ''
    }]


// 3 - Simulate the transaction
const simulatedTx1 =
    await thorestSoloClient.transactions.simulateTransaction(
        transaction1.clauses,
        {
            ...transaction1.simulateTransactionOptions
        }
    );


// 4 - Check the result - i.e. the gas used is returned and the transfer values are correct
// Note: VET transfers do not consume gas (no EVM computation)
expect(simulatedTx1[0].gasUsed).toEqual(expected1[0].gasUsed);
expect(simulatedTx1[0].transfers).toEqual(expected1[0].transfers);

// TODO: split into 2 test files??
// TODO: replace this ABI with a fixture reference?

// In this next example we simulate a Simulate smart contract transaction
const PARAMS_ABI = JSON.stringify([
    {
        constant: false,
        inputs: [
            {
                name: '_key',
                type: 'bytes32'
            },
            {
                name: '_value',
                type: 'uint256'
            }
        ],
        name: 'set',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [
            {
                name: '_key',
                type: 'bytes32'
            }
        ],
        name: 'get',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'executor',
        outputs: [
            {
                name: '',
                type: 'address'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: 'key',
                type: 'bytes32'
            },
            {
                indexed: false,
                name: 'value',
                type: 'uint256'
            }
        ],
        name: 'Set',
        type: 'event'
    }
]);

// 1(a) - create the transaction for a VET transfer
const transaction2 = {
    clauses: [
        /**
         * Calls the PARAMS 'get(bytes32)' function.
         * Passes "base-gas-price" encoded as bytes 32 as the parameter.
         */
        {
            to: '0x0000000000000000000000000000506172616d73', //TODO: replace with fixture reference
            value: '0',
            data: contract.coder.encodeFunctionInput(
                PARAMS_ABI,
                'get',
                [
                    dataUtils.encodeBytes32String(
                        'base-gas-price'
                    )
                ]
            )
        }
    ]
}

// 1(b) - define the expected result
const expected2 = [
    {
        /**
         * Base gas price set in the params.sol built-in contract.
         *
         * The value set for thor-solo is `1000000000000000` (0,001 VTHO)
         *
         * @link see [thor/params.go](https://github.com/vechain/thor/blob/master/thor/params.go)
         */
        data: '0x00000000000000000000000000000000000000000000000000038d7ea4c68000',
        events: [],
        transfers: [],
        gasUsed: 591,
        reverted: false,
        vmError: ''
    }
]

// 2 - Simulate the transaction
const simulatedTx2 =
    await thorestSoloClient.transactions.simulateTransaction(
        transaction2.clauses
    );

// 3 - Check the result
expect(simulatedTx2[0].gasUsed).toEqual(expected2[0].gasUsed);

```

