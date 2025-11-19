"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable sonarjs/no-selector-parameter */
const globals_1 = require("@jest/globals");
const sdk_core_1 = require("@vechain/sdk-core");
const src_1 = require("../../../../src");
const fixture_1 = require("../../../fixture");
const fixture_thorest_1 = require("../../../thor-client/transactions/fixture-thorest");
const fixture_2 = require("./fixture");
const test_utils_1 = require("../../../test-utils");
/**
 * Helper function to conditionally run tests based on a condition
 */
const testIf = (condition, ...args) => {
    if (condition) {
        (0, globals_1.test)(...args);
    }
    else {
        globals_1.test.skip(...args);
    }
};
/**
 *VeChain base signer tests - solo
 *
 * @group integration/signers/vechain-base-signer-solo
 */
(0, globals_1.describe)('VeChain base signer tests - solo', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient;
    let isGalacticaActive;
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(async () => {
        thorClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        isGalacticaActive = await thorClient.forkDetector.detectGalactica();
    });
    /**
     * Test suite for signTransaction method
     */
    (0, globals_1.describe)('signTransactionTestCases', () => {
        /**
         * Legacy transaction test cases (using gasPriceCoef)
         */
        (0, globals_1.describe)('Legacy transactions', () => {
            const legacyTestCases = fixture_2.signTransactionTestCases.solo.correct.filter((testCase) => testCase.description.includes('legacy'));
            for (const { description, origin, options, params, isDelegated, expected } of legacyTestCases) {
                (0, globals_1.test)(description, async () => {
                    const sampleClause = sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(fixture_1.TESTING_CONTRACT_ADDRESS), sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction('deposit'), [123]);
                    const gasResult = await thorClient.transactions.estimateGas([sampleClause], origin.address);
                    const txBody = await thorClient.transactions.buildTransactionBody([sampleClause], gasResult.totalGas, {
                        isDelegated,
                        ...(params && {
                            gasPriceCoef: params.gasPriceCoef
                        })
                    });
                    // Get the signer and sign the transaction
                    const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(origin.privateKey).bytes, new src_1.VeChainProvider(thorClient, new src_1.ProviderInternalBaseWallet([], {
                        gasPayer: options
                    }), isDelegated));
                    const signedRawTx = await signer.signTransaction(src_1.signerUtils.transactionBodyToTransactionRequestInput(txBody, origin.address));
                    const signedTx = sdk_core_1.Transaction.decode(sdk_core_1.HexUInt.of(signedRawTx.slice(2)).bytes, true);
                    (0, globals_1.expect)(signedTx).toBeDefined();
                    console.log(signedTx.body);
                    (0, globals_1.expect)(signedTx.body).toMatchObject(expected.body);
                    (0, globals_1.expect)(signedTx.origin.toString()).toBe(sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of(origin.address)));
                    (0, globals_1.expect)(signedTx.isDelegated).toBe(isDelegated);
                    (0, globals_1.expect)(signedTx.isSigned).toBe(true);
                    (0, globals_1.expect)(signedTx.signature).toBeDefined();
                }, 8000);
            }
        });
        /**
         * EIP-1559 transaction test cases (using maxPriorityFeePerGas and maxFeePerGas)
         */
        (0, globals_1.describe)('EIP-1559 transactions', () => {
            const eip1559TestCases = fixture_2.signTransactionTestCases.solo.correct.filter((testCase) => testCase.description.includes('EIP-1559'));
            for (const { description, origin, options, params, isDelegated, expected } of eip1559TestCases) {
                testIf(isGalacticaActive, description, async () => {
                    const sampleClause = sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(fixture_1.TESTING_CONTRACT_ADDRESS), sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction('deposit'), [123]);
                    const gasResult = await thorClient.transactions.estimateGas([sampleClause], origin.address);
                    const txBody = await thorClient.transactions.buildTransactionBody([sampleClause], gasResult.totalGas, {
                        isDelegated
                    });
                    // Get the signer and sign the transaction
                    const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(origin.privateKey).bytes, new src_1.VeChainProvider(thorClient, new src_1.ProviderInternalBaseWallet([], {
                        gasPayer: options
                    }), isDelegated));
                    const txInput = src_1.signerUtils.transactionBodyToTransactionRequestInput(txBody, origin.address);
                    // Add EIP-1559 parameters
                    if (typeof params !== 'undefined') {
                        Object.assign(txInput, {
                            maxPriorityFeePerGas: params.maxPriorityFeePerGas,
                            maxFeePerGas: params.maxFeePerGas
                        });
                    }
                    const signedRawTx = await signer.signTransaction(txInput);
                    const signedTx = sdk_core_1.Transaction.decode(sdk_core_1.HexUInt.of(signedRawTx.slice(2)).bytes, true);
                    (0, globals_1.expect)(signedTx).toBeDefined();
                    console.log(signedTx.body);
                    (0, globals_1.expect)(signedTx.body).toMatchObject(expected.body);
                    (0, globals_1.expect)(signedTx.origin.toString()).toBe(sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of(origin.address)));
                    (0, globals_1.expect)(signedTx.isDelegated).toBe(isDelegated);
                    (0, globals_1.expect)(signedTx.isSigned).toBe(true);
                    (0, globals_1.expect)(signedTx.signature).toBeDefined();
                }, 8000);
            }
        });
        /**
         * Error cases - split by transaction type
         */
        (0, globals_1.describe)('Error cases - Legacy transactions', () => {
            const legacyErrorCases = fixture_2.signTransactionTestCases.solo.incorrect.filter((testCase) => testCase.description.includes('legacy'));
            for (const { description, origin, options, expectedError } of legacyErrorCases) {
                (0, globals_1.test)(description, async () => {
                    const sampleClause = sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(fixture_1.TESTING_CONTRACT_ADDRESS), sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction('setStateVariable'), [123]);
                    const txBody = await thorClient.transactions.buildTransactionBody([sampleClause], 0);
                    const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(origin.privateKey).bytes, new src_1.VeChainProvider(thorClient, new src_1.ProviderInternalBaseWallet([], {
                        gasPayer: options
                    }), true));
                    await (0, globals_1.expect)(signer.signTransaction(src_1.signerUtils.transactionBodyToTransactionRequestInput(txBody, origin.address))).rejects.toThrow(expectedError);
                }, 10000);
            }
        });
        (0, globals_1.describe)('Error cases - EIP-1559 transactions', () => {
            const eip1559ErrorCases = fixture_2.signTransactionTestCases.solo.incorrect.filter((testCase) => testCase.description.includes('EIP-1559'));
            for (const { description, origin, options, params, expectedError } of eip1559ErrorCases) {
                testIf(isGalacticaActive, description, async () => {
                    const sampleClause = sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(fixture_1.TESTING_CONTRACT_ADDRESS), sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction('setStateVariable'), [123]);
                    const txBody = await thorClient.transactions.buildTransactionBody([sampleClause], 0);
                    const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(origin.privateKey).bytes, new src_1.VeChainProvider(thorClient, new src_1.ProviderInternalBaseWallet([], {
                        gasPayer: options
                    }), true));
                    const txInput = src_1.signerUtils.transactionBodyToTransactionRequestInput(txBody, origin.address);
                    // Add EIP-1559 parameters
                    if (typeof params !== 'undefined') {
                        Object.assign(txInput, {
                            maxPriorityFeePerGas: params.maxPriorityFeePerGas,
                            maxFeePerGas: params.maxFeePerGas
                        });
                    }
                    await (0, globals_1.expect)(signer.signTransaction(txInput)).rejects.toThrow(expectedError);
                }, 10000);
            }
        });
    });
    /**
     * Test suite for call function.
     * @note Take some test cases are the same as the signTransaction function
     */
    (0, globals_1.describe)('call', () => {
        const testAccount = (0, fixture_1.getUnusedAccount)();
        /**
         * Test call function without clauses
         */
        (0, globals_1.test)('call with no clauses transaction', async () => {
            const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(testAccount.privateKey).bytes, new src_1.VeChainProvider(thorClient, new src_1.ProviderInternalBaseWallet([]), false));
            const result = await signer.call({});
            (0, globals_1.expect)(result).toBe('0x');
        });
        /**
         * Simulate transfer transactions
         */
        fixture_thorest_1.simulateTransaction.correct.transfer.forEach(({ testName, transaction, expected }) => {
            (0, globals_1.test)(testName, async () => {
                const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(transaction.simulateTransactionOptions
                    .callerPrivateKey).bytes, new src_1.VeChainProvider(thorClient, new src_1.ProviderInternalBaseWallet([]), false));
                const simulatedTx = await signer.call({
                    clauses: transaction.clauses
                });
                (0, globals_1.expect)(simulatedTx).toBeDefined();
                /**
                 * The result of the simulation tx is an array of simulation results.
                 * Each result represents the simulation of transaction clause.
                 */
                (0, globals_1.expect)(simulatedTx).toHaveLength(transaction.clauses.length);
                /**
                 * Compare each simulation result with the expected result.
                 */
                (0, globals_1.expect)(simulatedTx).toStrictEqual(expected.simulationResults[0].data);
            });
        });
        /**
         * Simulate smart contract call transactions
         */
        fixture_thorest_1.simulateTransaction.correct.smartContractCall.forEach(({ testName, transaction, expected }) => {
            (0, globals_1.test)(testName, async () => {
                const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(testAccount.privateKey).bytes, new src_1.VeChainProvider(thorClient, new src_1.ProviderInternalBaseWallet([]), false));
                const simulatedTx = await signer.call({
                    clauses: transaction.clauses
                }, transaction.simulateTransactionOptions != null
                    ? transaction.simulateTransactionOptions.revision
                    : undefined);
                (0, globals_1.expect)(simulatedTx).toBeDefined();
                (0, globals_1.expect)(simulatedTx).toBe(expected.simulationResults[0].data);
            });
        });
        (0, globals_1.test)('perform a transaction with custom gas', async () => {
            const sampleClause = sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(fixture_1.TESTING_CONTRACT_ADDRESS), sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction('deposit'), [123]);
            const txBody = await thorClient.transactions.buildTransactionBody([sampleClause], 6000000);
            // Set gasPriceCoef for legacy transaction
            txBody.gasPriceCoef = 0;
            // Get the signer and sign the transaction
            const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey).bytes, new src_1.VeChainProvider(thorClient));
            const signedRawTx = await signer.signTransaction(src_1.signerUtils.transactionBodyToTransactionRequestInput(txBody, fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address));
            const signedTx = sdk_core_1.Transaction.decode(sdk_core_1.HexUInt.of(signedRawTx.slice(2)).bytes, true);
            (0, globals_1.expect)(signedTx).toBeDefined();
            (0, globals_1.expect)(signedTx.body.gas).toEqual(6000000);
            (0, globals_1.expect)(signedTx.origin.toString()).toBe(sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address)));
            (0, globals_1.expect)(signedTx.isSigned).toBe(true);
            (0, globals_1.expect)(signedTx.signature).toBeDefined();
        }, 15000);
        testIf(isGalacticaActive, 'perform a transaction with maxFeePerGas and maxPriorityFeePerGas', async () => {
            const sampleClause = sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(fixture_1.TESTING_CONTRACT_ADDRESS), sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction('deposit'), [123]);
            const gasResult = await (0, test_utils_1.retryOperation)(async () => {
                return await thorClient.transactions.estimateGas([sampleClause], fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address);
            });
            const txBody = await (0, test_utils_1.retryOperation)(async () => {
                return await thorClient.transactions.buildTransactionBody([sampleClause], gasResult.totalGas);
            });
            // Add dynamic fee parameters - use numeric values directly
            txBody.maxFeePerGas = 256; // Decimal value of 0x100
            txBody.maxPriorityFeePerGas = 80; // Decimal value of 0x50
            // Get the signer and sign the transaction
            const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey).bytes, new src_1.VeChainProvider(thorClient));
            const signedRawTx = await (0, test_utils_1.retryOperation)(async () => {
                return await signer.signTransaction(src_1.signerUtils.transactionBodyToTransactionRequestInput(txBody, fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address));
            });
            const signedTx = sdk_core_1.Transaction.decode(sdk_core_1.HexUInt.of(signedRawTx.slice(2)).bytes, true);
            (0, globals_1.expect)(signedTx).toBeDefined();
            (0, globals_1.expect)(signedTx.body.maxFeePerGas).toEqual(256);
            (0, globals_1.expect)(signedTx.body.maxPriorityFeePerGas).toEqual(80);
            (0, globals_1.expect)(signedTx.origin.toString()).toBe(sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address)));
            (0, globals_1.expect)(signedTx.isSigned).toBe(true);
            (0, globals_1.expect)(signedTx.signature).toBeDefined();
        }, 15000);
    });
});
