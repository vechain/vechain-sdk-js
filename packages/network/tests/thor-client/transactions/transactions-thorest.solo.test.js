"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_1 = require("../../fixture");
const sdk_core_1 = require("@vechain/sdk-core");
const fixture_thorest_1 = require("./fixture-thorest");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../src");
const test_utils_1 = require("../../test-utils");
/**
 * ThorClient class tests.
 *
 * @NOTE: This test suite run on solo network because it requires to send transactions.
 *
 * @group integration/clients/thor-client/transactions
 */
(0, globals_1.describe)('ThorClient - Transactions Module', () => {
    // ThorClient instance
    let thorSoloClient;
    (0, globals_1.beforeEach)(() => {
        thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
    });
    /**
     * sendTransaction tests
     */
    (0, globals_1.describe)('sendTransaction', () => {
        /**
         * SendTransaction - correct cases
         */
        fixture_thorest_1.sendTransactionErrors.correct.forEach((testCase) => {
            (0, globals_1.test)(testCase.testName, async () => {
                // 1- Init transaction
                // Get latest block
                const latestBlock = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.blocks.getBestBlockCompressed());
                // Estimate the gas required for the transfer transaction
                const gasResult = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.estimateGas(testCase.transaction.clauses, fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address));
                const chainTagId = await thorSoloClient.nodes.getChaintag();
                if (!chainTagId) {
                    throw new Error('Chain tag not found');
                }
                // Create transactions
                const transactionBody = {
                    chainTag: chainTagId,
                    blockRef: latestBlock !== null
                        ? latestBlock.id.slice(0, 18)
                        : '0x0',
                    expiration: 32,
                    clauses: testCase.transaction.clauses,
                    gasPriceCoef: 128,
                    gas: gasResult.totalGas,
                    dependsOn: null,
                    nonce: 12345678
                };
                const delegatedTransactionBody = {
                    chainTag: chainTagId,
                    blockRef: latestBlock !== null
                        ? latestBlock.id.slice(0, 18)
                        : '0x0',
                    expiration: 32,
                    clauses: testCase.transaction.clauses,
                    gasPriceCoef: 128,
                    gas: gasResult.totalGas,
                    dependsOn: null,
                    nonce: 12345678,
                    reserved: {
                        features: 1
                    }
                };
                // Normal signature and delegation signature
                const rawNormalSigned = sdk_core_1.Transaction.of(transactionBody).sign(sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey).bytes).encoded;
                const rawDelegatedSigned = sdk_core_1.Transaction.of(delegatedTransactionBody).signAsSenderAndGasPayer(sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey).bytes, sdk_core_1.HexUInt.of(fixture_1.TEST_ACCOUNTS.TRANSACTION.GAS_PAYER.privateKey)
                    .bytes).encoded;
                // 2 - Send transaction
                for (const raw of [rawNormalSigned, rawDelegatedSigned]) {
                    const send = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.sendRawTransaction(sdk_core_1.HexUInt.of(raw).toString()));
                    (0, globals_1.expect)(send).toBeDefined();
                    (0, globals_1.expect)(send).toHaveProperty('id');
                    (0, globals_1.expect)(sdk_core_1.HexUInt.isValid0x(send.id)).toBe(true);
                    // 3 - Get transaction AND transaction receipt
                    const transaction = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.getTransaction(send.id));
                    const transactionReceipt = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.getTransactionReceipt(send.id));
                    (0, globals_1.expect)(transaction).toBeDefined();
                    (0, globals_1.expect)(transactionReceipt).toBeDefined();
                }
            });
        });
        /**
         * SendTransaction - error cases
         */
        fixture_thorest_1.sendTransactionErrors.errors.forEach((testCase) => {
            (0, globals_1.test)(testCase.testName, async () => {
                await (0, globals_1.expect)(thorSoloClient.transactions.sendRawTransaction(testCase.transaction.raw)).rejects.toThrow(testCase.expected);
            });
        });
    });
    /**
     * Test suite for transaction simulations
     */
    (0, globals_1.describe)('simulateTransaction', () => {
        /**
         * Simulate transfer transactions
         */
        fixture_thorest_1.simulateTransaction.correct.transfer.forEach(({ testName, transaction, expected }) => {
            (0, globals_1.test)(testName, async () => {
                const simulatedTx = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.simulateTransaction(transaction.clauses, {
                    ...transaction.simulateTransactionOptions
                }));
                (0, globals_1.expect)(simulatedTx).toBeDefined();
                /**
                 * The result of the simulation tx is an array of simulation results.
                 * Each result represents the simulation of transaction clause.
                 */
                (0, globals_1.expect)(simulatedTx).toHaveLength(transaction.clauses.length);
                /**
                 * Compare each simulation result with the expected result.
                 */
                for (let i = 0; i < simulatedTx.length; i++) {
                    (0, globals_1.expect)((0, sdk_errors_1.stringifyData)(simulatedTx[i])).toStrictEqual((0, sdk_errors_1.stringifyData)(expected.simulationResults[i]));
                }
            });
        });
        /**
         * Simulate smart contract call transactions
         */
        fixture_thorest_1.simulateTransaction.correct.smartContractCall.forEach(({ testName, transaction, expected }) => {
            (0, globals_1.test)(testName, async () => {
                const simulatedTx = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.simulateTransaction(transaction.clauses, {
                    ...transaction.simulateTransactionOptions
                }));
                (0, globals_1.expect)(simulatedTx).toBeDefined();
                (0, globals_1.expect)(simulatedTx).toHaveLength(1);
                (0, globals_1.expect)((0, sdk_errors_1.stringifyData)(simulatedTx[0])).toStrictEqual((0, sdk_errors_1.stringifyData)(expected.simulationResults[0]));
            });
        });
        /**
         * Simulate smart contract deploy transactions
         */
        fixture_thorest_1.simulateTransaction.correct.deployContract.forEach(({ testName, transaction, expected }) => {
            (0, globals_1.test)(testName, async () => {
                const simulatedTx = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.simulateTransaction(transaction.clauses));
                (0, globals_1.expect)(simulatedTx).toBeDefined();
                (0, globals_1.expect)(simulatedTx).toHaveLength(1);
                (0, globals_1.expect)((0, sdk_errors_1.stringifyData)(simulatedTx[0])).toStrictEqual((0, sdk_errors_1.stringifyData)(expected.simulationResults[0]));
            });
        });
        /**
         * Simulate transactions where an error is expected
         */
        fixture_thorest_1.simulateTransaction.errors.forEach(({ testName, transaction, vmError }) => {
            (0, globals_1.test)(testName, async () => {
                const simulatedTx = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.simulateTransaction(transaction.clauses, {
                    ...transaction.simulateTransactionOptions
                }));
                (0, globals_1.expect)(simulatedTx).toBeDefined();
                (0, globals_1.expect)(simulatedTx).toHaveLength(1);
                (0, globals_1.expect)(simulatedTx[0].vmError).toStrictEqual(vmError);
                (0, globals_1.expect)(simulatedTx[0].reverted).toBe(true);
                (0, globals_1.expect)(simulatedTx[0].transfers).toHaveLength(0);
                (0, globals_1.expect)(simulatedTx[0].events).toHaveLength(0);
                (0, globals_1.expect)(simulatedTx[0].data).toStrictEqual('0x');
            });
        });
        /**
         * Simulate transaction with invalid revision
         */
        (0, globals_1.test)('simulateTransaction with invalid revision', async () => {
            await (0, globals_1.expect)(thorSoloClient.transactions.simulateTransaction([
                {
                    to: '0x',
                    data: '0x',
                    value: '0x0'
                }
            ], { revision: 'invalid-revision' })).rejects.toThrow(sdk_errors_1.InvalidDataType);
        });
    });
});
