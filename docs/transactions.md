---
description: Transactions related functions.
---

# Transactions

Vechain SDK provides comprehensive support for handling transactions. Developers can initialize a transaction by assembling the transaction body, adding clauses, and finally signing and sending the transaction. 

> ⚠️ **Warning:**
> All the examples listed below refers to low level transaction building. The Vechain SDK provides you built-in methods to sign and send transactions. Please refer to the contracts section for more information.


To break it down:

1. **Initializing a Transaction**: Developers can create a transaction by specifying the necessary details in the transaction body. This includes setting the chain tag, block reference, expiration, gas price coefficient, gas limit, and other relevant transaction parameters.
2. **Adding Clauses**: Clauses are the individual actions that the transaction will perform on the VeChainThor blockchain. Each clause contains information such as the recipient's address, the amount of VET to be transferred, and additional data, if required.
3. **Signing the Transaction**: After assembling the transaction body with the appropriate clauses, developers can sign the transaction using their private key. Signing the transaction ensures its authenticity and prevents tampering during transmission.

## Example: Signing and Decoding
In this example a simple transaction with a single clause is created, signed, encoded and then decoded

```typescript { name=sign-decode, category=example }
// 1 - Define clauses

const clauses: TransactionClause[] = [
    clauseBuilder.transferVET(
        '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        unitsUtils.parseVET('10000')
    )
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
const privateKey = await secp256k1.generatePrivateKey();

// 4 - Sign transaction

const signedTransaction = TransactionHandler.sign(
    body,
    Buffer.from(privateKey)
);

// 5 - Encode transaction

const encodedRaw = signedTransaction.encoded;

// 6 - Decode transaction

const decodedTx = TransactionHandler.decode(encodedRaw, true);
```

## Example: Multiple Clauses
In VeChainThor blockchain a transaction can be composed of multiple clauses. \
Clauses allow to send multiple payloads to different recipients within a single transaction.

```typescript { name=multiple-clauses, category=example }
// 1 - Define multiple clauses

const clauses: TransactionClause[] = [
    clauseBuilder.transferVET(
        '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        unitsUtils.parseVET('10000')
    ),
    clauseBuilder.transferToken(
        VTHO_ADDRESS,
        '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        unitsUtils.parseUnits('10000', 18) // 10000 VTHO
    )
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
const privateKey = await secp256k1.generatePrivateKey();

// 4 - Sign transaction

const signedTransaction = TransactionHandler.sign(
    body,
    Buffer.from(privateKey)
);

// 5 - Encode transaction

const encodedRaw = signedTransaction.encoded;

// 6 - Decode transaction

const decodedTx = TransactionHandler.decode(encodedRaw, true);
```

## Example: Fee Delegation
Fee delegation is a feature on the VeChainThor blockchain which enables the transaction sender to request another entity, a sponsor, to pay for the transaction fee on the sender's behalf.

```typescript { name=fee-delegation, category=example }
// Sender account with private key
const senderAccount = {
    privateKey:
        'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26',
    address: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
};

// 1 - Create thor client for solo network
const thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL, {
    isPollingEnabled: false
});

// 2 - Define clause and estimate gas

const clauses: TransactionClause[] = [
    clauseBuilder.transferVET(
        '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        unitsUtils.parseVET('10000')
    )
];

// Get gas estimate
const gasResult = await thorSoloClient.gas.estimateGas(
    clauses,
    senderAccount.address
);

// 3 - Define transaction body

const body: TransactionBody = {
    chainTag: networkInfo.mainnet.chainTag,
    blockRef: '0x0000000000000000',
    expiration: 0,
    clauses,
    gasPriceCoef: 0,
    gas: gasResult.totalGas,
    dependsOn: null,
    nonce: 1,
    reserved: {
        features: 1 // set the transaction to be delegated
    }
};

// 4 - Create private keys of sender and delegate

const nodeDelegate = HDKey.fromMnemonic(Mnemonic.of());
const delegatorPrivateKey = nodeDelegate.privateKey;

// 5 - Get address of delegate

const delegatorAddress = Address.ofPublicKey(nodeDelegate.publicKey).toString();

// 6 - Sign transaction as sender and delegate

const signedTransaction = TransactionHandler.signWithDelegator(
    body,
    Buffer.from(senderAccount.privateKey, 'hex'),
    Buffer.from(delegatorPrivateKey)
);

// 7 - Encode transaction

const encodedRaw = signedTransaction.encoded;

// 8 - Decode transaction and check

const decodedTx = TransactionHandler.decode(encodedRaw, true);
```

