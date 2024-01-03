// Importing necessary modules and classes from the Vechain SDK and the 'expect' assertion library

import { expect } from 'expect';
import {
    erc20ContractABI,
    erc20ContractBytecode,
    privateKeyDeployer
} from './fixture.js';
import { addressUtils } from '@vechainfoundation/vechain-sdk-core';
import { HttpClient, ThorClient } from '@vechainfoundation/vechain-sdk-network';

// Create thor client for solo network
const _soloUrl = 'http://localhost:8669/';
const soloNetwork = new HttpClient(_soloUrl);
const thorSoloClient = new ThorClient(soloNetwork);

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
expect(parseInt(balance, 16)).toEqual(1e24);

// Destroying the Thor client
thorSoloClient.destroy();
