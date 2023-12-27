import { beforeEach, afterEach, describe, expect, test } from '@jest/globals';
import { TEST_ACCOUNTS, soloNetwork } from '../../fixture';
import {
    contractBytecode,
    deployedContractAbi,
    deployedContractBytecode,
    deployedERC20Abi,
    deployErc20Contract
} from './fixture';
import {
    addressUtils,
    type DeployParams
} from '@vechainfoundation/vechain-sdk-core';
import {
    ThorClient,
    type TransactionSendResult,
    type TransactionReceipt
} from '../../../src';

/**
 * Tests for the ThorClient class, specifically focusing on contract-related functionality.
 *
 * @NOTE: This test suite runs on the solo network because it requires sending transactions.
 *
 * @group integration/client/thor/contracts
 */
describe('ThorClient - Contracts', () => {
    // ThorClient instance
    let thorSoloClient: ThorClient;

    beforeEach(() => {
        thorSoloClient = new ThorClient(soloNetwork);
    });

    afterEach(() => {
        thorSoloClient.destroy();
    });

    /**
     * Asynchronous function to deploy an example smart contract.
     *
     * @returns A promise that resolves to a `TransactionSendResult` object representing the result of the deployment.
     */
    async function deployExampleContract(): Promise<TransactionSendResult> {
        const deployParams: DeployParams = { types: ['uint'], values: ['100'] };

        // Deploy the contract using the deployContract method
        return await thorSoloClient.contracts.deployContract(
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey,
            contractBytecode,
            deployParams
        );
    }

    /**
     * Test case for deploying a smart contract using the deployContract method.
     */
    test('deployContract', async () => {
        try {
            // Deploy an example contract and get the transaction response
            const response = await deployExampleContract();

            // Poll until the transaction receipt is available
            const transactionReceipt =
                (await thorSoloClient.transactions.waitForTransaction(
                    response.id
                )) as TransactionReceipt;

            // Extract the contract address from the transaction receipt
            const contractAddress =
                transactionReceipt.outputs[0].contractAddress;

            // Call the get function of the deployed contract to verify that the stored value is 100
            const result = await thorSoloClient.contracts.executeContractCall(
                contractAddress as string,
                deployedContractAbi,
                'get',
                []
            );

            expect(parseInt(result)).toBe(100);

            // Assertions
            expect(transactionReceipt.reverted).toBe(false);
            expect(transactionReceipt.outputs).toHaveLength(1);
            expect(contractAddress).not.toBeNull();
            expect(addressUtils.isAddress(contractAddress as string)).toBe(
                true
            );
        } catch (error) {
            console.log('error', error);
        }
    }, 10000);

    /**
     * Test case for deploying an ERC20 smart contract.
     * It utilizes the deployErc20Contract method to deploy the contract,
     * then verifies the deployment by checking the contract's balance.
     *
     * The test involves the following steps:
     * 1. Deploy the ERC20 contract.
     * 2. Poll for the transaction receipt of the deployment.
     * 3. Extract the deployed contract's address from the transaction receipt.
     * 4. Execute a contract call to check the balance of a specific account.
     * 5. Assert that the balance is as expected.
     *
     * Test timeout is set to 10000 ms.
     */
    test('deployErc20Contract', async () => {
        // Deploy the ERC20 contract and receive a response
        const response = await deployErc20Contract();

        // Poll until the transaction receipt is available
        // This receipt includes details of the deployment transaction
        const transactionReceiptDeployContract =
            (await thorSoloClient.transactions.waitForTransaction(
                response.id
            )) as TransactionReceipt;

        // Extract the contract address from the transaction receipt
        // The contract address is needed for further interactions with the contract
        const contractAddress =
            transactionReceiptDeployContract.outputs[0].contractAddress;

        // Execute a contract call to get the balance of the contract manager's account
        // This checks if the deployment was successful and the contract is operational
        const result = await thorSoloClient.contracts.executeContractCall(
            contractAddress as string,
            deployedERC20Abi,
            'balanceOf',
            [TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.address]
        );

        const resultInt = parseInt(result, 16);

        // Assert that the balance matches the expected value
        // The expected value is a predefined number representing the contract's initial balance
        expect(resultInt).toBe(1e24);
    }, 10000);

    /**
     * Tests the execution of ERC20 contract operations using a blockchain client.
     *
     * This test covers the deployment of an ERC20 token contract, executing a transfer transaction,
     * and verifying the transaction's effects. It begins by deploying the contract and obtaining
     * its address. A transfer operation is then executed to transfer tokens to a specified address.
     * Finally, the test verifies that the transaction was successful and that the recipient's balance
     * reflects the transferred amount.
     *
     */
    test('Execute ERC20 contract operations', async () => {
        // Deploy an ERC20 contract and store the response which includes the transaction ID
        const response = await deployErc20Contract();

        // Wait for the transaction to complete and obtain its receipt,
        // which contains details such as the contract address
        const transactionReceiptDeployContract =
            (await thorSoloClient.transactions.waitForTransaction(
                response.id
            )) as TransactionReceipt;

        // Retrieve the contract address from the transaction receipt,
        // as it is necessary for further interactions with the contract
        const contractAddress =
            transactionReceiptDeployContract.outputs[0].contractAddress;

        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        const transferResult =
            await thorSoloClient.contracts.executeContractTransaction(
                TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.privateKey,
                contractAddress as string,
                deployedERC20Abi,
                'transfer',
                [TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address, 1000]
            );

        // Wait for the transfer transaction to complete and obtain its receipt
        const transactionReceiptTransfer =
            (await thorSoloClient.transactions.waitForTransaction(
                transferResult.id
            )) as TransactionReceipt;

        // Verify that the transfer transaction did not revert
        expect(transactionReceiptTransfer.reverted).toBe(false);

        // Execute a 'balanceOf' call on the contract to check the balance of the receiver
        const balanceOfResult =
            await thorSoloClient.contracts.executeContractCall(
                contractAddress as string,
                deployedERC20Abi,
                'balanceOf',
                [TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address],
                {
                    caller: TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.address
                }
            );

        // Ensure that the transfer transaction was successful and the balance is as expected
        expect(transactionReceiptTransfer.reverted).toBe(false);
        expect(parseInt(balanceOfResult)).toBe(1000);
    }, 10000); // Set a timeout of 10000ms for this test

    /**
     * Test case for retrieving the bytecode of a deployed smart contract.
     */
    test('get Contract Bytecode', async () => {
        // Deploy an example contract and get the transaction response
        const response = await deployExampleContract();

        // Poll until the transaction receipt is available
        const transactionReceipt =
            (await thorSoloClient.transactions.waitForTransaction(
                response.id
            )) as TransactionReceipt;

        // Extract the contract address from the transaction receipt
        const contractAddress = transactionReceipt.outputs[0].contractAddress;

        // Retrieve the bytecode of the deployed contract
        const contractBytecodeResponse =
            await thorSoloClient.accounts.getBytecode(
                contractAddress as string
            );

        // Assertion: Compare with the expected deployed contract bytecode
        expect(contractBytecodeResponse).toBe(deployedContractBytecode);
    });

    /**
     * Test case for deploying a smart contract using the deployContract method.
     */
    test('call a contract function', async () => {
        try {
            // Deploy an example contract and get the transaction response
            const response = await deployExampleContract();

            // Poll until the transaction receipt is available
            const transactionReceiptDeployContract =
                (await thorSoloClient.transactions.waitForTransaction(
                    response.id
                )) as TransactionReceipt;

            const contractAddress = transactionReceiptDeployContract.outputs[0]
                .contractAddress as string;

            const callFunctionSetResponse =
                await thorSoloClient.contracts.executeContractTransaction(
                    TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.privateKey,
                    contractAddress,
                    deployedContractAbi,
                    'set',
                    [123]
                );

            const transactionReceiptCallSetContract =
                (await thorSoloClient.transactions.waitForTransaction(
                    callFunctionSetResponse.id
                )) as TransactionReceipt;

            expect(transactionReceiptCallSetContract.reverted).toBe(false);

            const callFunctionGetResult =
                await thorSoloClient.contracts.executeContractCall(
                    contractAddress,
                    deployedContractAbi,
                    'get',
                    []
                );

            expect(parseInt(callFunctionGetResult)).toBe(123);
        } catch (error) {
            console.log('error', error);
        }
    }, 10000);

    /**
     * Test suite for 'getBaseGasPrice' method
     */
    describe('getBaseGasPrice', () => {
        test('Should return the base gas price of the Solo network', async () => {
            const baseGasPrice =
                await thorSoloClient.contracts.getBaseGasPrice();
            expect(baseGasPrice).toBe(
                '0x00000000000000000000000000000000000000000000000000038d7ea4c68000'
            );
            expect(Number(baseGasPrice)).toBe(10 ** 15); // 10^15 wei
        });
    });
});
