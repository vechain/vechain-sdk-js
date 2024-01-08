// Importing necessary modules and classes from the Vechain SDK and the 'expect' assertion library

import { expect } from 'expect';
import {
    erc20ContractABI,
    erc20ContractBytecode,
    privateKeyDeployer,
    thorSoloClient
} from './fixture.js';
import { addressUtils } from '@vechainfoundation/vechain-sdk-core';

// Deploying the ERC20 contract using the Thor client and the deployer's private key
const transaction = await thorSoloClient.contracts.deployContract(
    privateKeyDeployer,
    erc20ContractBytecode
);

// Awaiting the transaction receipt to confirm successful contract deployment
const receipt = await thorSoloClient.transactions.waitForTransaction(
    transaction.id
);

// Asserting that the contract deployment didn't revert, indicating a successful deployment
expect(receipt.reverted).toEqual(false);

// Executing a contract call to get the balance of the account that deployed the contract
const balance = await thorSoloClient.contracts.executeContractCall(
    receipt.outputs[0].contractAddress,
    erc20ContractABI,
    'balanceOf',
    [addressUtils.fromPrivateKey(Buffer.from(privateKeyDeployer, 'hex'))]
);

// Asserting that the initial balance of the deployer is the expected amount (1e24)
expect(balance).toEqual([1000000000000000000000000n]);