## Example: BlockRef and Expiration
Using the _BlockRef_ and _Expiration_ fields a transaction can be set to be processed or expired by a particular block. _BlockRef_ should match the first eight bytes of the ID of the block. The sum of _BlockRef_ and _Expiration_ defines the height of the last block that the transaction can be included.

```typescript { name=blockref-expiration, category=example }
// 1 - Define clauses

const clauses: TransactionClause[] = [
    clauseBuilder.transferVET(
        '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        unitsUtils.parseVET('1000')
    )
];

// 2 - Define transaction body

const body: TransactionBody = {
    chainTag: networkInfo.mainnet.chainTag,
    blockRef: '0x00ffecb8ac3142c4', // first 8 bytes of block id from block #16772280
    expiration: 32, // tx will expire after block #16772280 + 32
    clauses,
    gasPriceCoef: 0,
    gas: TransactionUtils.intrinsicGas(clauses), // use thor.gas.estimateGas() for better estimation
    dependsOn: null,
    nonce: 1
};

// 3 - Create private key

const privateKey = await secp256k1.generatePrivateKey();

// 4 - Sign transaction

const signedTransaction = TransactionHandler.sign(
    body,
    Buffer.from(privateKey)
);

// 5 - Encode transaction

const encodedRaw = signedTransaction.encoded;

// 6 - Decode transaction and check

const decodedTx = TransactionHandler.decode(encodedRaw, true);
```

## Example: Transaction Dependency
A transaction can be set to only be processed after another transaction, therefore defining an execution order for transactions. The _DependsOn_ field is the Id of the transaction on which the current transaction depends on. If the transaction does not depend on others _DependsOn_ can be set to _null_

```typescript { name=tx-dependency, category=example }
// 1 - Define transaction clauses

const txAClauses: TransactionClause[] = [
    clauseBuilder.transferVET(
        '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        unitsUtils.parseVET('1000')
    )
];
const txBClauses: TransactionClause[] = [
    clauseBuilder.transferVET(
        '0x7ccadeea14dd6727845b58f8aa7aad0f41a002a2',
        unitsUtils.parseVET('1')
    )
];

// 2 - Define transaction A with no dependencies

// @NOTE: This transaction has nonce = 1
const txABody: TransactionBody = {
    chainTag: networkInfo.mainnet.chainTag,
    blockRef: '0x0000000000000000',
    expiration: 0,
    clauses: txAClauses,
    gasPriceCoef: 0,
    gas: TransactionUtils.intrinsicGas(txAClauses), // use thor.gas.estimateGas() for better estimation
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
    gas: TransactionUtils.intrinsicGas(txBClauses), // use thor.gas.estimateGas() for better estimation
    dependsOn: null,
    nonce: 2
};

// Define the senders private key
const senderPrivateKey = await secp256k1.generatePrivateKey();

// To define transaction B as dependant on transaction A
// We need to sign transaction A, and then get its Id
// and set that Id into transaction B's dependsOn field

// 4 - Get Tx A id

const txASigned = TransactionHandler.sign(
    txABody,
    Buffer.from(senderPrivateKey)
);

// 5 - Set it inside tx B

txBBody.dependsOn = txASigned.id;

// 6 - Sign Tx B

const txBSigned = TransactionHandler.sign(
    txBBody,
    Buffer.from(senderPrivateKey)
);

// 7 - encode Tx B

const rawTxB = txBSigned.encoded;

// Check (we can decode Tx B)
const decodedTx = TransactionHandler.decode(rawTxB, true);
```

## Example: Transaction Simulation
Simulation can be used to check if a transaction will fail before sending it. It can also be used to determine the gas cost of the transaction.
Additional fields are needed in the transaction object for the simulation and these conform to the _SimulateTransactionOptions_ interface.
Note - the result of a transaction might be different depending on the state(block) you are executing against.

