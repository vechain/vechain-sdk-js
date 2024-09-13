# Contracts in vechain

This document provides a comprehensive guide on constructing contract transactions using the VeChain SDK, specifically focusing on deploying smart contracts and calling contract functions. The aim is to furnish developers with the knowledge to seamlessly integrate these transactions into their blockchain applications on vechain.

## Deploying a Smart Contract

### Overview

Deploying a smart contract is a foundational step in leveraging the VeChain blockchain for decentralized applications. This section delves into the process of creating a deployment clause, which is essential for initiating a smart contract on the network.

```typescript { name=contract-deploy, category=example }
// 1 - Init contract bytecode to deploy

const contractBytecode =
    '0x608060405234801561000f575f80fd5b506101438061001d5f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c806360fe47b1146100385780636d4ce63c14610054575b5f80fd5b610052600480360381019061004d91906100ba565b610072565b005b61005c61007b565b60405161006991906100f4565b60405180910390f35b805f8190555050565b5f8054905090565b5f80fd5b5f819050919050565b61009981610087565b81146100a3575f80fd5b50565b5f813590506100b481610090565b92915050565b5f602082840312156100cf576100ce610083565b5b5f6100dc848285016100a6565b91505092915050565b6100ee81610087565b82525050565b5f6020820190506101075f8301846100e5565b9291505056fea2646970667358221220427ff5682ef89b62b910bb1286c1028d32283512122854159ad59f1c71fb6d8764736f6c63430008160033';

// 2 - Create a clause to deploy the contract
const clause = clauseBuilder.deployContract(contractBytecode);
```

### Process Breakdown

1. **Clause Construction**: The deployment of a smart contract begins with the construction of a deployment clause. The VeChain SDK offers a dedicated function, `clauseBuilder.deployContract`, found within the `@vechain/sdk-core` package, for this purpose.

2. **Smart Contract Bytecode**: The bytecode of the smart contract, contained within the `contractBytecode` variable, encapsulates the compiled contract code that will be deployed to the blockchain.

3. **Invocation**: By invoking the `clauseBuilder.deployContract` function with the contract's bytecode, a clause object is generated. This clause object is a structured representation of the deployment request, ready to be broadcast to the VeChain network.

### Conclusion

The deployment example elucidates the utilization of the VeChain SDK to construct a deployment clause, a crucial component for deploying smart contracts on the VeChain blockchain.

## Calling a Contract Function

### Overview

After deploying a smart contract, interacting with its functions is the next step. This section guides you through the creation of a clause tailored for calling a specific function within a deployed smart contract.

```typescript { name=contract-function-call, category=example }
// 1 - Init a simple contract ABI
const contractABI = stringifyData([
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
]);

// 2 - Create a clause to call setValue(123)
const clause = clauseBuilder.functionInteraction(
    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', // just a sample deployed contract address
    coder
        .createInterface(contractABI)
        .getFunction('setValue') as FunctionFragment,
    [123]
);
```

### Process Breakdown

1. **Understanding the ABI**: The ABI (Application Binary Interface) of the smart contract, usually defined in JSON format, describes the contract's functions and their respective parameters. This interface is pivotal for ensuring proper interaction with the contract's functions.

2. **Clause Creation for Function Calls**: Utilizing the `clauseBuilder.functionInteraction` function from the `@vechain/sdk-core` package, a clause is crafted for the specific purpose of invoking a function on the smart contract.

3. **Function Invocation**: In this example, the function `setValue` within the smart contract is invoked with a parameter of `123`. This action demonstrates how to interact with a function, altering the state within the smart contract based on the function's logic.

## Commenting Contract Invocations

### Overview

When using the SDK with wallets, adding comments to operations can be beneficial. These comments inform users who are signing transactions about the nature and purpose of the transactions they are authorizing.

Below is an example of how to add comments to operations:

```typescript { name=contract-transfer-erc20-token, category=example }
// Transfer tokens to another address with a comment

await contract.transact.transfer(
    { comment: 'Transferring 100 ERC20 tokens' },
    '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
    Units.parseEther('100').bi
);
```

## Adding revision on read functions

### Overview

