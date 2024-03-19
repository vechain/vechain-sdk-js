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
    filterContractEventsTestCases,
    fourArgsEventAbi,
    testingContractTestCases
} from './fixture';
import {
    addressUtils,
    coder,
    type DeployParams,
    type FunctionFragment
} from '@vechain/sdk-core';
import {
    Contract,
    ThorClient,
    type TransactionReceipt,
    type ContractFactory
} from '../../../src';
import {
    ContractDeploymentFailedError,
    InvalidAbiFunctionError,
    TransactionMissingPrivateKeyError
} from '@vechain/sdk-errors';

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
    test('create a new contract and call it', () => {
        // Poll until the transaction receipt is available
        const contract: Contract = new Contract(
            '0x123',
            deployedContractAbi,
            thorSoloClient,
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey
        );
        expect(contract.address).toBeDefined();
        expect(contract.abi).toBeDefined();
    }, 10000);

    /**
     * Test case for deploying a smart contract using the contract factory.
     */
    test('create a new contract', () => {
        // Poll until the transaction receipt is available
        const contract: Contract = new Contract(
            '0x123',
            deployedContractAbi,
            thorSoloClient,
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey
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
        const result = await contract.read.get();

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

        const callFunctionSetResponse = await contract.transact.set(123);

        const transactionReceiptCallSetContract =
            (await callFunctionSetResponse.wait()) as TransactionReceipt;

        expect(transactionReceiptCallSetContract.reverted).toBe(false);

        const callFunctionGetResult = await contract.read.get();

        expect(callFunctionGetResult).toEqual([BigInt(123)]);
    }, 10000);

    /**
     * Test case for calling an undefined contract function.
     */
    test('call an undefined contract function', async () => {
        // Create a contract factory that is already deploying the example contract
        const factory = await createExampleContractFactory();

        // Wait for the deployment to complete and obtain the contract instance
        const contract: Contract = await factory.waitForDeployment();

        await expect(
            async () => await contract.read.undefinedFunction()
        ).rejects.toThrowError(InvalidAbiFunctionError);

        await expect(
            async () => await contract.transact.undefinedFunction()
        ).rejects.toThrowError(InvalidAbiFunctionError);
    }, 10000);

    /**
     * Test case for calling a contract function with options.
     */
    test('call a contract function with options', async () => {
        // Create a contract factory that is already deploying the example contract
        const factory = await createExampleContractFactory();

        // Wait for the deployment to complete and obtain the contract instance
        const contract: Contract = await factory.waitForDeployment();

        await (await contract.transact.set(123)).wait();

        contract.setContractReadOptions({ caller: 'invalid address' });

        // The contract call should fail because the caller address is invalid
        await expect(contract.read.get()).rejects.toThrow();

        contract.clearContractReadOptions();

        const callFunctionGetResult = await contract.read.get();

        contract.setContractTransactOptions({
            gasPriceCoef: 2442442,
            expiration: 32
        });

        await expect(contract.transact.set(22323)).rejects.toThrow();

        contract.clearContractTransactOptions();

        await (await contract.transact.set(22323)).wait();

        expect(callFunctionGetResult).toEqual([BigInt(123)]);
    }, 15000);

    /**
     * Test case for calling a contract function with different private keys.
     */
    test('call a contract function with different private keys', async () => {
        // Create a contract factory that is already deploying the example contract
        const factory = await createExampleContractFactory();

        // Wait for the deployment to complete and obtain the contract instance
        const contract: Contract = await factory.waitForDeployment();

        contract.setCallerPrivateKey('');

        // The contract call should fail because the private key is not set
        await expect(contract.transact.set(123)).rejects.toThrow();

        contract.setCallerPrivateKey(
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey
        );

        await (await contract.transact.set(123)).wait();

        const callFunctionGetResult = await contract.read.get();

        expect(callFunctionGetResult).toEqual([BigInt(123)]);
    }, 10000);

    /**
     * Test case for loading a deployed contract and calling its functions.
     */
    test('load a deployed contract and call its functions', async () => {
        // Create a contract factory that is already deploying the example contract
        const factory = await createExampleContractFactory();

        // Wait for the deployment to complete and obtain the contract instance
        const contract: Contract = await factory.waitForDeployment();

        // Load the deployed contract using the contract address, ABI and private key
        const loadedContract = thorSoloClient.contracts.load(
            contract.address,
            contract.abi
        );

        // Call the get function of the loaded contract to verify that the stored value is 100
        let callFunctionGetResult = await loadedContract.read.get();

        expect(callFunctionGetResult).toEqual([BigInt(100)]);

        // Set the private key of the caller for signing transactions
        loadedContract.setCallerPrivateKey(
            contract.getCallerPrivateKey() as string
        );

        // Call the set function of the loaded contract to set the value to 123
        const callFunctionSetResponse = await loadedContract.transact.set(123);

        // Wait for the transaction to complete and obtain the transaction receipt
        const transactionReceiptCallSetContract =
            (await callFunctionSetResponse.wait()) as TransactionReceipt;

        expect(transactionReceiptCallSetContract.reverted).toBe(false);

        callFunctionGetResult = await loadedContract.read.get();

        // Assertion: The value should be 123
        expect(callFunctionGetResult).toEqual([BigInt(123)]);
    }, 10000);

    /**
     * Test case for loading a deployed contract without adding a private key
     */
    test('load a deployed contract without adding a private key and transact', async () => {
        // Create a contract factory that is already deploying the example contract
        const factory = await createExampleContractFactory();

        // Wait for the deployment to complete and obtain the contract instance
        const contract: Contract = await factory.waitForDeployment();

        // Load the deployed contract using the contract address, ABI and private key
        const loadedContract = thorSoloClient.contracts.load(
            contract.address,
            contract.abi
        );

        // The contract call should fail because the private key is not set
        await expect(loadedContract.transact.set(123)).rejects.toThrowError(
            TransactionMissingPrivateKeyError
        );
    }, 10000);

    /**
     * Test case for creating a filter for a contract event.
     */
    test('Create a filter for a four args event', () => {
        // Load the deployed contract using the contract address, ABI and private key
        const loadedContract = thorSoloClient.contracts.load(
            '0x0000000000000000000000000000456e65726779',
            fourArgsEventAbi
        );

        const contractFilter = loadedContract.filters.DataUpdated(
            '0x0000000000000000000000000000456e65726779',
            10,
            10,
            10
        );

        expect(contractFilter).toBeDefined();
        expect(contractFilter.criteriaSet[0].topic0).toBeDefined();
        expect(contractFilter.criteriaSet[0].topic1).toBeDefined();
        expect(contractFilter.criteriaSet[0].topic2).toBeDefined();
        expect(contractFilter.criteriaSet[0].topic3).toBeDefined();
        expect(contractFilter.criteriaSet[0].topic4).toBeDefined();
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
                        coder
                            .createInterface(TESTING_CONTRACT_ABI)
                            .getFunction(functionName) as FunctionFragment,
                        params
                    );

                expect(response).toEqual(expected);
            });
        }
    );

    test('Should filter the StateChanged event of the testing contract', async () => {
        const contract = thorSoloClient.contracts.load(
            TESTING_CONTRACT_ADDRESS,
            TESTING_CONTRACT_ABI,
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey
        );

        await (await contract.transact.setStateVariable(123)).wait();

        const events = await contract.filters
            .StateChanged(
                undefined,
                undefined,
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            )
            .get();

        expect(events).toBeDefined();

        expect(events.at(events.length - 1)?.topics[1]).toBe(
            '0x000000000000000000000000000000000000000000000000000000000000007b'
        );
    });

    filterContractEventsTestCases.forEach(
        ({
            description,
            contractBytecode,
            contractAbi,
            contractCaller,
            functionCalls,
            eventName,
            getParams,
            args,
            expectedTopics,
            expectedData
        }) => {
            test(
                description,
                async () => {
                    const contractFactory =
                        thorSoloClient.contracts.createContractFactory(
                            contractAbi,
                            contractBytecode,
                            contractCaller
                        );

                    const factory = await contractFactory.startDeployment();

                    const contract: Contract =
                        await factory.waitForDeployment();

                    for (const functionCall of functionCalls) {
                        if (functionCall.type === 'read') {
                            await contract.read[functionCall.functionName](
                                ...functionCall.params
                            );
                        } else {
                            await (
                                await contract.transact[
                                    functionCall.functionName
                                ](...functionCall.params)
                            ).wait();
                        }
                    }

                    const eventLogs = await contract.filters[eventName](
                        ...args
                    ).get(
                        getParams?.range,
                        getParams?.options,
                        getParams?.order
                    );

                    expect(
                        eventLogs.map((event) => {
                            return event.data;
                        })
                    ).toEqual(expectedData);

                    expect(
                        eventLogs.map((event) => {
                            return event.topics;
                        })
                    ).toEqual(expectedTopics);
                },
                10000
            );
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