```typescript { name=simulation, category=example }
// In this example we simulate a transaction of sending 1 VET to another account
// And we demonstrate (1) how we can check the expected gas cost and (2) whether the transaction is successful

// 1 - Create thor client for solo network
const thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL);

// 2(a) - create the transaction for a VET transfer
const transaction1 = {
    clauses: [
        clauseBuilder.transferVET(
            '0xb717b660cd51109334bd10b2c168986055f58c1a',
            unitsUtils.parseVET('1')
        )
    ],
    // Please note - this field one of the optional fields that may be passed (see SimulateTransactionOptions),
    // and is only required if you want to simulate a transaction
    simulateTransactionOptions: {
        caller: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
    }
};

// 3 - Simulate the transaction
const simulatedTx1 = await thorSoloClient.transactions.simulateTransaction(
    transaction1.clauses,
    {
        ...transaction1.simulateTransactionOptions
    }
);

// In this next example we simulate a Simulate smart contract deployment
// And we demonstrate how we can check the expected gas cost and whether the transaction would succeed

// 1(a) - create the transaction to simulate a smart deployment
const transaction2 = {
    clauses: [
        {
            to: null,
            value: '0',
            /**
             * Sample contract bytecode (Without constructor arguments)
             *
             * @remarks - When deploying a contract that requires constructor arguments, the encoded constructor must be appended to the bytecode
             *            Otherwise the contract might revert if the constructor arguments are required.
             */
            data: '0x60806040526040518060400160405280600681526020017f48656c6c6f210000000000000000000000000000000000000000000000000000815250600090816200004a9190620002d9565b503480156200005857600080fd5b50620003c0565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620000e157607f821691505b602082108103620000f757620000f662000099565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620001617fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000122565b6200016d868362000122565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620001ba620001b4620001ae8462000185565b6200018f565b62000185565b9050919050565b6000819050919050565b620001d68362000199565b620001ee620001e582620001c1565b8484546200012f565b825550505050565b600090565b62000205620001f6565b62000212818484620001cb565b505050565b5b818110156200023a576200022e600082620001fb565b60018101905062000218565b5050565b601f82111562000289576200025381620000fd565b6200025e8462000112565b810160208510156200026e578190505b620002866200027d8562000112565b83018262000217565b50505b505050565b600082821c905092915050565b6000620002ae600019846008026200028e565b1980831691505092915050565b6000620002c983836200029b565b9150826002028217905092915050565b620002e4826200005f565b67ffffffffffffffff8111156200030057620002ff6200006a565b5b6200030c8254620000c8565b620003198282856200023e565b600060209050601f8311600181146200035157600084156200033c578287015190505b620003488582620002bb565b865550620003b8565b601f1984166200036186620000fd565b60005b828110156200038b5784890151825560018201915060208501945060208101905062000364565b86831015620003ab5784890151620003a7601f8916826200029b565b8355505b6001600288020188555050505b505050505050565b61081480620003d06000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80631718ad881461004657806319ff1d211461007657806349da5de414610094575b600080fd5b610060600480360381019061005b91906102c1565b6100b0565b60405161006d919061037e565b60405180910390f35b61007e6101b5565b60405161008b919061037e565b60405180910390f35b6100ae60048036038101906100a99190610405565b610243565b005b606081600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610122576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101199061049e565b60405180910390fd5b6000805461012f906104ed565b80601f016020809104026020016040519081016040528092919081815260200182805461015b906104ed565b80156101a85780601f1061017d576101008083540402835291602001916101a8565b820191906000526020600020905b81548152906001019060200180831161018b57829003601f168201915b5050505050915050919050565b600080546101c2906104ed565b80601f01602080910402602001604051908101604052809291908181526020018280546101ee906104ed565b801561023b5780601f106102105761010080835404028352916020019161023b565b820191906000526020600020905b81548152906001019060200180831161021e57829003601f168201915b505050505081565b81816000918261025492919061070e565b505050565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061028e82610263565b9050919050565b61029e81610283565b81146102a957600080fd5b50565b6000813590506102bb81610295565b92915050565b6000602082840312156102d7576102d6610259565b5b60006102e5848285016102ac565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561032857808201518184015260208101905061030d565b60008484015250505050565b6000601f19601f8301169050919050565b6000610350826102ee565b61035a81856102f9565b935061036a81856020860161030a565b61037381610334565b840191505092915050565b600060208201905081810360008301526103988184610345565b905092915050565b600080fd5b600080fd5b600080fd5b60008083601f8401126103c5576103c46103a0565b5b8235905067ffffffffffffffff8111156103e2576103e16103a5565b5b6020830191508360018202830111156103fe576103fd6103aa565b5b9250929050565b6000806020838503121561041c5761041b610259565b5b600083013567ffffffffffffffff81111561043a5761043961025e565b5b610446858286016103af565b92509250509250929050565b7f496e76616c696420616464726573730000000000000000000000000000000000600082015250565b6000610488600f836102f9565b915061049382610452565b602082019050919050565b600060208201905081810360008301526104b78161047b565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061050557607f821691505b602082108103610518576105176104be565b5b50919050565b600082905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026105ba7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8261057d565b6105c4868361057d565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600061060b610606610601846105dc565b6105e6565b6105dc565b9050919050565b6000819050919050565b610625836105f0565b61063961063182610612565b84845461058a565b825550505050565b600090565b61064e610641565b61065981848461061c565b505050565b5b8181101561067d57610672600082610646565b60018101905061065f565b5050565b601f8211156106c25761069381610558565b61069c8461056d565b810160208510156106ab578190505b6106bf6106b78561056d565b83018261065e565b50505b505050565b600082821c905092915050565b60006106e5600019846008026106c7565b1980831691505092915050565b60006106fe83836106d4565b9150826002028217905092915050565b610718838361051e565b67ffffffffffffffff81111561073157610730610529565b5b61073b82546104ed565b610746828285610681565b6000601f8311600181146107755760008415610763578287013590505b61076d85826106f2565b8655506107d5565b601f19841661078386610558565b60005b828110156107ab57848901358255600182019150602085019450602081019050610786565b868310156107c857848901356107c4601f8916826106d4565b8355505b6001600288020188555050505b5050505050505056fea2646970667358221220131b1aac58b5047d715ef4f6d1b050c9a836905c50de69cf41edc485446e5f5f64736f6c63430008110033'
        }
    ]
};

// 2 - Simulate the transaction
const simulatedTx2 = await thorSoloClient.transactions.simulateTransaction(
    transaction2.clauses
);
```

