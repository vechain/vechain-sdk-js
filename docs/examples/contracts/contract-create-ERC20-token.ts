// Importing necessary modules and classes from the Vechain SDK and the 'expect' assertion library
import {
    HttpClient,
    ThorClient,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';
import { expect } from 'expect';
import { erc20ContractABI, erc20ContractBytecode } from './fixture.js';
import { addressUtils } from '@vechainfoundation/vechain-sdk-core';

// Defining the private key for the deployer account, which has VTHO for deployment costs
const privateKeyDeployer =
    '706e6acd567fdc22db54aead12cb39db01c4832f149f95299aa8dd8bef7d28ff';

// Setting the URL for the local solo network for testing purposes
const _testnetUrl = 'http://localhost:8669/';

// Creating an instance of HttpClient to interact with the solo network
const soloNetwork = new HttpClient(_testnetUrl);

// Initializing a ThorestClient for interacting with the Thor blockchain on the solo network
const thorestSoloClient = new ThorestClient(soloNetwork);

// Creating a ThorClient instance for contract deployment and transaction handling
const thorSoloClient = new ThorClient(thorestSoloClient);

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
