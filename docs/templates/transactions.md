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

[example](examples/transactions/sign_decode.ts)

## Example: Multiple Clauses
In VechainThor blockchain a transaction can be composed of multiple clauses. \
Clauses allow to send multiple payloads to different recipients within a single transaction.

[example](examples/transactions/multiple_clauses.ts)

## Example: Fee Delegation
Fee delegation is a feature on the VechainThor blockchain which enables the transaction sender to request another entity, a sponsor, to pay for the transaction fee on the sender's behalf.

[example](examples/transactions/fee_delegation.ts)

## Example: BlockRef and Expiration
Using the _BlockRef_ and _Expiration_ fields a transaction can be set to be processed or expired by a particular block. _BlockRef_ should match the first eight bytes of the ID of the block. The sum of _BlockRef_ and _Expiration_ defines the height of the last block that the transaction can be included.

[example](examples/transactions/blockref_expiration.ts)

## Example: Transaction Dependency
A transaction can be set to only be processed after another transaction, therefore defining an execution order for transactions. The _DependsOn_ field is the Id of the transaction on which the current transaction depends on. If the transaction does not depend on others _DependsOn_ can be set to _null_

[example](examples/transactions/tx_dependency.ts)

## Example: Transaction Simulation
Simulation can be used to check if a transaction will fail before sending it. It can also be used to determine the gas cost of the transaction.
Additional fields are needed in the transaction object for the simulation and these conform to the _SimulateTransactionOptions_ interface.
Note - the result of a transaction might be different depending on the state(block) you are executing against.

[example](examples/transactions/simulation.ts)

## Complete examples
In the following complete examples, we will explore the entire lifecycle of a VechainThor transaction, from building clauses to verifying the transaction on-chain.

1.**No Delegation (Signing Only with an Origin Private Key)**: In this scenario, we'll demonstrate the basic process of creating a transaction, signing it with the origin private key, and sending it to the VechainThor blockchain without involving fee delegation.

[example](examples/transactions/full-flow-no-delegator.ts)

2.**Delegation with Private Key**: Here, we'll extend the previous example by incorporating fee delegation. The transaction sender will delegate the transaction fee payment to another entity (delegator), and we'll guide you through the steps of building, signing, and sending such a transaction.

[example](examples/transactions/full-flow-delegator-private-key.ts)

3.**Delegation with signTransaction Options**: This example will showcase the use of `signTransaction` options for fee delegation. We'll cover the full process, from building clauses to verifying the transaction on-chain.

[example](examples/transactions/full-flow-delegator-signtransaction-options.ts)

By examining these complete examples, developers can gain a comprehensive understanding of transaction handling in the vechain SDK. Each example demonstrates the steps involved in initiating, signing, and sending transactions, as well as the nuances associated with fee delegation.