## Complete examples
In the following complete examples, we will explore the entire lifecycle of a VeChainThor transaction, from building clauses to verifying the transaction on-chain.

1. **No Delegation (Signing Only with an Origin Private Key)**: In this scenario, we'll demonstrate the basic process of creating a transaction, signing it with the origin private key, and sending it to the VeChainThor blockchain without involving fee delegation.

```typescript { name=full-flow-no-delegator, category=example }
import { expect } from 'expect';

// START_SNIPPET: FullFlowNoDelegatorSnippet

// 1 - Create the thor client
const thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL, {
    isPollingEnabled: false
});

// Sender account with private key
const senderAccount: { privateKey: string; address: string } = {
    privateKey:
        'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26',
    address: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
};

// Create the provider (used in this case to sign the transaction with getSigner() method)
const provider = new VeChainProvider(
    // Thor client used by the provider
    thorSoloClient,

    // Internal wallet used by the provider (needed to call the getSigner() method)
    new ProviderInternalBaseWallet([
        {
            privateKey: Buffer.from(senderAccount.privateKey, 'hex'),
            address: senderAccount.address
        }
    ]),

    // Disable fee delegation (BY DEFAULT IT IS DISABLED)
    false
);

// 2 - Create the transaction clauses
const transaction = {
    clauses: [
        clauseBuilder.transferVET(
            '0xb717b660cd51109334bd10b2c168986055f58c1a',
            unitsUtils.parseVET('1')
        )
    ],
    simulateTransactionOptions: {
        caller: senderAccount.address
    }
};

// 3 - Estimate gas
const gasResult = await thorSoloClient.gas.estimateGas(
    transaction.clauses,
    transaction.simulateTransactionOptions.caller
);

// 4 - Build transaction body
const txBody = await thorSoloClient.transactions.buildTransactionBody(
    transaction.clauses,
    gasResult.totalGas
);

// 4 - Sign the transaction
const signer = await provider.getSigner(senderAccount.address);

const rawSignedTransaction = await signer.signTransaction(
    signerUtils.transactionBodyToTransactionRequestInput(
        txBody,
        senderAccount.address
    )
);

const signedTransaction = TransactionHandler.decode(
    Buffer.from(rawSignedTransaction.slice(2), 'hex'),
    true
);

// 5 - Send the transaction
const sendTransactionResult =
    await thorSoloClient.transactions.sendTransaction(signedTransaction);

// 6 - Wait for transaction receipt
const txReceipt = await thorSoloClient.transactions.waitForTransaction(
    sendTransactionResult.id
);
```

