# VeChain Contracts Interaction

The following sections provide detailed information on interacting with VeChain smart contracts using the VeChain SDK.

## Building clauses


VeChain uses clauses to interact with smart contracts. A clause is a single operation that can be executed on the blockchain. The VeChain SDK provides a `ClauseBuilder` class to create clauses for various operations.



> ⚠️ **Warning:**
> To execute the clauses, you need to build a transaction and sign it with a wallet. The signed transaction can then be sent to the blockchain. This process is covered ahead in the documentation.

### Transfer VET and VTHO clauses

The following example shows you how to build clauses to transfer the two main token of VeChain, the token VET and the energy token VTHO (the one used to pay for transaction fees)

```typescript { name=contract-clauses, category=example }
import {
    Address,
    Clause,
    Units,
    VET,
    VTHO,
    VTHO_ADDRESS
} from '@vechain/sdk-core';

// build some example clauses

// 1. Transfer vet

const transferVetClause = Clause.transferVET(
    Address.of('0xf02f557c753edf5fcdcbfe4c1c3a448b3cc84d54'),
    VET.of(300n, Units.wei)
);

// 2. Transfer VTHO

const transferVTHOClause = Clause.transferVTHOToken(
    Address.of('0xf02f557c753edf5fcdcbfe4c1c3a448b3cc84d54'),
    VTHO.of(300n, Units.wei)
);

```

### Deploying a Smart Contract Clause

#### Steps:

1. **Clause Construction**: Use `clauseBuilder.deployContract` from `@vechain/sdk-core` to construct a deployment clause.
2. **Smart Contract Bytecode**: Pass the compiled contract's bytecode to deploy it.
3. **Clause Building**: create the deployment clause

```typescript { name=contract-deploy, category=example }
// 1 - Init contract bytecode to deploy

const contractBytecode = HexUInt.of(
    '0x608060405234801561000f575f80fd5b506101438061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c806360fe47b1146100385780636d4ce63c14610054575b5f80fd5b610052600480360381019061004d91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea2646970667358221220427ff5682ef89b62b910bb1286c1028d32283512122854159ad59f1c71fb6d8764736f6c63430008160033'
);

// 2 - Create a clause to deploy the contract
const clause = Clause.deployContract(contractBytecode);
```

### Calling a Contract Function Clause

### Steps:

1. **Understand the ABI**: The ABI (JSON format) defines contract functions and parameters.
2. **Clause Creation**: Use `clauseBuilder.functionInteraction` to create a clause for function calls.
3. **Clause Building**: Build the clause, e.g., calling `setValue(123)` to modify the contract state.

```typescript { name=contract-function-call, category=example }
// 1 - Init a simple contract ABI
const contractABI = [
    {
        constant: false,
        inputs: [
            {
                name: 'value',
                type: 'uint256'
            }
        ],
        name: 'setValue',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'getValue',
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
] as const;

// 2 - Create a clause to call setValue(123)
const clause = Clause.callFunction(
    Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'), // just a sample deployed contract address
    ABIContract.ofAbi(contractABI).getFunction('setValue'),
    [123]
);
```


or you can load the contract using the thor client and then you can build the clause using the contract object.

```typescript { name=contract-function-call, category=example }
// 1 - Build the thor client and load the contract

const thorSoloClient = ThorClient.at(THOR_SOLO_URL);

const contract = thorSoloClient.contracts.load(
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
    contractABI
);

// 2 - Create a clause to call setValue(123)
const setValueClause = contract.clause.setValue(123);
```


## Multi-Clause Contract Interaction

Now that we have seen how to build clauses, let's see how to send it to the blockchain. VeChain allows multiple clauses in a single transaction, enabling interactions with multiple contracts or operations.

### Multiple Clauses in a Single Transaction

In the following example we will see how to execute multiple read operations to get information regarding a deployed ERC20 token contract.

```typescript { name=contract-create-erc20-token, category=example }
// Reading data from multiple clauses in a single call
const multipleClausesResult =
    await thorSoloClient.contracts.executeMultipleClausesCall([
        contract.clause.totalSupply(),
        contract.clause.name(),
        contract.clause.symbol(),
        contract.clause.decimals()
    ]);

expect(multipleClausesResult[0]).toEqual({
    success: true,
    result: {
        plain: expectedBalance,
        array: [expectedBalance]
    }
});
expect(multipleClausesResult[1]).toEqual({
    success: true,
    result: {
        plain: 'SampleToken',
        array: ['SampleToken']
    }
});
expect(multipleClausesResult[2]).toEqual({
    success: true,
    result: {
        plain: 'ST',
        array: ['ST']
    }
});
expect(multipleClausesResult[3]).toEqual({
    success: true,
    result: {
        plain: 18,
        array: [18]
    }
});
```

> ⚠️ **Warning:**
> The example above shows a multi clause read call. It's also possible to execute multi clause transactions with the method executeMultipleClausesTransaction, but you need to build a signer first. Please refer to the signer section for more information


## Commenting Contract Invocations

Add comments to operations when using wallets, helping users understand transaction details during signing.

```typescript { name=contract-transfer-erc20-token, category=example }
// Transfer tokens to another address with a comment

await contract.transact.transfer(
    { comment: 'Transferring 100 ERC20 tokens' },
    '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
    Units.parseEther('100').bi
);
```

## Specifying Revisions in Read Functions

You can specify revisions (`best` or `finalized`) for read functions, similar to adding comments.

## Delegating a Contract Call

VeChain supports delegated contract calls where fees are paid by the gas-payer.

```typescript { name=contract-delegation-erc20, category=example }
const thorSoloClient = ThorClient.at(THOR_SOLO_URL);
const provider = new VeChainProvider(
    thorSoloClient,
    new ProviderInternalBaseWallet([deployerAccount], {
        // The term `gasPayer` will be deprecated soon and renamed `gasPayer`.
        delegator: {
            delegatorPrivateKey: gasPayerAccount.privateKey
        }
    }),
    true
);
const signer = await provider.getSigner(deployerAccount.address);

// Defining a function for deploying the ERC20 contract
const setupERC20Contract = async (): Promise<Contract<typeof ERC20_ABI>> => {
    const contractFactory = thorSoloClient.contracts.createContractFactory(
        ERC20_ABI,
        erc20ContractBytecode,
        signer
    );

    // Deploying the contract
    await contractFactory.startDeployment();

    // Waiting for the contract to be deployed
    return await contractFactory.waitForDeployment();
};

// Setting up the ERC20 contract and getting its address
const contract = await setupERC20Contract();

// Transferring 10000 tokens to another address with a delegated transaction
const transferResult = await contract.transact.transfer(
    '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
    10000n
);

// Wait for the transfer transaction to complete and obtain its receipt
const transactionReceiptTransfer = await transferResult.wait();

// Asserting that the transaction has not been reverted
expect(transactionReceiptTransfer.reverted).toEqual(false);
```

