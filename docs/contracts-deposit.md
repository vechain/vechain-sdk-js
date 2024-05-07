# Deposit Contract

The code illustrates the deployment of a deposit contract, executing a deposit transaction, and querying the balance associated with a specific address.

## Contract Deployment and Interaction

The main deployment steps are as follows:

1. **Contract Factory Creation**: A contract factory is instantiated using the `ThorClient`, the contract's ABI, its bytecode, and the deployer's private key.
2. **Contract Deployment**: The contract is deployed to the vechain blockchain. The deployment process is asynchronous and awaits confirmation.
3. **Deposit Transaction**: A deposit transaction is initiated by calling the `deposit` function of the deployed contract with a specified value (1000 Wei in this case). The value is the amount of VET sent with the transaction. This transaction is also asynchronous and awaits confirmation.
4. **Balance Query**: The balance of the deployer address is queried using the `getBalance` function of the contract.


## Example

```typescript { name=contract-deposit, category=example }
// Creating the contract factory
const contractFactory = thorSoloClient.contracts.createContractFactory(
    depositContractAbi,
    depositContractBytecode,
    signer
);

const contract = await (
    await contractFactory.startDeployment()
).waitForDeployment();

await (await contract.transact.deposit({ value: 1000 })).wait();

const balance = await contract.read.getBalance(deployerAccount.address);

expect(balance).toEqual([BigInt(1000)]);
```



## Conclusion

This snippet serves as a practical guide for developers looking to understand the deployment and interaction with smart contracts on the Vechain blockchain, specifically focusing on deposit transactions and balance queries.



