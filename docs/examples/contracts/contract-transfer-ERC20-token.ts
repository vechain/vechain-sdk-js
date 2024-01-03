import {
    erc20ContractABI,
    erc20ContractBytecode,
    privateKeyDeployer
} from './fixture.js';
import {
    HttpClient,
    ThorClient,
    type TransactionReceipt
} from '@vechainfoundation/vechain-sdk-network';
import { expect } from 'expect';

// Create thor client for solo network
const _soloUrl = 'http://localhost:8669/';
const soloNetwork = new HttpClient(_soloUrl);
const thorSoloClient = new ThorClient(soloNetwork);

// Defining a function for deploying the ERC20 contract
const setupERC20Contract = async () => {
    // Deploying the ERC20 contract using the Thor client and the deployer's private key
    const transaction = await thorSoloClient.contracts.deployContract(
        privateKeyDeployer,
        erc20ContractBytecode
    );

    // Awaiting the transaction receipt to confirm successful contract deployment
    const receipt = await thorSoloClient.transactions.waitForTransaction(
        transaction.id
    );

    return receipt.outputs[0].contractAddress;
};

// Setting up the ERC20 contract and getting its address
const contractAddress = await setupERC20Contract();

// Executing a 'transfer' transaction on the ERC20 contract
const transferResult =
    await thorSoloClient.contracts.executeContractTransaction(
        privateKeyDeployer, // Using deployer's private key to authorize the transaction
        contractAddress, // Contract address to which the transaction is sent
        erc20ContractABI, // ABI of the ERC20 contract
        'transfer', // Name of the function to be executed in the contract
        ['0x9e7911de289c3c856ce7f421034f66b6cde49c39', 10000] // Arguments for the 'transfer' function: recipient address and amount
    );

// Wait for the transfer transaction to complete and obtain its receipt
const transactionReceiptTransfer =
    (await thorSoloClient.transactions.waitForTransaction(
        transferResult.id // Transaction ID of the executed transfer
    )) as TransactionReceipt;

// Asserting that the transaction has not been reverted
expect(transactionReceiptTransfer.reverted).toEqual(false);

// Destroying the Thor client
thorSoloClient.destroy();
