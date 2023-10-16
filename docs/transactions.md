---
description: Transactions related functions.
---

# Transactions

VeChain SDK provides comprehensive support for handling transactions. Developers can initialize a transaction by assembling the transaction body, adding clauses, and finally signing the transaction. However, it's important to note that VeChain SDK primarily focuses on the offline part of transaction handling, meaning you can create and prepare the transaction locally.

To break ti down:

1. **Initializing a Transaction**: Developers can create a transaction by specifying the necessary details in the transaction body. This includes setting the chain tag, block reference, expiration, gas price coefficient, gas limit, and other relevant transaction parameters.
2. **Adding Clauses**: Clauses are the individual actions that the transaction will perform on the VechainThor blockchain. Each clause contains information such as the recipient's address, the amount of VET to be transferred, and additional data, if required.
3. **Signing the Transaction**: After assembling the transaction body with the appropriate clauses, developers can sign the transaction using their private key. Signing the transaction ensures its authenticity and prevents tampering during transmission.

While VeChain SDK is responsible for the offline part of transaction handling, it does **NOT** directly handle broadcasting the transaction to the VechainThor network.&#x20;

For this purpose, developers have two options:

* **Connex**: Connex is a JavaScript library provided by vechain that allows developers to interact with the VechainThor blockchain and broadcast transactions directly from the browser or a VechainThor decentralized application (dApp). It provides a convenient way to connect to the network and submit transactions online.
* **REST API with a Thor Node**: Developers can also use the REST API provided by a Thor node to send signed transactions to the VechainThor blockchain. By sending the transaction data to a running Thor node's REST API, the transaction can be broadcast to the network and executed on the blockchain.

By using VeChain SDK in combination with Connex or the Thor node's REST API, developers can perform both the offline and online parts of the transaction process, enabling them to create and execute secure and reliable transactions on the VechainThor blockchain.

```javascript
import { Transaction, secp256k1, mnemonic } from 'thor-devkit'

// Clauses of transsction
const clauses =  [{
    to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
    value: 10000,
    data: '0x'
}]

// Calc intrinsic gas
const gas = Transaction.intrinsicGas(clauses)

// Body of transaction
let body = {
    chainTag: 0x9a,
    blockRef: '0x0000000000000000',
    expiration: 32,
    clauses: clauses,
    gasPriceCoef: 128,
    gas,
    dependsOn: null,
    nonce: 12345678
}

// Create private key

// BIP 39
// const words = mnemonic.generate()
// const privateKey = mnemonic.derivePrivateKey(words)

// Secp256k1
const privateKey = secp256k1.generatePrivateKey()

// ...

// Sign transaction
const tx = new Transaction(body)
const signingHash = tx.signingHash()
tx.signature = secp256k1.sign(signingHash, privateKey)

// Get raw transaction (encode and decode operations)
const raw = tx.encode()
const decoded = Transaction.decode(raw)
console.log(decoded)
// {
//     chainTag: 154,
//     blockRef: '0x0000000000000000',
//     expiration: 32,
//     ...
// }
```