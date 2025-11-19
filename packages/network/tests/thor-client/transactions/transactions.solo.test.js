"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_1 = require("./fixture");
const fixture_2 = require("../../fixture");
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../src");
const test_utils_1 = require("../../test-utils");
/**
 * Transactions module tests.
 *
 * @group integration/clients/thor-client/transactions
 */
(0, globals_1.describe)('ThorClient - Transactions Module', () => {
    // ThorClient instance for the Solo network
    const thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
    /**
     * Test suite for sendTransaction method
     * For further testing examples see tests/clients/thorest-client/transactions/*
     */
    (0, globals_1.describe)('sendTransaction', () => {
        (0, globals_1.test)("Should throw error if transaction isn't signed", async () => {
            // Estimate the gas required for the transfer transaction
            const gasResult = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.estimateGas([fixture_1.transfer1VTHOClause], fixture_2.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address));
            const nonce = fixture_1.transactionNonces.shouldThrowErrorIfTransactionIsntSigned[0];
            const txBody = await thorSoloClient.transactions.buildTransactionBody([fixture_1.transfer1VTHOClause], gasResult.totalGas, { nonce });
            // Create the unsigned transfer transaction
            const tx = sdk_core_1.Transaction.of(txBody);
            await (0, globals_1.expect)(thorSoloClient.transactions.sendTransaction(tx)).rejects.toThrow(sdk_errors_1.InvalidDataType);
        }, 50000);
    });
    /**
     * Test suite for waitForTransaction method
     */
    (0, globals_1.describe)('waitForTransaction', () => {
        /**
         * waitForTransaction test cases with different options
         */
        fixture_1.waitForTransactionTestCases.forEach(({ description, options }) => {
            (0, globals_1.test)(description, async () => {
                // Estimate the gas required for the transfer transaction
                const gasResult = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.estimateGas([fixture_1.transfer1VTHOClause], fixture_2.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                    .address));
                const nonce = options.nonce;
                const txBody = await thorSoloClient.transactions.buildTransactionBody([fixture_1.transfer1VTHOClause], gasResult.totalGas, { nonce });
                const tx = sdk_core_1.Transaction.of(txBody).sign(sdk_core_1.HexUInt.of(fixture_2.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                    .privateKey).bytes);
                // Send the transaction and obtain the transaction ID
                const sendTransactionResult = await thorSoloClient.transactions.sendTransaction(tx);
                (0, globals_1.expect)(sendTransactionResult).toBeDefined();
                (0, globals_1.expect)(sendTransactionResult.id).toBeDefined();
                // Wait for the transaction to be included in a block
                const txReceipt = await thorSoloClient.transactions.waitForTransaction(sendTransactionResult.id, options);
                (0, globals_1.expect)(txReceipt).toBeDefined();
                (0, globals_1.expect)(txReceipt?.reverted).toBe(fixture_1.expectedReceipt.reverted);
                (0, globals_1.expect)(txReceipt?.outputs).toEqual(fixture_1.expectedReceipt.outputs);
                (0, globals_1.expect)(txReceipt?.gasUsed).toBe(fixture_1.expectedReceipt.gasUsed);
                (0, globals_1.expect)(txReceipt?.gasPayer).toBe(fixture_1.expectedReceipt.gasPayer);
                (0, globals_1.expect)(sendTransactionResult.id).toBe(txReceipt?.meta.txID);
            }, 10000);
        });
        /**
         * test that send transaction with a number as value in transaction body
         */
        (0, globals_1.test)('test a send transaction with a number as value in transaction body ', async () => {
            // Estimate the gas required for the transfer transaction
            const gasResult = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.estimateGas([fixture_1.transfer1VTHOClause], fixture_2.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address));
            const nonce = fixture_1.transactionNonces
                .sendTransactionWithANumberAsValueInTransactionBody[0];
            const txBody = await thorSoloClient.transactions.buildTransactionBody([fixture_1.transfer1VTHOClause], gasResult.totalGas, { nonce });
            // Create the signed transfer transaction
            const tx = sdk_core_1.Transaction.of(txBody).sign(sdk_core_1.HexUInt.of(fixture_2.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey).bytes);
            // Send the transaction and obtain the transaction ID
            const sendTransactionResult = await thorSoloClient.transactions.sendTransaction(tx);
            (0, globals_1.expect)(sendTransactionResult).toBeDefined();
            (0, globals_1.expect)(sendTransactionResult.id).toBeDefined();
            // Wait for the transaction to be included in a block
            const txReceipt = await sendTransactionResult.wait();
            (0, globals_1.expect)(txReceipt).toBeDefined();
            (0, globals_1.expect)(txReceipt?.reverted).toBe(fixture_1.expectedReceipt.reverted);
        });
        /**
         * Test that wait() method accepts timeout options
         */
        (0, globals_1.test)('wait() should accept timeout options and pass them to waitForTransaction', async () => {
            // Estimate the gas required for the transfer transaction
            const gasResult = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.estimateGas([fixture_1.transfer1VTHOClause], fixture_2.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address));
            const nonce = fixture_1.transactionNonces.waitForTransactionTestCases[0] + 1000; // Use a unique nonce
            const txBody = await thorSoloClient.transactions.buildTransactionBody([fixture_1.transfer1VTHOClause], gasResult.totalGas, { nonce });
            const tx = sdk_core_1.Transaction.of(txBody).sign(sdk_core_1.HexUInt.of(fixture_2.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey).bytes);
            const sendTransactionResult = await thorSoloClient.transactions.sendTransaction(tx);
            // Wait with custom timeout options
            const txReceipt = await sendTransactionResult.wait({
                timeoutMs: 10000,
                intervalMs: 500
            });
            (0, globals_1.expect)(txReceipt).toBeDefined();
            (0, globals_1.expect)(txReceipt).not.toBeNull();
        }, 15000);
        /**
         * Test that wait() uses default timeout when no options are provided
         */
        (0, globals_1.test)('wait() should use default timeout of 30 seconds when no options provided', async () => {
            // Use a non-existent transaction ID to test timeout
            const nonExistentTxId = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            // Create a mock SendTransactionResult
            const mockSendResult = {
                id: nonExistentTxId,
                wait: async (options) => {
                    return await thorSoloClient.transactions.waitForTransaction(nonExistentTxId, options);
                }
            };
            const startTime = Date.now();
            const receipt = await mockSendResult.wait(); // Should use default 30s timeout
            const endTime = Date.now();
            // Should return null due to timeout
            (0, globals_1.expect)(receipt).toBeNull();
            // Should have taken approximately 30 seconds (with tolerance)
            (0, globals_1.expect)(endTime - startTime).toBeGreaterThanOrEqual(29000);
            (0, globals_1.expect)(endTime - startTime).toBeLessThan(35000);
        }, 40000);
        /**
         * Test that wait() times out correctly with custom timeout
         */
        (0, globals_1.test)('wait() should timeout correctly with custom timeout options', async () => {
            const nonExistentTxId = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
            const mockSendResult = {
                id: nonExistentTxId,
                wait: async (options) => {
                    return await thorSoloClient.transactions.waitForTransaction(nonExistentTxId, options);
                }
            };
            const startTime = Date.now();
            const receipt = await mockSendResult.wait({
                timeoutMs: 2000,
                intervalMs: 100
            });
            const endTime = Date.now();
            (0, globals_1.expect)(receipt).toBeNull();
            (0, globals_1.expect)(endTime - startTime).toBeGreaterThanOrEqual(1900);
            (0, globals_1.expect)(endTime - startTime).toBeLessThan(3000);
        }, 5000);
        /**
         * waitForTransaction test cases that should not return a transaction receipt
         */
        fixture_1.invalidWaitForTransactionTestCases.forEach(({ description, options }) => {
            (0, globals_1.test)(description, async () => {
                // Estimate the gas required for the transfer transaction
                const gasResult = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.estimateGas([fixture_1.transfer1VTHOClause], fixture_2.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                    .address));
                const nonce = options.nonce;
                const txBody = await thorSoloClient.transactions.buildTransactionBody([fixture_1.transfer1VTHOClause], gasResult.totalGas, {
                    nonce,
                    dependsOn: options.dependsOn
                });
                // Create the signed transfer transaction
                const tx = sdk_core_1.Transaction.of(txBody).sign(sdk_core_1.HexUInt.of(fixture_2.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                    .privateKey).bytes);
                const sendTransactionResult = await thorSoloClient.transactions.sendTransaction(tx);
                (0, globals_1.expect)(sendTransactionResult.id).toBeDefined();
                const txReceipt = await thorSoloClient.transactions.waitForTransaction(sendTransactionResult.id, options);
                (0, globals_1.expect)(txReceipt).toBeNull();
            }, 5000);
        });
    });
    /**
     * Test suite for buildTransactionBody method
     */
    (0, globals_1.describe)('buildTransactionBody', () => {
        /**
         * buildTransactionBody test cases with different options
         */
        fixture_1.buildTransactionBodyClausesTestCases.forEach(({ description, clauses, options, expected }) => {
            (0, globals_1.test)(description, async () => {
                // Skip test if expected.solo is undefined
                if (expected.solo === undefined) {
                    return;
                }
                const gasResult = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.estimateGas(clauses, fixture_2.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                    .address));
                (0, globals_1.expect)(gasResult.totalGas).toBe(expected.solo.gas);
                const txBody = await thorSoloClient.transactions.buildTransactionBody(clauses, gasResult.totalGas, options);
                (0, globals_1.expect)(txBody).toBeDefined();
                (0, globals_1.expect)(txBody.clauses).toStrictEqual(expected.solo.clauses);
                (0, globals_1.expect)(txBody.expiration).toBe(expected.solo.expiration);
                (0, globals_1.expect)(txBody.gas).toBe(gasResult.totalGas);
                (0, globals_1.expect)(txBody.dependsOn).toBe(expected.solo.dependsOn);
                (0, globals_1.expect)(txBody.gasPriceCoef).toBe(expected.solo.gasPriceCoef);
                (0, globals_1.expect)(txBody.reserved).toStrictEqual(expected.solo.reserved);
            });
        });
    });
    (0, globals_1.test)('estimateGas', async () => {
        const gasResult = await (0, test_utils_1.retryOperation)(async () => {
            return await thorSoloClient.transactions.estimateGas([fixture_1.transfer1VTHOClause], fixture_2.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address);
        });
        (0, globals_1.expect)(gasResult).toBeDefined();
    }, 15000);
});
