import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    soloUrl,
    TEST_ACCOUNTS,
    TESTING_CONTRACT_ABI,
    TESTING_CONTRACT_ADDRESS
} from '../../fixture';
import {
    contractBytecode,
    deployedContractAbi,
    deployedContractBytecode,
    depositContractAbi,
    depositContractBytecode,
    filterContractEventsTestCases,
    fourArgsEventAbi,
    multipleClausesTestCases,
    OWNER_RESTRICTION_ABI,
    OWNER_RESTRICTION_BYTECODE,
    testingContractEVMExtensionTestCases,
    testingContractNegativeTestCases,
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
    type ContractFactory,
    ThorClient,
    type TransactionReceipt,
    VechainPrivateKeySigner,
    VechainProvider,
    type VechainSigner
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

    // Signer instance
    let signer: VechainSigner;

    // Signer instance
    let receiverSigner: VechainSigner;

    beforeEach(() => {
        thorSoloClient = ThorClient.fromUrl(soloUrl);
        signer = new VechainPrivateKeySigner(
            Buffer.from(
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey,
                'hex'
            ),
            new VechainProvider(thorSoloClient)
        );

        receiverSigner = new VechainPrivateKeySigner(
            Buffer.from(
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.privateKey,
                'hex'
            ),
            new VechainProvider(thorSoloClient)
        );
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
            signer
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
            signer
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
            signer
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
            signer
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
            signer
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
        expect(await contract.read.get()).toEqual([BigInt(123)]);

        contract.setContractReadOptions({ caller: 'invalid address' });

        // The contract call should fail because the caller address is invalid
        await expect(contract.read.get()).rejects.toThrow();

        contract.clearContractReadOptions();

        contract.setContractTransactOptions({
            gasPriceCoef: 2442442,
            expiration: 32
        });

        await expect(contract.transact.set('INVALID_DATA')).rejects.toThrow();

        contract.clearContractTransactOptions();

        await (await contract.transact.set(22323)).wait();
        expect(await contract.read.get()).toEqual([BigInt(22323)]);
    }, 15000);

    /**
     * Test case for calling a contract function with different private keys.
     */
    test('call a contract function with different signer', async () => {
        // Create a contract factory that is already deploying the example contract
        const factory = await createExampleContractFactory();

        // Wait for the deployment to complete and obtain the contract instance
        const contract: Contract = await factory.waitForDeployment();

        // Set signer with invalid private key
        contract.setSigner(
            new VechainPrivateKeySigner(
                Buffer.from('', 'hex'),
                new VechainProvider(thorSoloClient)
            )
        );

        // The contract call should fail because the private key is not set
        await expect(contract.transact.set(123)).rejects.toThrow();

        contract.setSigner(signer);

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
        loadedContract.setSigner(contract.getSigner() as VechainSigner);

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
        expect(contractFilter.criteriaSet[0].criteria.topic0).toBeDefined();
        expect(contractFilter.criteriaSet[0].criteria.topic1).toBeDefined();
        expect(contractFilter.criteriaSet[0].criteria.topic2).toBeDefined();
        expect(contractFilter.criteriaSet[0].criteria.topic3).toBeDefined();
        expect(contractFilter.criteriaSet[0].criteria.topic4).toBeDefined();
    }, 10000);

    test('deploy the deposit contract and call the deposit method', async () => {
        const depositContractFactory =
            thorSoloClient.contracts.createContractFactory(
                depositContractAbi,
                depositContractBytecode,
                signer
            );

        const depositContract = await depositContractFactory.startDeployment();

        const deployedDepositContract =
            await depositContract.waitForDeployment();

        const result = await deployedDepositContract.transact.deposit({
            value: 1000
        });

        await result.wait();

        expect(
            await deployedDepositContract.read.getBalance(
                TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
            )
        ).toEqual([BigInt(1000)]);
    }, 10000);

    /**
     * Test case for deploying a contract with ownership restrictions.
     */
    test('deploy the ownership restricted contract and call it', async () => {
        const contractFactory = thorSoloClient.contracts.createContractFactory(
            OWNER_RESTRICTION_ABI,
            OWNER_RESTRICTION_BYTECODE,
            signer
        );

        const factory = await contractFactory.startDeployment();

        const deployedContract = await factory.waitForDeployment();

        const secretData = await deployedContract.read.getSecretData();

        expect(secretData[0]).toEqual(42n);

        const loadedContract = thorSoloClient.contracts.load(
            deployedContract.address,
            OWNER_RESTRICTION_ABI,
            receiverSigner
        );
        const secretDataNotOwner = await loadedContract.read.getSecretData();
        expect(secretDataNotOwner).toEqual('Not the contract owner');
    });

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
                const response = await thorSoloClient.contracts.executeCall(
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

    /**
     * Tests the error test cases for the `TestingContract` functions.
     */
    testingContractNegativeTestCases.forEach(
        ({ description, functionName, params, expected }) => {
            test(description, async () => {
                const response = await thorSoloClient.contracts.executeCall(
                    TESTING_CONTRACT_ADDRESS,
                    coder
                        .createInterface(TESTING_CONTRACT_ABI)
                        .getFunction(functionName) as FunctionFragment,
                    params
                );
                expect(response).toBe(expected);
            });
        }
    );

    /**
     * Test cases for EVM Extension functions
     */
    testingContractEVMExtensionTestCases.forEach(
        ({ description, functionName, params, expected }) => {
            test(description, async () => {
                const response = await thorSoloClient.contracts.executeCall(
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
            signer
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

        expect(events.at(events.length - 1)?.decodedData?.at(0)).toBe(123n);
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
            expectedData
        }) => {
            test(
                description,
                async () => {
                    const contractFactory =
                        thorSoloClient.contracts.createContractFactory(
                            contractAbi,
                            contractBytecode,
                            new VechainPrivateKeySigner(
                                Buffer.from(contractCaller, 'hex'),
                                new VechainProvider(thorSoloClient)
                            )
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

                    expect(eventLogs.map((x) => x.decodedData)).toEqual(
                        expectedData
                    );
                },
                10000
            );
        }
    );

    /**
     * Test suite for multiple clauses test cases
     */
    describe('Multiple clauses test cases', () => {
        multipleClausesTestCases.forEach((x) => {
            test(
                x.description,
                async () => {
                    // Create contract factories
                    const contractsFactories: ContractFactory[] =
                        x.contracts.map((contract) => {
                            return thorSoloClient.contracts.createContractFactory(
                                contract.contractAbi,
                                contract.contractBytecode,
                                new VechainPrivateKeySigner(
                                    Buffer.from(
                                        TEST_ACCOUNTS.TRANSACTION
                                            .CONTRACT_MANAGER.privateKey,
                                        'hex'
                                    ),
                                    new VechainProvider(thorSoloClient)
                                )
                            );
                        });

                    // Deploy contracts
                    const deployments = contractsFactories.map(
                        async (factory, index) => {
                            const deploymentParams =
                                x.contracts[index].deploymentParams;
                            return await (
                                deploymentParams !== undefined
                                    ? await factory.startDeployment(
                                          deploymentParams
                                      )
                                    : await factory.startDeployment()
                            ).waitForDeployment();
                        }
                    );

                    const contracts = await Promise.all(deployments);

                    // Define contract clauses
                    const contractClauses = x.contracts.flatMap(
                        (contract, index) => {
                            return contract.functionCalls.map(
                                (functionCall) => {
                                    return contracts[index].clause[
                                        functionCall.functionName
                                    ](...functionCall.params);
                                }
                            );
                        }
                    );

                    // Execute multiple clauses transaction
                    const transactionResult =
                        await thorSoloClient.contracts.executeMultipleClausesTransaction(
                            contractClauses,
                            new VechainPrivateKeySigner(
                                Buffer.from(
                                    TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER
                                        .privateKey,
                                    'hex'
                                ),
                                new VechainProvider(thorSoloClient)
                            )
                        );

                    const result = await transactionResult.wait();

                    expect(result?.reverted).toBe(false);
                    expect(result?.outputs.length).toBe(x.expectedResults);
                },
                10000
            );
        });
    });

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
