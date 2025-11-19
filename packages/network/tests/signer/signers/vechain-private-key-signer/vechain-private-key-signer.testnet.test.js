"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable sonarjs/no-selector-parameter */
const globals_1 = require("@jest/globals");
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../../src");
const fixture_1 = require("../../../fixture");
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
 *VeChain base signer tests - testnet
 *
 * @group integration/signers/vechain-base-signer-testnet
 */
(0, globals_1.describe)('VeChain base signer tests - testnet', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient;
    let isGalacticaActive;
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(async () => {
        thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
        isGalacticaActive = await thorClient.forkDetector.detectGalactica();
    });
    /**
     * Positive case tests
     */
    (0, globals_1.describe)('Positive case - Signature', () => {
        /**
         * Legacy transaction tests (NOT delegated)
         */
        (0, globals_1.test)('Should be able to sign legacy transaction - NOT DELEGATED CASES', async () => {
            for (const fixture of fixture_2.signTransactionTestCases.testnet.correct) {
                if (!fixture.isDelegated &&
                    fixture.description.includes('legacy')) {
                    // Init the signer
                    const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture.origin.privateKey).bytes, new src_1.VeChainProvider(thorClient, (0, fixture_1.getUnusedBaseWallet)(), false));
                    // Prepare transaction input
                    const txInput = {
                        from: fixture.origin.address,
                        gasPriceCoef: 0 // Ensure legacy transaction uses gasPriceCoef
                    };
                    // Sign the transaction
                    const signedTransaction = await signer.signTransaction(txInput);
                    (0, globals_1.expect)(signedTransaction).toBeDefined();
                }
            }
        });
        /**
         * EIP-1559 transaction tests (NOT delegated)
         */
        testIf(isGalacticaActive, 'Should be able to sign EIP-1559 transaction - NOT DELEGATED CASES', async () => {
            for (const fixture of fixture_2.signTransactionTestCases.testnet
                .correct) {
                if (!fixture.isDelegated &&
                    fixture.description.includes('EIP-1559')) {
                    // Init the signer
                    const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture.origin.privateKey).bytes, new src_1.VeChainProvider(thorClient, (0, fixture_1.getUnusedBaseWallet)(), false));
                    // Prepare transaction input
                    const txInput = {
                        from: fixture.origin.address
                    };
                    // Add EIP-1559 parameters if present in fixture
                    if (typeof fixture.params !== 'undefined') {
                        Object.assign(txInput, {
                            maxPriorityFeePerGas: fixture.params.maxPriorityFeePerGas,
                            maxFeePerGas: fixture.params.maxFeePerGas
                        });
                    }
                    // Sign the transaction
                    const signedTransaction = await signer.signTransaction(txInput);
                    (0, globals_1.expect)(signedTransaction).toBeDefined();
                }
            }
        });
        /**
         * Legacy transaction tests (delegated)
         */
        (0, globals_1.test)('Should be able to sign legacy transaction - DELEGATED CASES', async () => {
            for (const fixture of fixture_2.signTransactionTestCases.testnet.correct) {
                if (fixture.isDelegated &&
                    fixture.description.includes('legacy')) {
                    // Init the signer
                    const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture.origin.privateKey).bytes, new src_1.VeChainProvider(thorClient, (0, fixture_1.getUnusedBaseWalletWithGasPayer)(fixture.options), true));
                    // Prepare transaction input
                    const txInput = {
                        from: fixture.origin.address,
                        gasPriceCoef: 0 // Ensure legacy transaction uses gasPriceCoef
                    };
                    // Sign the transaction
                    const signedTransaction = await signer.signTransaction(txInput);
                    (0, globals_1.expect)(signedTransaction).toBeDefined();
                }
            }
        }, 15000);
        /**
         * EIP-1559 transaction tests (delegated)
         */
        testIf(isGalacticaActive, 'Should be able to sign EIP-1559 transaction - DELEGATED CASES', async () => {
            for (const fixture of fixture_2.signTransactionTestCases.testnet
                .correct) {
                if (fixture.isDelegated &&
                    fixture.description.includes('EIP-1559')) {
                    // Init the signer
                    const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture.origin.privateKey).bytes, new src_1.VeChainProvider(thorClient, (0, fixture_1.getUnusedBaseWallet)(), true));
                    // Prepare transaction input
                    const txInput = {
                        from: fixture.origin.address
                    };
                    // Add EIP-1559 parameters if present in fixture
                    if (typeof fixture.params !== 'undefined') {
                        Object.assign(txInput, {
                            maxPriorityFeePerGas: fixture.params.maxPriorityFeePerGas,
                            maxFeePerGas: fixture.params.maxFeePerGas
                        });
                    }
                    // Sign the transaction with retry logic
                    const signedTransaction = await (0, test_utils_1.retryOperation)(async () => {
                        return await signer.signTransaction(txInput);
                    });
                    (0, globals_1.expect)(signedTransaction).toBeDefined();
                }
            }
        }, 15000);
        /**
         * Legacy transaction tests (delegation URL)
         */
        (0, globals_1.test)('Should be able to request delegation URLs per legacy transaction', async () => {
            for (const fixture of fixture_2.signTransactionTestCases.testnet.correct) {
                if (fixture.isDelegated &&
                    fixture.description.includes('legacy')) {
                    const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture.origin.privateKey).bytes, new src_1.VeChainProvider(thorClient, (0, fixture_1.getUnusedBaseWallet)(), false));
                    // Prepare transaction input
                    const txInput = {
                        from: fixture.origin.address,
                        delegationUrl: fixture.options.gasPayerServiceUrl,
                        gasPriceCoef: 0 // Ensure legacy transaction uses gasPriceCoef
                    };
                    // Sign the transaction
                    const signedTransaction = await signer.signTransaction(txInput);
                    (0, globals_1.expect)(signedTransaction).toBeDefined();
                }
            }
        });
        /**
         * EIP-1559 transaction tests (delegation URL)
         */
        testIf(isGalacticaActive, 'Should be able to request delegation URLs per EIP-1559 transaction', async () => {
            for (const fixture of fixture_2.signTransactionTestCases.testnet
                .correct) {
                if (fixture.isDelegated &&
                    fixture.description.includes('EIP-1559')) {
                    const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(fixture.origin.privateKey).bytes, new src_1.VeChainProvider(thorClient, (0, fixture_1.getUnusedBaseWallet)(), false));
                    // Prepare transaction input
                    const txInput = {
                        from: fixture.origin.address,
                        delegationUrl: fixture.options.gasPayerServiceUrl
                    };
                    // Add EIP-1559 parameters if present in fixture
                    if (typeof fixture.params !== 'undefined') {
                        Object.assign(txInput, {
                            maxPriorityFeePerGas: fixture.params.maxPriorityFeePerGas,
                            maxFeePerGas: fixture.params.maxFeePerGas
                        });
                    }
                    // Sign the transaction
                    const signedTransaction = await signer.signTransaction(txInput);
                    (0, globals_1.expect)(signedTransaction).toBeDefined();
                }
            }
        });
    });
    /**
     * Test suite for signTransaction using build transaction flow.
     * Test retro compatibility with thorClient signing flow.
     */
    (0, globals_1.describe)('signTransactionTestCases', () => {
        /**
         * Legacy transaction test cases (using gasPriceCoef)
         */
        (0, globals_1.describe)('Legacy transactions', () => {
            const legacyTestCases = fixture_2.signTransactionTestCases.testnet.correct.filter((testCase) => testCase.description.includes('legacy'));
            for (const { description, origin, options, params, isDelegated, expected } of legacyTestCases) {
                (0, globals_1.test)(description, async () => {
                    const thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
                    const sampleClause = sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(fixture_1.TESTING_CONTRACT_ADDRESS), sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction('setStateVariable'), [123]);
                    const gasResult = await thorClient.transactions.estimateGas([sampleClause], origin.address);
                    const txBody = await thorClient.transactions.buildTransactionBody([sampleClause], gasResult.totalGas, {
                        isDelegated,
                        ...(params && {
                            gasPriceCoef: params.gasPriceCoef
                        })
                    });
                    // Get the signer and sign the transaction
                    const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(origin.privateKey).bytes, new src_1.VeChainProvider(thorClient, (0, fixture_1.getUnusedBaseWalletWithGasPayer)(options), isDelegated));
                    const txInput = src_1.signerUtils.transactionBodyToTransactionRequestInput(txBody, origin.address);
                    const signedRawTx = await signer.signTransaction(txInput);
                    const signedTx = sdk_core_1.Transaction.decode(sdk_core_1.HexUInt.of(signedRawTx.slice(2)).bytes, true);
                    (0, globals_1.expect)(signedTx).toBeDefined();
                    (0, globals_1.expect)(signedTx.body).toMatchObject(expected.body);
                    (0, globals_1.expect)(signedTx.origin.toString()).toBe(sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of(origin.address)));
                    (0, globals_1.expect)(signedTx.isDelegated).toBe(isDelegated);
                    (0, globals_1.expect)(signedTx.isSigned).toBe(true);
                    (0, globals_1.expect)(signedTx.signature).toBeDefined();
                }, 15000);
            }
        });
        /**
         * EIP-1559 transaction test cases (using maxPriorityFeePerGas and maxFeePerGas)
         */
        (0, globals_1.describe)('EIP-1559 transactions', () => {
            const eip1559TestCases = fixture_2.signTransactionTestCases.testnet.correct.filter((testCase) => testCase.description.includes('EIP-1559'));
            for (const { description, origin, options, params, isDelegated, expected } of eip1559TestCases) {
                testIf(isGalacticaActive, description, async () => {
                    const thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
                    const sampleClause = sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(fixture_1.TESTING_CONTRACT_ADDRESS), sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction('setStateVariable'), [123]);
                    const gasResult = await thorClient.transactions.estimateGas([sampleClause], origin.address);
                    const txBody = await thorClient.transactions.buildTransactionBody([sampleClause], gasResult.totalGas, {
                        isDelegated
                    });
                    // Get the signer and sign the transaction
                    const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(origin.privateKey).bytes, new src_1.VeChainProvider(thorClient, (0, fixture_1.getUnusedBaseWalletWithGasPayer)(options), isDelegated));
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
                    (0, globals_1.expect)(signedTx.body).toMatchObject(expected.body);
                    (0, globals_1.expect)(signedTx.origin.toString()).toBe(sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of(origin.address)));
                    (0, globals_1.expect)(signedTx.isDelegated).toBe(isDelegated);
                    (0, globals_1.expect)(signedTx.isSigned).toBe(true);
                    (0, globals_1.expect)(signedTx.signature).toBeDefined();
                }, 15000);
            }
        });
        (0, globals_1.describe)('Error cases - EIP-1559 transactions', () => {
            const eip1559ErrorCases = fixture_2.signTransactionTestCases.testnet.incorrect.filter((testCase) => testCase.description.includes('EIP-1559'));
            for (const { description, origin, params } of eip1559ErrorCases) {
                testIf(isGalacticaActive, description, async () => {
                    const thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
                    const sampleClause = sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(fixture_1.TESTING_CONTRACT_ADDRESS), sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction('setStateVariable'), [123]);
                    const gasResult = await thorClient.transactions.estimateGas([sampleClause], origin.address);
                    const txBody = await thorClient.transactions.buildTransactionBody([sampleClause], gasResult.totalGas, {
                        isDelegated: false
                    });
                    // Get the signer and sign the transaction
                    const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(origin.privateKey).bytes, new src_1.VeChainProvider(thorClient, (0, fixture_1.getUnusedBaseWallet)(), false));
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
                    (0, globals_1.expect)(signedTx.isSigned).toBe(false);
                    (0, globals_1.expect)(signedTx.signature).toBeUndefined();
                }, 15000);
            }
        });
    });
    /**
     * Test cases for gas fee parameters
     */
    (0, globals_1.describe)('Gas fee parameters', () => {
        testIf(isGalacticaActive, 'Should sign transaction with maxPriorityFeePerGas parameter', async () => {
            const thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
            const account = fixture_2.signTransactionTestCases.testnet.correct[0].origin;
            const sampleClause = sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(fixture_1.TESTING_CONTRACT_ADDRESS), sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction('setStateVariable'), [123]);
            const gasResult = await thorClient.transactions.estimateGas([sampleClause], account.address);
            const txBody = await thorClient.transactions.buildTransactionBody([sampleClause], gasResult.totalGas, {
                isDelegated: false
            });
            const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(account.privateKey).bytes, new src_1.VeChainProvider(thorClient, (0, fixture_1.getUnusedBaseWallet)(), false));
            const maxPriorityFeePerGas = '0x1000';
            const txInput = {
                ...src_1.signerUtils.transactionBodyToTransactionRequestInput(txBody, account.address),
                maxPriorityFeePerGas
            };
            const signedRawTx = await signer.signTransaction(txInput);
            const signedTx = sdk_core_1.Transaction.decode(sdk_core_1.HexUInt.of(signedRawTx.slice(2)).bytes, true);
            (0, globals_1.expect)(signedTx).toBeDefined();
            (0, globals_1.expect)(signedTx.isSigned).toBe(true);
            (0, globals_1.expect)(signedTx.signature).toBeDefined();
        });
        testIf(isGalacticaActive, 'Should sign transaction with maxFeePerGas parameter', async () => {
            const thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
            const account = fixture_2.signTransactionTestCases.testnet.correct[0].origin;
            const sampleClause = sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(fixture_1.TESTING_CONTRACT_ADDRESS), sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction('setStateVariable'), [123]);
            const gasResult = await thorClient.transactions.estimateGas([sampleClause], account.address);
            const txBody = await thorClient.transactions.buildTransactionBody([sampleClause], gasResult.totalGas, {
                isDelegated: false
            });
            const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(account.privateKey).bytes, new src_1.VeChainProvider(thorClient, (0, fixture_1.getUnusedBaseWallet)(), false));
            const maxFeePerGas = '0x2000';
            const txInput = {
                ...src_1.signerUtils.transactionBodyToTransactionRequestInput(txBody, account.address),
                maxFeePerGas
            };
            const signedRawTx = await signer.signTransaction(txInput);
            const signedTx = sdk_core_1.Transaction.decode(sdk_core_1.HexUInt.of(signedRawTx.slice(2)).bytes, true);
            (0, globals_1.expect)(signedTx).toBeDefined();
            (0, globals_1.expect)(signedTx.isSigned).toBe(true);
            (0, globals_1.expect)(signedTx.signature).toBeDefined();
        });
        testIf(isGalacticaActive, 'Should sign transaction with both maxPriorityFeePerGas and maxFeePerGas parameters', async () => {
            const thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
            const account = fixture_2.signTransactionTestCases.testnet.correct[0].origin;
            const sampleClause = sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(fixture_1.TESTING_CONTRACT_ADDRESS), sdk_core_1.ABIContract.ofAbi(fixture_1.TESTING_CONTRACT_ABI).getFunction('setStateVariable'), [123]);
            const gasResult = await thorClient.transactions.estimateGas([sampleClause], account.address);
            const txBody = await thorClient.transactions.buildTransactionBody([sampleClause], gasResult.totalGas, {
                isDelegated: false
            });
            const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of(account.privateKey).bytes, new src_1.VeChainProvider(thorClient, (0, fixture_1.getUnusedBaseWallet)(), false));
            const maxPriorityFeePerGas = '0x1000';
            const maxFeePerGas = '0x2000';
            const txInput = {
                ...src_1.signerUtils.transactionBodyToTransactionRequestInput(txBody, account.address),
                maxPriorityFeePerGas,
                maxFeePerGas
            };
            const signedRawTx = await signer.signTransaction(txInput);
            const signedTx = sdk_core_1.Transaction.decode(sdk_core_1.HexUInt.of(signedRawTx.slice(2)).bytes, true);
            (0, globals_1.expect)(signedTx).toBeDefined();
            (0, globals_1.expect)(signedTx.isSigned).toBe(true);
            (0, globals_1.expect)(signedTx.signature).toBeDefined();
        });
    });
    (0, globals_1.describe)('resolveName(name)', () => {
        (0, globals_1.test)('Should be able to resolve an address by name', async () => {
            const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of('7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158').bytes, new src_1.VeChainProvider(thorClient, (0, fixture_1.getUnusedBaseWallet)(), false));
            const address = await signer.resolveName('test-sdk.vet');
            (0, globals_1.expect)(address).toBe('0x105199a26b10e55300CB71B46c5B5e867b7dF427');
        });
        (0, globals_1.test)('Should resolve to null for unknown names', async () => {
            const signer = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of('7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158').bytes, new src_1.VeChainProvider(thorClient, (0, fixture_1.getUnusedBaseWallet)(), false));
            const address = await signer.resolveName('unknown.test-sdk.vet');
            (0, globals_1.expect)(address).toBe(null);
        });
    });
    /**
     * Signer negative cases
     */
    (0, globals_1.describe)('Negative cases', () => {
        /**
         * Wrong private key
         */
        (0, globals_1.test)('Should throw an error when the private key is wrong', () => {
            (0, globals_1.expect)(() => new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of('10').bytes)).toThrowError(sdk_errors_1.InvalidSecp256k1PrivateKey);
        });
        /**
         * When thorClient / provider are not set, some function cannot be called
         */
        (0, globals_1.test)('Signer without a provider should throw errors when call some functions', async () => {
            const noProviderSigner = new src_1.VeChainPrivateKeySigner(sdk_core_1.HexUInt.of('7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158').bytes);
            // Impossible to call "populateTransaction" without a provider
            await (0, globals_1.expect)(noProviderSigner.populateTransaction({})).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
            // Impossible to call "estimateGas" without a provider
            await (0, globals_1.expect)(noProviderSigner.estimateGas({})).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
            // Impossible to call "call" without a provider
            await (0, globals_1.expect)(noProviderSigner.call({})).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
            // Impossible to call "sendTransaction" without a provider
            await (0, globals_1.expect)(noProviderSigner.sendTransaction({})).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
            // Impossible to call "signTransaction" without a provider
            await (0, globals_1.expect)(noProviderSigner.signTransaction({})).rejects.toThrowError(sdk_errors_1.JSONRPCInvalidParams);
        });
    });
});