2. **Delegation with Private Key**: Here, we'll extend the previous example by incorporating fee delegation. The transaction sender will delegate the transaction fee payment to another entity (delegator), and we'll guide you through the steps of building, signing, and sending such a transaction.

```typescript { name=full-flow-delegator-private-key, category=example }
import { expect } from 'expect';

// START_SNIPPET: FullFlowDelegatorPrivateKeySnippet

// 1 - Create the thor client
const thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL, {
    isPollingEnabled: false
});

// Sender account with private key
const senderAccount: { privateKey: string; address: string } = {
    privateKey:
        'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26',
    address: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
};

// Delegator account with private key
const delegatorAccount: { privateKey: string; address: string } = {
    privateKey:
        '521b7793c6eb27d137b617627c6b85d57c0aa303380e9ca4e30a30302fbc6676',
    address: '0x062F167A905C1484DE7e75B88EDC7439f82117DE'
};

// Create the provider (used in this case to sign the transaction with getSigner() method)
const providerWithDelegationEnabled = new VeChainProvider(
    // Thor client used by the provider
    thorSoloClient,

    // Internal wallet used by the provider (needed to call the getSigner() method)
    new ProviderInternalBaseWallet(
        [
            {
                privateKey: Buffer.from(senderAccount.privateKey, 'hex'),
                address: senderAccount.address
            }
        ],
        {
            delegator: {
                delegatorPrivateKey: delegatorAccount.privateKey
            }
        }
    ),

    // Enable fee delegation
    true
);

// 2 - Create the transaction clauses
const transaction = {
    clauses: [
        clauseBuilder.transferVET(
            '0xb717b660cd51109334bd10b2c168986055f58c1a',
            unitsUtils.parseVET('1')
        )
    ],
    simulateTransactionOptions: {
        caller: senderAccount.address
    }
};

// 3 - Estimate gas
const gasResult = await thorSoloClient.gas.estimateGas(
    transaction.clauses,
    transaction.simulateTransactionOptions.caller
);

// 4 - Build transaction body
const txBody = await thorSoloClient.transactions.buildTransactionBody(
    transaction.clauses,
    gasResult.totalGas,
    {
        isDelegated: true
    }
);

// 4 - Sign the transaction
const signer = await providerWithDelegationEnabled.getSigner(
    senderAccount.address
);

const rawDelegateSigned = await signer.signTransaction(
    signerUtils.transactionBodyToTransactionRequestInput(
        txBody,
        senderAccount.address
    )
);

const delegatedSigned = TransactionHandler.decode(
    Buffer.from(rawDelegateSigned.slice(2), 'hex'),
    true
);

// 5 - Send the transaction
const sendTransactionResult =
    await thorSoloClient.transactions.sendTransaction(delegatedSigned);

// 6 - Wait for transaction receipt
const txReceipt = await thorSoloClient.transactions.waitForTransaction(
    sendTransactionResult.id
);
```

3. **Delegation with URL**: This example will showcase the use of a delegation URL for fee delegation. The sender will specify a delegation URL in the `signTransaction` options, allowing a designated sponsor to pay the transaction fee. We'll cover the full process, from building clauses to verifying the transaction on-chain.

