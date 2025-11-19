"use strict";
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const assert_1 = require("assert");
const src_1 = require("../../../src");
const fixture_1 = require("../../fixture");
const fixture_2 = require("./fixture");
const sdk_solo_setup_1 = require("@vechain/sdk-solo-setup");
const test_utils_1 = require("../../test-utils");
/**
 * Tests for the ThorClient class, specifically focusing on contract-related functionality.
 *
 * @NOTE: This test suite runs on the solo network because it requires sending transactions.
 *
 * @group integration/client/thor-client/contracts
 */
(0, globals_1.describe)('ThorClient - Contracts', () => {
    // ThorClient instance
    let thorSoloClient;
    // Signer instance
    let signer;
    // Signer instance
    let receiverSigner;
    (0, globals_1.beforeEach)(() => {
        thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey).bytes, new src_1.VeChainProvider(thorSoloClient));
        receiverSigner = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.privateKey).bytes, new src_1.VeChainProvider(thorSoloClient));
    });
    /**
     * Asynchronous function to deploy an example smart contract.
     *
     * @returns A promise that resolves to a `TransactionSendResult` object representing the result of the deployment.
     */
    async function createExampleContractFactory() {
        const deployParams = { types: 'uint', values: ['100'] };
        const contractFactory = thorSoloClient.contracts.createContractFactory(fixture_2.deployedContractAbi, fixture_2.contractBytecode, signer);
        // Start the deployment of the contract
        return await contractFactory.startDeployment(deployParams);
    }
    /**
     * Test case for deploying a smart contract using the contract factory.
     */
    (0, globals_1.test)('create a new contract and call it', () => {
        // Poll until the transaction receipt is available
        const contract = new src_1.Contract('0x123', fixture_2.deployedContractAbi, thorSoloClient.contracts, signer);
        (0, globals_1.expect)(contract.address).toBeDefined();
        (0, globals_1.expect)(contract.abi).toBeDefined();
    }, 10000);
    /**
     * Test case for deploying a smart contract using the contract factory.
     */
    (0, globals_1.test)('create a new contract', () => {
        // Poll until the transaction receipt is available
        const contract = new src_1.Contract('0x123', fixture_2.deployedContractAbi, thorSoloClient.contracts, signer);
        (0, globals_1.expect)(contract.address).toBeDefined();
        (0, globals_1.expect)(contract.abi).toBeDefined();
    }, 10000);
    /**
     * Test case for deploying a smart contract using the contract factory.
     */
    (0, globals_1.test)('deploy a contract', async () => {
        // Deploy an example contract and get the transaction response
        const response = await createExampleContractFactory();
        // Poll until the transaction receipt is available
        const contract = await (0, test_utils_1.retryOperation)(async () => await response.waitForDeployment(), 5, // maxAttempts
        2000 // baseDelay
        );
        (0, globals_1.expect)(contract.address).toBeDefined();
        (0, globals_1.expect)(contract.abi).toBeDefined();
        (0, globals_1.expect)(contract.deployTransactionReceipt).toBeDefined();
        // Extract the contract address from the transaction receipt
        const contractAddress = contract.address;
        // Call the get function of the deployed contract to verify that the stored value is 100
        const result = await (0, test_utils_1.retryOperation)(async () => contract.read.get());
        (0, globals_1.expect)(result).toEqual([100n]);
        // Assertions
        (0, globals_1.expect)(contract.deployTransactionReceipt?.reverted).toBe(false);
        (0, globals_1.expect)(contract.deployTransactionReceipt?.outputs).toHaveLength(1);
        (0, globals_1.expect)(sdk_core_1.Address.isValid(contractAddress)).toBe(true);
    }, 10000);
    /**
     * Test case for a failed smart contract using the contract factory.
     */
    (0, globals_1.test)('failed contract deployment', async () => {
        // Create a contract factory
        let contractFactory = thorSoloClient.contracts.createContractFactory(fixture_2.deployedContractAbi, fixture_2.contractBytecode, signer);
        // Start the deployment of the contract
        contractFactory = await contractFactory.startDeployment();
        // Wait for the deployment to complete and obtain the contract instance
        await (0, globals_1.expect)((0, test_utils_1.retryOperation)(async () => contractFactory.waitForDeployment())).rejects.toThrow(sdk_errors_1.ContractDeploymentFailed);
    }, 10000);
    /**
     * Test case for waiting for a contract deployment not started.
     */
    (0, globals_1.test)('wait for a contract deployment not started', async () => {
        // Create a contract factory
        const contractFactory = thorSoloClient.contracts.createContractFactory(fixture_2.deployedContractAbi, fixture_2.contractBytecode, signer);
        // Waiting for a deployment that has not started
        await (0, globals_1.expect)((0, test_utils_1.retryOperation)(async () => contractFactory.waitForDeployment())).rejects.toThrow(sdk_errors_1.CannotFindTransaction);
    }, 10000);
    /**
     * Test case for retrieving the bytecode of a deployed smart contract.
     */
    (0, globals_1.test)('get Contract Bytecode', async () => {
        // Create a contract factory already deploying the example contract
        const factory = await createExampleContractFactory();
        // Wait for the deployment to complete and obtain the contract instance
        const contract = await (0, test_utils_1.retryOperation)(async () => factory.waitForDeployment());
        // Retrieve the bytecode of the deployed contract
        const contractBytecodeResponse = await (0, test_utils_1.retryOperation)(async () => thorSoloClient.accounts.getBytecode(sdk_core_1.Address.of(contract.address)));
        // Assertion: Compare with the expected deployed contract bytecode
        (0, globals_1.expect)(`${contractBytecodeResponse}`).toBe(fixture_2.deployedContractBytecode);
    }, 10000);
    /**
     * Test case for deploying a smart contract using the contract factory.
     */
    (0, globals_1.test)('call a contract function', async () => {
        // Create a contract factory that is already deploying the example contract
        const factory = await createExampleContractFactory();
        // Wait for the deployment to complete and obtain the contract instance
        const contract = await (0, test_utils_1.retryOperation)(async () => factory.waitForDeployment());
        const callFunctionSetResponse = await (0, test_utils_1.retryOperation)(async () => contract.transact.set(123n));
        const transactionReceiptCallSetContract = (await callFunctionSetResponse.wait());
        (0, globals_1.expect)(transactionReceiptCallSetContract.reverted).toBe(false);
        const callFunctionGetResult = await (0, test_utils_1.retryOperation)(async () => contract.read.get());
        (0, globals_1.expect)(callFunctionGetResult).toEqual([123n]);
    }, 10000);
    /**
     * Test case for calling a contract function with options.
     */
    (0, globals_1.test)('call a contract function with options', async () => {
        // Create a contract factory that is already deploying the example contract
        const factory = await createExampleContractFactory();
        // Wait for the deployment to complete and obtain the contract instance
        const contract = await factory.waitForDeployment();
        await (await contract.transact.set(123n)).wait();
        (0, globals_1.expect)(await contract.read.get()).toEqual([123n]);
        contract.setContractReadOptions({ caller: 'invalid address' });
        // The contract call should fail because the caller address is invalid
        await (0, globals_1.expect)(contract.read.get()).rejects.toThrow();
        contract.clearContractReadOptions();
        contract.setContractTransactOptions({
            gasPriceCoef: 2442442,
            expiration: 32
        });
        contract.clearContractTransactOptions();
        await (await contract.transact.set(22323n)).wait();
        (0, globals_1.expect)(await contract.read.get()).toEqual([22323n]);
    }, 15000);
    /**
     * Test case for calling a contract function with different private keys.
     */
    (0, globals_1.test)('call a contract function with different signer', async () => {
        // Create a contract factory that is already deploying the example contract
        const factory = await createExampleContractFactory();
        // Wait for the deployment to complete and obtain the contract instance
        const contract = await factory.waitForDeployment();
        // Set signer with another private key
        contract.setSigner(new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.privateKey).bytes, new src_1.VeChainProvider(thorSoloClient)));
        // The contract call should fail because the private key is not set
        // await expect(contract.transact.set(123n)).rejects.toThrow();
        contract.setSigner(signer);
        await (await contract.transact.set(123n)).wait();
        const callFunctionGetResult = await contract.read.get();
        (0, globals_1.expect)(callFunctionGetResult).toEqual([123n]);
    }, 10000);
    /**
     * Test case for loading a deployed contract and calling its functions.
     */
    (0, globals_1.test)('load a deployed contract and call its functions', async () => {
        // Create a contract factory that is already deploying the example contract
        const factory = await createExampleContractFactory();
        // Wait for the deployment to complete and obtain the contract instance
        const contract = await factory.waitForDeployment();
        // Load the deployed contract using the contract address, ABI and private key
        const loadedContract = thorSoloClient.contracts.load(contract.address, fixture_2.deployedContractAbi);
        // Call the get function of the loaded contract to verify that the stored value is 100
        let callFunctionGetResult = await loadedContract.read.get();
        (0, globals_1.expect)(callFunctionGetResult).toEqual([100n]);
        // Set the private key of the caller for signing transactions
        loadedContract.setSigner(contract.getSigner());
        // Call the set function of the loaded contract to set the value to 123
        const callFunctionSetResponse = await loadedContract.transact.set(123n);
        // Wait for the transaction to complete and obtain the transaction receipt
        const transactionReceiptCallSetContract = (await callFunctionSetResponse.wait());
        (0, globals_1.expect)(transactionReceiptCallSetContract.reverted).toBe(false);
        callFunctionGetResult = await loadedContract.read.get();
        // Assertion: The value should be 123
        (0, globals_1.expect)(callFunctionGetResult).toEqual([123n]);
    }, 10000);
    /**
     * Test case for loading a deployed contract and trying to get not existing functions and events.
     */
    (0, globals_1.test)('load a deployed contract and try to get not existing functions and events', async () => {
        // Create a contract factory that is already deploying the example contract
        const factory = await createExampleContractFactory();
        // Wait for the deployment to complete and obtain the contract instance
        const contract = await factory.waitForDeployment();
        // Load the deployed contract using the contract address, ABI and private key
        const loadedContract = thorSoloClient.contracts.load(contract.address, fixture_2.deployedContractAbi);
        // The get function ABI call should fail because the function does not exist
        (0, globals_1.expect)(() => loadedContract.getFunctionAbi('notExistingFunction')).toThrow();
        // The get event ABI call should fail because the event does not exist
        (0, globals_1.expect)(() => loadedContract.getEventAbi('notExistingFunction')).toThrow();
    }, 10000);
    /**
     * Test case for loading a deployed contract without adding a private key
     */
    (0, globals_1.test)('load a deployed contract without adding a private key and transact', async () => {
        // Create a contract factory that is already deploying the example contract
        const factory = await createExampleContractFactory();
        // Wait for the deployment to complete and obtain the contract instance
        const contract = await factory.waitForDeployment();
        // Load the deployed contract using the contract address, ABI and private key
        const loadedContract = thorSoloClient.contracts.load(contract.address, fixture_2.deployedContractAbi);
        // The contract call should fail because the private key is not set
        await (0, globals_1.expect)(loadedContract.transact.set(123n)).rejects.toThrowError(sdk_errors_1.InvalidTransactionField);
    }, 10000);
    /**
     * Test case for creating a filter for a contract event.
     */
    (0, globals_1.test)('Create a filter for a four args event', () => {
        // Load the deployed contract using the contract address, ABI and private key
        const loadedContract = thorSoloClient.contracts.load('0x0000000000000000000000000000456e65726779', fixture_2.fourArgsEventAbi);
        const contractFilter = loadedContract.filters.DataUpdated({
            sender: '0x0000000000000000000000000000456e65726779',
            key: 10n,
            oldValue: 10n,
            newValue: 10n
        });
        (0, globals_1.expect)(contractFilter).toBeDefined();
        (0, globals_1.expect)(contractFilter.criteriaSet[0].criteria.topic0).toBeDefined();
        (0, globals_1.expect)(contractFilter.criteriaSet[0].criteria.topic1).toBeDefined();
        (0, globals_1.expect)(contractFilter.criteriaSet[0].criteria.topic2).toBeDefined();
        (0, globals_1.expect)(contractFilter.criteriaSet[0].criteria.topic3).toBeDefined();
        (0, globals_1.expect)(contractFilter.criteriaSet[0].criteria.topic4).toBeDefined();
    }, 10000);
    (0, globals_1.test)('Deploy the deposit contract and call the deposit method', async () => {
        const depositContractFactory = thorSoloClient.contracts.createContractFactory(fixture_2.depositContractAbi, fixture_2.depositContractBytecode, signer);
        const depositContract = await depositContractFactory.startDeployment();
        const deployedDepositContract = await depositContract.waitForDeployment();
        const result = await deployedDepositContract.transact.deposit({
            value: 1000
        });
        await result.wait();
        (0, globals_1.expect)(await deployedDepositContract.read.getBalance(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address)).toEqual([1000n]);
    }, 10000);
    (0, globals_1.test)('Deploy a contract that returns two values', async () => {
        const twoValuesReturnContractFactory = thorSoloClient.contracts.createContractFactory(fixture_2.sampleTwoValuesReturnAbi, fixture_2.sampleTwoValuesReturnBytecode, signer);
        const twoValuesReturnContract = await twoValuesReturnContractFactory.startDeployment();
        const deployedTwoValuesReturnContractContract = await twoValuesReturnContract.waitForDeployment();
        const [firstResultA, firstResultB] = await deployedTwoValuesReturnContractContract.read.a();
        const resultB = await deployedTwoValuesReturnContractContract.read.b();
        (0, globals_1.expect)(firstResultA).toEqual(1n);
        (0, globals_1.expect)(firstResultB).toEqual('a');
        (0, globals_1.expect)(resultB).toEqual([]);
    }, 10000);
    /**
     * Test case for deploying a contract with ownership restrictions.
     */
    (0, globals_1.test)('Deploy the ownership restricted contract and call it', async () => {
        const contractFactory = thorSoloClient.contracts.createContractFactory(fixture_2.OWNER_RESTRICTION_ABI, fixture_2.OWNER_RESTRICTION_BYTECODE, signer);
        const factory = await contractFactory.startDeployment();
        const deployedContract = await factory.waitForDeployment();
        const [secretData] = await deployedContract.read.getSecretData();
        (0, globals_1.expect)(secretData).toEqual(42n);
        const loadedContract = thorSoloClient.contracts.load(deployedContract.address, fixture_2.OWNER_RESTRICTION_ABI, receiverSigner);
        try {
            await loadedContract.read.getSecretData();
            (0, assert_1.fail)('Should fail');
        }
        catch (error) {
            if (error instanceof Error) {
                (0, globals_1.expect)(error.message).toEqual(`Method 'getSecretData()' failed.` +
                    `\n-Reason: 'Not the contract owner'` +
                    `\n-Parameters: \n\t` +
                    `{\n  "contractAddress": "${deployedContract.address}"\n}`);
            }
        }
    });
    /**
     * Test case for loading a deployed contract and trying to get not existing functions and events.
     */
    (0, globals_1.test)('load a deployed contract and create clauses with comments', async () => {
        // Create a contract factory that is already deploying the example contract
        const factory = await createExampleContractFactory();
        // Wait for the deployment to complete and obtain the contract instance
        const contract = await factory.waitForDeployment();
        // Load the deployed contract using the contract address, ABI and private key
        const loadedContract = thorSoloClient.contracts.load(contract.address, fixture_2.deployedContractAbi);
        const clauseSet1 = loadedContract.clause.set({
            comment: 'set the value in the contract to 123'
        }, 123n);
        const clauseSet2 = loadedContract.clause.set({ comment: 'set the value in the contract to 321' }, 321n);
        (0, globals_1.expect)(clauseSet1).toBeDefined();
        (0, globals_1.expect)(clauseSet2).toBeDefined();
        (0, globals_1.expect)(clauseSet1.clause.comment).toBe('set the value in the contract to 123');
        (0, globals_1.expect)(clauseSet1.clause.abi).toEqual('{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}');
        (0, globals_1.expect)(clauseSet2.clause.comment).toBe('set the value in the contract to 321');
        (0, globals_1.expect)(clauseSet2.clause.abi).toEqual('{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}');
    }, 10000);
    (0, globals_1.test)('load a deployed contract and create clauses with revision', async () => {
        // Create a contract factory that is already deploying the example contract
        const factory = await createExampleContractFactory();
        // Wait for the deployment to complete and obtain the contract instance
        const contract = await factory.waitForDeployment();
        // Load the deployed contract using the contract address, ABI and private key
        const loadedContract = thorSoloClient.contracts.load(contract.address, fixture_2.deployedContractAbi);
        const clauseSet1 = loadedContract.clause.set({
            revision: 'finalized'
        }, 123n);
        const clauseSet2 = loadedContract.clause.set({ comment: 'set the value in the contract to 321' }, 321n);
        (0, globals_1.expect)(clauseSet1.clause.abi).toEqual('{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}');
        (0, globals_1.expect)(clauseSet2.clause.abi).toEqual('{"inputs":[{"internalType":"uint256","name":"x","type":"uint256"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"}');
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
    fixture_2.testingContractTestCases.forEach(({ description, functionName, params, expected }) => {
        (0, globals_1.test)(description, async () => {
            const response = await thorSoloClient.contracts.executeCall(fixture_1.TESTING_CONTRACT_ADDRESS, sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction(functionName), params);
            (0, globals_1.expect)(response).toEqual(expected);
        });
    });
    /**
     * Tests the error test cases for the `TestingContract` functions.
     */
    fixture_2.testingContractNegativeTestCases.forEach(({ description, functionName, params, expected }) => {
        (0, globals_1.test)(description, async () => {
            const response = await thorSoloClient.contracts.executeCall(fixture_1.TESTING_CONTRACT_ADDRESS, sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction(functionName), params);
            (0, globals_1.expect)(response).toStrictEqual(expected);
        });
    });
    /**
     * Test cases for EVM Extension functions (excluding dynamic tests)
     */
    fixture_2.testingContractEVMExtensionTestCases
        .filter(({ functionName }) => functionName !== 'getBlockID')
        .forEach(({ description, functionName, params, expected }) => {
        (0, globals_1.test)(description, async () => {
            const response = await thorSoloClient.contracts.executeCall(fixture_1.TESTING_CONTRACT_ADDRESS, sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction(functionName), params);
            (0, globals_1.expect)(response).toEqual(expected);
        });
    });
    /**
     * Dynamic test for getBlockID function that fetches actual genesis block ID
     */
    (0, globals_1.test)('should return the blockID of the given block number (dynamic)', async () => {
        // Fetch the actual genesis block from the solo network
        const genesisBlock = await thorSoloClient.blocks.getGenesisBlock();
        (0, globals_1.expect)(genesisBlock).not.toBeNull();
        const expectedBlockId = genesisBlock.id;
        // Call the contract function to get block ID for block 0
        const response = await thorSoloClient.contracts.executeCall(fixture_1.TESTING_CONTRACT_ADDRESS, sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction('getBlockID'), [0]);
        // Verify the response matches the actual genesis block ID
        (0, globals_1.expect)(response).toEqual({
            result: {
                array: [expectedBlockId],
                plain: expectedBlockId
            },
            success: true
        });
    });
    (0, globals_1.test)('Should filter the StateChanged event of the testing contract', async () => {
        const contract = thorSoloClient.contracts.load(fixture_1.TESTING_CONTRACT_ADDRESS, fixture_1.TESTING_CONTRACT_ABI, signer);
        await (await contract.transact.setStateVariable(123n)).wait();
        const events = await contract.filters
            .StateChanged({
            newValue: undefined,
            oldValue: undefined,
            sender: `0x${sdk_core_1.Address.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address).digits}`
        })
            .get();
        (0, globals_1.expect)(events).toBeDefined();
        (0, globals_1.expect)(events.at(events.length - 1)?.decodedData?.at(0)).toBe(123n);
    });
    fixture_2.filterContractEventsTestCases.forEach(({ description, contractBytecode, contractAbi, contractCaller, functionCalls, eventName, getParams, args, expectedData }) => {
        (0, globals_1.test)(description, async () => {
            const contractFactory = thorSoloClient.contracts.createContractFactory(contractAbi, contractBytecode, new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(contractCaller).bytes, new src_1.VeChainProvider(thorSoloClient)));
            const factory = await contractFactory.startDeployment();
            const contract = await factory.waitForDeployment();
            for (const functionCall of functionCalls) {
                if (functionCall.type === 'read') {
                    // @ts-ignore
                    await contract.read[functionCall.functionName](...functionCall.params);
                }
                else {
                    // @ts-ignore
                    const result = await contract.transact[functionCall.functionName](...functionCall.params);
                    await result.wait();
                }
            }
            const eventLogs = await contract.filters[eventName](args).get(getParams);
            (0, globals_1.expect)(eventLogs.map((x) => x.decodedData)).toEqual(expectedData);
        }, 10000);
    });
    /**
     * Test suite for multiple clauses test cases
     */
    (0, globals_1.describe)('Multiple clauses test cases', () => {
        fixture_2.multipleClausesTestCases.forEach((x) => {
            (0, globals_1.test)(x.description, async () => {
                // Create contract factories
                const contractsFactories = x.contracts.map((contract) => {
                    return thorSoloClient.contracts.createContractFactory(contract.contractAbi, contract.contractBytecode, new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER
                        .privateKey).bytes, new src_1.VeChainProvider(thorSoloClient)));
                });
                // Deploy contracts
                const deployments = contractsFactories.map(async (factory, index) => {
                    const deploymentParams = x.contracts[index].deploymentParams;
                    return await (deploymentParams !== undefined
                        ? await factory.startDeployment(deploymentParams)
                        : await factory.startDeployment()).waitForDeployment();
                });
                const contracts = await Promise.all(deployments);
                // Define contract clauses
                const contractClauses = x.contracts.flatMap((contract, index) => {
                    return contract.functionCalls.map((functionCall) => {
                        return contracts[index].clause[functionCall.functionName](...functionCall.params);
                    });
                });
                // Execute multiple clauses transaction
                const transactionResult = await thorSoloClient.contracts.executeMultipleClausesTransaction(contractClauses, new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.CONTRACT_MANAGER
                    .privateKey).bytes, new src_1.VeChainProvider(thorSoloClient)));
                const result = await transactionResult.wait();
                (0, globals_1.expect)(result?.reverted).toBe(false);
                (0, globals_1.expect)(result?.outputs.length).toBe(x.expectedResults);
            }, 10000);
        });
    });
    /**
     * Test suite for 'getLegacyBaseGasPrice' method
     */
    (0, globals_1.describe)('getLegacyBaseGasPrice', () => {
        (0, globals_1.test)('Should return the base gas price of the Solo network', async () => {
            const baseGasPrice = await thorSoloClient.contracts.getLegacyBaseGasPrice();
            (0, globals_1.expect)(baseGasPrice).toEqual({
                success: true,
                result: {
                    plain: sdk_solo_setup_1.THOR_SOLO_DEFAULT_BASE_FEE_PER_GAS,
                    array: [sdk_solo_setup_1.THOR_SOLO_DEFAULT_BASE_FEE_PER_GAS]
                }
            });
        });
    });
});
