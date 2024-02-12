import { describe, expect, test, beforeEach } from '@jest/globals';
import {
    TEST_ACCOUNTS,
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS,
    soloNetwork
} from '../../fixture';
import {
    contractBytecode,
    deployedContractAbi,
    deployedContractBytecode,
    deployedERC20Abi,
    erc20ContractBytecode,
    testingContractTestCases
} from './fixture';
import { addressUtils, type DeployParams } from '@vechain/vechain-sdk-core';
import {
    Contract,
    ThorClient,
    type TransactionReceipt,
    type ContractFactory
} from '../../../src';
import { ContractDeploymentFailedError } from '@vechain/vechain-sdk-errors';

/**
 * Tests for the ThorClient class, specifically focusing on contract-related functionality.
 *
 * @NOTE: This test suite runs on the solo network because it requires sending transactions.
 *
 * @group integration/client/thor-client/contracts
 */
describe('ThorClient - Contracts', () => {
    // ThorClient instance
    let thorSoloClient: ThorClient;

    beforeEach(() => {
        thorSoloClient = new ThorClient(soloNetwork);
    });

    /**
     * Asynchronous function to deploy an example smart contract.
     *
     * @returns A promise that resolves to a `TransactionSendResult` object representing the result of the deployment.
     */
    async function createExampleContractFactory(): Promise<ContractFactory> {
        const deployParams: DeployParams = { types: ['uint'], values: ['100'] };

        const contractFactory = thorSoloClient.contracts.createContractFactory(
            deployedContractAbi,
            contractBytecode,
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey
        );

        // Start the deployment of the contract
        return await contractFactory.startDeployment(deployParams);
    }

    /**
     * Test case for deploying a smart contract using the contract factory.
     */
    test('create a new contract', () => {
        // Poll until the transaction receipt is available
        const contract: Contract = new Contract(
            '0x123',
            deployedContractAbi,
            thorSoloClient
        );
        expect(contract.address).toBeDefined();
        expect(contract.abi).toBeDefined();
    }, 10000);

    /**
     * Test case for deploying a smart contract using the contract factory.
     */
    test('deploy a contract', async () => {
        // Deploy an example contract and get the transaction response
        const response = await createExampleContractFactory();

        // Poll until the transaction receipt is available
        const contract: Contract = await response.waitForDeployment();

        expect(contract.address).toBeDefined();
        expect(contract.abi).toBeDefined();
        expect(contract.deployTransactionReceipt).toBeDefined();

        // Extract the contract address from the transaction receipt
        const contractAddress = contract.address;

        // Call the get function of the deployed contract to verify that the stored value is 100
        const result = await thorSoloClient.contracts.executeContractCall(
            contractAddress,
            deployedContractAbi,
            'get',
            []
        );

        expect(result).toEqual([100n]);

        // Assertions
        expect(contract.deployTransactionReceipt?.reverted).toBe(false);
        expect(contract.deployTransactionReceipt?.outputs).toHaveLength(1);
        expect(contractAddress).not.toBeNull();
        expect(addressUtils.isAddress(contractAddress)).toBe(true);
    }, 10000);

    /**
     * Test case for a failed smart contract using the contract factory.
     */
    test('failed contract deployment', async () => {
        // Create a contract factory
        let contractFactory = thorSoloClient.contracts.createContractFactory(
            deployedContractAbi,
            contractBytecode,
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey
        );

        // Start the deployment of the contract
        contractFactory = await contractFactory.startDeployment();

        // Wait for the deployment to complete and obtain the contract instance
        await expect(contractFactory.waitForDeployment()).rejects.toThrow(
            ContractDeploymentFailedError
        );
    }, 10000);

    /**
     * Test case for waiting for a contract deployment not started.
     */
    test('wait for a contract deployment not started', async () => {
        // Create a contract factory
        const contractFactory = thorSoloClient.contracts.createContractFactory(
            deployedContractAbi,
            contractBytecode,
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey
        );

        // Waiting for a deployment that has not started
        await expect(contractFactory.waitForDeployment()).rejects.toThrow(
            ContractDeploymentFailedError
        );
    }, 10000);

    test('deployErc20Contract with Contract Factory', async () => {
        // Deploy the ERC20 contract and receive a response
        let factory = thorSoloClient.contracts.createContractFactory(
            deployedERC20Abi,
            erc20ContractBytecode,
            TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.privateKey
        );

        factory = await factory.startDeployment();

        expect(factory.getDeployTransaction()).not.toBe(undefined);

        const contract: Contract = await factory.waitForDeployment();

        expect(contract.address).not.toBe(null);
        expect(addressUtils.isAddress(contract.address)).toBe(true);
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
        // Deploy the ERC20 contract
        let factory = thorSoloClient.contracts.createContractFactory(
            deployedERC20Abi,
            erc20ContractBytecode,
            TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.privateKey
        );

        factory = await factory.startDeployment();

        const contract: Contract = await factory.waitForDeployment();

        // Execute a 'transfer' transaction on the deployed contract,
        // transferring a specified amount of tokens
        const transferResult =
            await thorSoloClient.contracts.executeContractTransaction(
                TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.privateKey,
                contract.address,
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
                contract.address,
                deployedERC20Abi,
                'balanceOf',
                [TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address],
                {
                    caller: TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.address
                }
            );

        // Ensure that the transfer transaction was successful and the balance is as expected
        expect(transactionReceiptTransfer.reverted).toBe(false);
        expect(balanceOfResult).toEqual([BigInt(1000)]);
    }, 10000); // Set a timeout of 10000ms for this test

    /**
     * Test case for retrieving the bytecode of a deployed smart contract.
     */
    test('get Contract Bytecode', async () => {
        // Create a contract factory that is already deploying the example contract
        const factory = await createExampleContractFactory();

        // Wait for the deployment to complete and obtain the contract instance
        const contract: Contract = await factory.waitForDeployment();

        // Retrieve the bytecode of the deployed contract
        const contractBytecodeResponse =
            await thorSoloClient.accounts.getBytecode(contract.address);

        // Assertion: Compare with the expected deployed contract bytecode
        expect(contractBytecodeResponse).toBe(deployedContractBytecode);
    }, 10000);

    /**
     * Test case for deploying a smart contract using the contract factory.
     */
    test('call a contract function', async () => {
        // Create a contract factory that is already deploying the example contract
        const factory = await createExampleContractFactory();

        // Wait for the deployment to complete and obtain the contract instance
        const contract: Contract = await factory.waitForDeployment();

        const callFunctionSetResponse =
            await thorSoloClient.contracts.executeContractTransaction(
                TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER.privateKey,
                contract.address,
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
                contract.address,
                deployedContractAbi,
                'get',
                []
            );

        expect(callFunctionGetResult).toEqual([BigInt(123)]);
    }, 10000);

    /**
     * Tests the `TestingContract` functions.
     *
     * This test iterates over an array of test cases, each representing a different function call
     * to the `TestingContract`. For each test case, it uses the test description provided in the
     * test case, executes the contract call, and then asserts that the response matches the expected
     * value defined in the test case.
     *
     */
    testingContractTestCases.forEach(
        ({ description, functionName, params, expected }) => {
            test(description, async () => {
                const response =
                    await thorSoloClient.contracts.executeContractCall(
                        TESTING_CONTRACT_ADDRESS,
                        TESTING_CONTRACT_ABI,
                        functionName,
                        params
                    );

                expect(response).toEqual(expected);
            });
        }
    );

    /**
     * Test suite for 'getBaseGasPrice' method
     */
    describe('getBaseGasPrice', () => {
        test('Should return the base gas price of the Solo network', async () => {
            const baseGasPrice =
                await thorSoloClient.contracts.getBaseGasPrice();
            expect(baseGasPrice).toEqual([1000000000000000n]);
            expect(baseGasPrice).toEqual([BigInt(10 ** 15)]); // 10^13 wei
        });
    });
});