```typescript { name=full-flow-delegator-url, category=example }
import { expect } from 'expect';

// START_SNIPPET: FullFlowDelegatorUrlSnippet

// 1 - Create the thor client
const thorClient = ThorClient.fromUrl(TESTNET_URL, {
    isPollingEnabled: false
});

// Sender account with private key
const senderAccount: {
    mnemonic: string;
    privateKey: string;
    address: string;
} = {
    mnemonic:
        'fat draw position use tenant force south job notice soul time fruit',
    privateKey:
        '2153c1e49c14d92e8b558750e4ec3dc9b5a6ac4c13d24a71e0fa4f90f4a384b5',
    address: '0x571E3E1fBE342891778151f037967E107fb89bd0'
};

// Delegator account with private key
const delegatorAccount = {
    URL: 'https://sponsor-testnet.vechain.energy/by/269'
};

// Create the provider (used in this case to sign the transaction with getSigner() method)
const providerWithDelegationEnabled = new VeChainProvider(
    // Thor client used by the provider
    thorClient,

    // Internal wallet used by the provider (needed to call the getSigner() method)
    new ProviderInternalBaseWallet(
        [
            {
                privateKey: Buffer.from(senderAccount.privateKey, 'hex'),
                address: senderAccount.address
            }
        ],
        {
            delegator: {
                delegatorUrl: delegatorAccount.URL
            }
        }
    ),

    // Enable fee delegation
    true
);

// 2 - Create the transaction clauses
const transaction = {
    clauses: [
        clauseBuilder.transferVET(
            '0xb717b660cd51109334bd10b2c168986055f58c1a',
            unitsUtils.parseVET('1')
        )
    ],
    simulateTransactionOptions: {
        caller: senderAccount.address
    }
};

// 3 - Estimate gas
const gasResult = await thorClient.gas.estimateGas(
    transaction.clauses,
    senderAccount.address
);

// 4 - Build transaction body
const txBody = await thorClient.transactions.buildTransactionBody(
    transaction.clauses,
    gasResult.totalGas,
    {
        isDelegated: true
    }
);

// 4 - Sign the transaction
const signer = await providerWithDelegationEnabled.getSigner(
    senderAccount.address
);

const rawDelegateSigned = await signer.signTransaction(
    signerUtils.transactionBodyToTransactionRequestInput(
        txBody,
        senderAccount.address
    )
);

const delegatedSigned = TransactionHandler.decode(
    Buffer.from(rawDelegateSigned.slice(2), 'hex'),
    true
);

// 5 - Send the transaction
const sendTransactionResult =
    await thorClient.transactions.sendTransaction(delegatedSigned);

// 6 - Wait for transaction receipt
const txReceipt = await thorClient.transactions.waitForTransaction(
    sendTransactionResult.id
);
```

By examining these complete examples, developers can gain a comprehensive understanding of transaction handling in the VeChain SDK. Each example demonstrates the steps involved in initiating, signing, and sending transactions, as well as the nuances associated with fee delegation.

# Errors handling on transactions
You can find the transaction revert reason by using `getRevertReason` method with the transaction hash.

```typescript { name=revert-reason, category=example }
// Define transaction id's
const transactionHash =
    '0x0a5177fb83346bb6ff7ca8408889f0c99f44b2b1b5c8bf6f0eb53c4b2e81d98d';

// Get the revert reason
const revertReason =
    await thorClient.transactions.getRevertReason(transactionHash);
console.log(revertReason);
```

This method will return the revert reason of the transaction if it failed, otherwise it will return `null`.

### Decoding revert reason when simulating a transaction
Even when using the `simulateTransaction` method you can find the revert reason.

```typescript { name=revert-reason-with-simulation, category=example }
const simulatedTx: TransactionSimulationResult[] =
    await thorSoloClient.transactions.simulateTransaction([
        {
            to: '0x0000000000000000000000000000456e65726779',
            value: '0',
            data: coder.encodeFunctionInput(energy_abi, 'transfer', [
                '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
                unitsUtils.parseVET('1000000000')
            ])
        }
    ]);

const revertReason = await thorSoloClient.transactions.decodeRevertReason(
    simulatedTx[0].data
);
```

In this case there is only a `TransactionSimulationResult`, so no need to loop.
