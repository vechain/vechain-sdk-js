"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_solo_setup_1 = require("@vechain/sdk-solo-setup");
const test_utils_1 = require("../../test-utils");
/**
 * Tests for the executeTransaction method in transactions module
 *
 *  @group integration/clients/thor-client/transactions
 */
(0, globals_1.describe)('ThorClient - Transactions Module Execute Transaction', () => {
    let thorSoloClient;
    let accountDispatcher;
    let provider;
    let signer;
    let wallet;
    const testContractABI = sdk_core_1.ABIContract.ofAbi((0, sdk_solo_setup_1.getConfigData)().TESTING_CONTRACT_ABI);
    const testContractAddress = (0, sdk_solo_setup_1.getConfigData)().TESTING_CONTRACT_ADDRESS;
    const depositFn = testContractABI.getFunction('deposit');
    beforeAll(async () => {
        thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        accountDispatcher = sdk_solo_setup_1.AccountDispatcher.getInstance();
        wallet = new src_1.ProviderInternalBaseWallet([
            {
                address: accountDispatcher.getNextAccount().address,
                privateKey: sdk_core_1.Hex.of(accountDispatcher.getNextAccount().privateKey).bytes
            }
        ]);
        provider = new src_1.VeChainProvider(thorSoloClient, wallet);
        signer = (await provider.getSigner());
    });
    (0, globals_1.test)('ok <- Execute legacy transaction for testing contract', async () => {
        // setup options
        const options = {
            gas: 1000000,
            gasPriceCoef: 0
        };
        // execute the transaction with retry logic
        const tx = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.executeTransaction(signer, // signer is checked for null in beforeAll
        testContractAddress, depositFn, [1], options), 5, // maxAttempts
        2000 // baseDelay
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        (0, globals_1.expect)(receipt?.reverted).toBe(false);
    }, 15000);
    (0, globals_1.test)('ok <- Execute EIP-1559 transaction for testing contract', async () => {
        // setup options
        const options = {
            maxFeePerGas: 10000000000000,
            maxPriorityFeePerGas: 100
        };
        // execute the transaction with retry logic
        const tx = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.executeTransaction(signer, testContractAddress, depositFn, [1], options), 5, // maxAttempts
        2000 // baseDelay
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        (0, globals_1.expect)(receipt?.reverted).toBe(false);
    }, 15000);
    (0, globals_1.test)('ok <- Execute transaction for testing contract that defaults to EIP-1559', async () => {
        // setup options
        const options = {
            gas: 1000000
        };
        // execute the transaction with retry logic
        const tx = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.executeTransaction(signer, testContractAddress, depositFn, [1], options), 5, // maxAttempts
        2000 // baseDelay
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        (0, globals_1.expect)(receipt?.reverted).toBe(false);
    }, 15000);
    (0, globals_1.test)('ok <- Execute transaction for testing contract with legacy and EIP-1559 options (will use legacy fee type)', async () => {
        // setup options
        const options = {
            gas: 1000000,
            gasPriceCoef: 0,
            maxFeePerGas: 10000000000000,
            maxPriorityFeePerGas: 100
        };
        // execute the transaction with retry logic
        const tx = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.executeTransaction(signer, testContractAddress, depositFn, [1], options), 5, // maxAttempts
        2000 // baseDelay
        );
        // wait for the transaction to be mined
        const receipt = await tx.wait();
        // assert the transaction was successful
        (0, globals_1.expect)(receipt?.reverted).toBe(false);
    }, 15000);
    // Tests for the fix that prevents "Maximum call stack size exceeded" error
    (0, globals_1.test)('Should handle polling timeout gracefully with safety limit', async () => {
        const originalHttpClient = thorSoloClient.httpClient;
        const mockHttpClient = {
            ...originalHttpClient,
            http: async (_method, _path, _params) => {
                await new Promise((resolve) => setTimeout(resolve, 0));
                throw new Error('Network timeout error');
            }
        };
        thorSoloClient.httpClient =
            mockHttpClient;
        try {
            const startTime = Date.now();
            const receipt = await thorSoloClient.transactions.waitForTransaction('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', { timeoutMs: 5000 });
            const endTime = Date.now();
            const duration = endTime - startTime;
            (0, globals_1.expect)(duration).toBeLessThan(10000); // Should not take more than 10 seconds
            (0, globals_1.expect)(receipt).toBeNull();
        }
        catch (error) {
            (0, globals_1.expect)(error).not.toBeInstanceOf(RangeError);
            (0, globals_1.expect)(error.message).not.toContain('Maximum call stack size exceeded');
        }
        finally {
            thorSoloClient.httpClient = originalHttpClient;
        }
    }, 15000);
    (0, globals_1.test)('Should handle network errors gracefully in getTransactionReceipt', async () => {
        const originalHttpClient = thorSoloClient.httpClient;
        const mockHttpClient = {
            ...originalHttpClient,
            http: async (_method, _path, _params) => {
                await new Promise((resolve) => setTimeout(resolve, 0));
                throw new Error('Network connection reset');
            }
        };
        thorSoloClient.httpClient =
            mockHttpClient;
        try {
            const receipt = await thorSoloClient.transactions.getTransactionReceipt('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
            (0, globals_1.expect)(receipt).toBeNull();
        }
        finally {
            thorSoloClient.httpClient = originalHttpClient;
        }
    });
    (0, globals_1.test)('Should demonstrate fix prevents infinite polling loops', async () => {
        const originalHttpClient = thorSoloClient.httpClient;
        let callCount = 0;
        const mockHttpClient = {
            ...originalHttpClient,
            http: async (method, path, params) => {
                callCount++;
                if (callCount < 50) {
                    throw new Error('Network timeout error - Thor temporarily unavailable');
                }
                return originalHttpClient.http(method, path, params);
            }
        };
        thorSoloClient.httpClient =
            mockHttpClient;
        try {
            const startTime = Date.now();
            await thorSoloClient.transactions.waitForTransaction('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', { timeoutMs: 10000 });
            const endTime = Date.now();
            const duration = endTime - startTime;
            (0, globals_1.expect)(duration).toBeLessThan(15000); // Should not take more than 15 seconds
            (0, globals_1.expect)(callCount).toBeGreaterThan(0);
        }
        catch (error) {
            (0, globals_1.expect)(error).not.toBeInstanceOf(RangeError);
            (0, globals_1.expect)(error.message).not.toContain('Maximum call stack size exceeded');
        }
        finally {
            thorSoloClient.httpClient = originalHttpClient;
        }
    }, 20000);
});
