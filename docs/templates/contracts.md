# VeChain Contracts Interaction

The following sections provide detailed information on interacting with VeChain smart contracts using the VeChain SDK.

## Building clauses


VeChain uses clauses to interact with smart contracts. A clause is a single operation that can be executed on the blockchain. The VeChain SDK provides a `ClauseBuilder` class to create clauses for various operations.



> ⚠️ **Warning:**
> To execute the clauses, you need to build a transaction and sign it with a wallet. The signed transaction can then be sent to the blockchain. This process is covered ahead in the documentation.


### Deploying a Smart Contract Clause

#### Steps:

1. **Clause Construction**: Use `clauseBuilder.deployContract` from `@vechain/sdk-core` to construct a deployment clause.
2. **Smart Contract Bytecode**: Pass the compiled contract's bytecode to deploy it.
3. **Clause Building**: create the deployment clause

[ContractDeploySnippet](examples/contracts/contract-deploy.ts)

### Calling a Contract Function Clause

### Steps:

1. **Understand the ABI**: The ABI (JSON format) defines contract functions and parameters.
2. **Clause Creation**: Use `clauseBuilder.functionInteraction` to create a clause for function calls.
3. **Clause Building**: Build the clause, e.g., calling `setValue(123)` to modify the contract state.

[ContractFunctionCallSnippet](examples/contracts/contract-function-call.ts)


or you can load the contract using the thor client and then you can build the clause using the contract object.

[ContractObjectFunctionCallSnippet](examples/contracts/contract-function-call.ts)


## Multi-Clause Contract Interaction

Now that we have seen how to build a clause, let's see how to send it to the blockchain. Vechain allows multiple clauses in a single transaction, enabling interactions with multiple contracts or operations.

### Multiple Clauses in a Single Transaction

In the following example we will see how to execute multiple read operations to get information regarding a deployed ERC20 token contract.

[ERC20MultiClausesReadSnippet](examples/contracts/contract-create-ERC20-token.ts)

## Multi-Clause Event Filtering

Filter events from different contracts in a single call using contract addresses and event signatures.

[ERC20FilterMultipleEventCriteriaSnippet](examples/contracts/contract-event-filter.ts)

### Grouping Events by Topic Hash

Use `filterGroupedEventLogs` to group events by topic hash, useful for categorizing events. The result is an array of arrays, one for each criterion.

[ERC20FilterGroupedMultipleEventCriteriaSnippet](examples/contracts/contract-event-filter.ts)



## Commenting Contract Invocations

Add comments to operations when using wallets, helping users understand transaction details during signing.

[TransferCommentSnippet](examples/contracts/contract-transfer-ERC20-token.ts)

## Specifying Revisions in Read Functions

You can specify revisions (`best` or `finalized`) for read functions, similar to adding comments.

## Delegating a Contract Call

VeChain supports delegated contract calls where fees are paid by the delegator.

[ERC20FunctionCallDelegatedSnippet](examples/contracts/contract-delegation-ERC20.ts)