If you want to specify the revision on read functions, you can do it in the same way as adding a comment. Instead of a comment, specify the revision. You can use 'best' or 'finalized' as the revision options.

### Conclusion

This section highlights the methodology for constructing a clause that facilitates interaction with a deployed smart contract's functions on the VeChain network, thereby enabling developers to manipulate and query smart contract states efficiently.

This document, designed to be both informative and practical, equips developers with the necessary tools and knowledge to effectively interact with smart contracts on the VeChain blockchain, from deployment to function invocation.

## Delegating a Contract Call

### Overview

VeChain allows for the delegation of contract calls, enabling developers to execute contract functions in which the fees are payed by the delegator.

Here is an example of how to delegate a contract call:

```typescript { name=contract-delegation-erc20, category=example }
const thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL);
const provider = new VeChainProvider(
    thorSoloClient,
    new ProviderInternalBaseWallet([deployerAccount], {
        delegator: {
            delegatorPrivateKey: delegatorAccount.privateKey
        }
    }),
    true
);
const signer = (await provider.getSigner(
    deployerAccount.address
)) as VeChainSigner;

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
const transactionReceiptTransfer =
    (await transferResult.wait()) as TransactionReceipt;

// Asserting that the transaction has not been reverted
expect(transactionReceiptTransfer.reverted).toEqual(false);
```

## Multi-Clause Contract Interaction

### Multiple clauses read

VeChain supports the execution of multiple clauses in a single transaction, allowing developers to interact with multiple contracts or perform multiple operations within a single transaction.

Here is an example of how to interact with multiple read clauses in a single transaction:

```typescript { name=contract-create-erc20-token, category=example }
// Reading data from multiple clauses in a single call
const multipleClausesResult =
    await thorSoloClient.contracts.executeMultipleClausesCall([
        contract.clause.totalSupply(),
        contract.clause.name(),
        contract.clause.symbol(),
        contract.clause.decimals()
    ]);

expect(multipleClausesResult[0]).toEqual([expectedBalance]);
expect(multipleClausesResult[1]).toEqual(['SampleToken']);
expect(multipleClausesResult[2]).toEqual(['ST']);
expect(multipleClausesResult[3]).toEqual([18n]);
```


## Multi-Clause Event filtering

### Overview

VeChain allows developers to filter multiple events from diffent contracts in a single call, enabling efficient event monitoring and processing.

To do so, developers needs the contract address and the event signature.

Here is an example of how to filter multiple events from different contracts:

```typescript { name=contract-event-filter, category=example }
const contractEventExample = await setupEventExampleContract();

await (await contractEventExample.transact.setValue(3000n)).wait();

const transferCriteria = contractErc20.criteria.Transfer({
    to: '0x9e7911de289c3c856ce7f421034f66b6cde49c39'
});

const valueCriteria = contractEventExample.criteria.ValueSet();

const events = await thorSoloClient.logs.filterEventLogs({
    criteriaSet: [transferCriteria, valueCriteria]
});

console.log(events);

// Asserting that I'm filtering a previous transfer event and the new value set event
expect(events.map((x) => x.decodedData)).toEqual([
    [
        '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54',
        '0x9E7911de289c3c856ce7f421034F66b6Cde49C39',
        10000n
    ],
    ['0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54', 3000n]
]);
```


### Grouping events by topic hash

It's possible to group events by topic hash, which can be useful for differentiating between events from different contracts or for categorizing events based on specific criteria.

In the example below, we will use the method *filterGroupedEventLogs* to distinguish the transfer criteria from the value criteria.

The results is an array composed of two arrays, one for each criteria.

```typescript { name=contract-event-filter, category=example }
const groupedEvents = await thorSoloClient.logs.filterGroupedEventLogs({
    criteriaSet: [transferCriteria, valueCriteria]
});

// Asserting that I'm filtering a previous transfer event and the new value set event
expect(groupedEvents[0].map((x) => x.decodedData)).toEqual([
    [
        '0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54',
        '0x9E7911de289c3c856ce7f421034F66b6Cde49C39',
        10000n
    ]
]);

expect(groupedEvents[1].map((x) => x.decodedData)).toEqual([
    ['0xF02f557c753edf5fcdCbfE4c1c3a448B3cC84D54', 3000n]
]);
```
