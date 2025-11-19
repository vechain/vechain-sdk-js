"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../../src");
const fixture_1 = require("../fixture");
const fixture_2 = require("../../../fixture");
const helpers_1 = require("../helpers");
const assert_1 = require("assert");
const test_utils_1 = require("../../../test-utils");
/**
 * Health check function to ensure Thor solo node is ready
 */
const waitForThorSoloReady = async (thorClient) => {
    for (let i = 0; i < 10; i++) {
        try {
            await thorClient.blocks.getBestBlockCompressed();
            return; // Success
        }
        catch (error) {
            if (i === 9)
                throw error; // Last attempt
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
    }
};
/**
 *VeChain provider tests - Solo Network
 *
 * @group integration/providers/vechain-provider-solo
 */
(0, globals_1.describe)('VeChain provider tests - solo', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient;
    let provider;
    /**
     * Init thor client and provider before each test
     */
    (0, globals_1.beforeEach)(async () => {
        thorClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        provider = new src_1.VeChainProvider(thorClient, new src_1.ProviderInternalBaseWallet([
            {
                privateKey: sdk_core_1.HexUInt.of(fixture_2.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.privateKey).bytes,
                address: fixture_2.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address
            }
        ]));
        // Wait for Thor solo node to be ready
        await waitForThorSoloReady(thorClient);
    });
    /**
     * Destroy thor client and provider after each test
     */
    (0, globals_1.afterEach)(() => {
        provider.destroy();
    });
    /**
     * Provider methods tests
     */
    fixture_1.providerMethodsTestCasesSolo.forEach(({ description, method, params, expected }) => {
        (0, globals_1.test)(description, async () => {
            // Call RPC function
            const rpcCall = await (0, test_utils_1.retryOperation)(async () => await provider.request({
                method,
                params
            }));
            // Compare the result with the expected value
            (0, globals_1.expect)(rpcCall).toStrictEqual(expected);
        });
    });
    /**
     * eth_getBalance RPC call test
     */
    (0, globals_1.test)('Should be able to get the latest block number', async () => {
        // Call RPC function
        const rpcCall = await (0, test_utils_1.retryOperation)(async () => await provider.request({
            method: 'eth_blockNumber',
            params: []
        }));
        // Compare the result with the expected value
        (0, globals_1.expect)(rpcCall).not.toBe('0x0');
    });
    /**
     * eth_subscribe latest blocks RPC call test
     */
    (0, globals_1.test)('Should be able to get to subscribe to the latest blocks', async () => {
        // Call RPC function
        const subscriptionId = await (0, test_utils_1.retryOperation)(async () => await provider.request({
            method: 'eth_subscribe',
            params: ['newHeads']
        }));
        const messageReceived = new Promise((resolve) => {
            provider.on('message', (message) => {
                resolve(message);
                provider.destroy();
            });
        });
        const message = (await messageReceived);
        // Optionally, you can do assertions or other operations with the message
        (0, globals_1.expect)(message).toBeDefined();
        (0, globals_1.expect)(message.method).toBe('eth_subscription');
        (0, globals_1.expect)(message.params).toBeDefined();
        (0, globals_1.expect)(message.params.subscription).toBe(subscriptionId);
        (0, globals_1.expect)(message.params.result).toBeDefined();
    }, 12000);
    /**
     * eth_subscribe latest blocks and then unsubscribe RPC call test
     */
    (0, globals_1.test)('Should be able to get to subscribe to the latest blocks and then unsubscribe', async () => {
        (0, globals_1.expect)(provider.getPollInstance()).toBeUndefined();
        // Call RPC function
        const subscriptionId = await (0, test_utils_1.retryOperation)(async () => await provider.request({
            method: 'eth_subscribe',
            params: ['newHeads']
        }));
        (0, globals_1.expect)(provider.getPollInstance()).toBeDefined();
        (0, globals_1.expect)(subscriptionId).toBeDefined();
        (0, globals_1.expect)(provider.subscriptionManager.newHeadsSubscription?.subscriptionId).toBe(subscriptionId);
        await (0, test_utils_1.retryOperation)(async () => await provider.request({
            method: 'eth_unsubscribe',
            params: [subscriptionId]
        }));
        (0, globals_1.expect)(provider.getPollInstance()).toBeUndefined();
        (0, globals_1.expect)(provider.subscriptionManager.newHeadsSubscription?.subscriptionId).toBeUndefined();
    });
    /**
     * eth_getSubscribe invalid call
     */
    (0, globals_1.test)('Should not be able to subscribe since the subscription type is invalid', async () => {
        // Call RPC function
        await (0, globals_1.expect)(async () => await provider.request({
            method: 'eth_subscribe',
            params: ['invalid']
        })).rejects.toThrowError('Invalid subscription type');
    }, 12000);
    /**
     * Tests the ability to subscribe to and receive the latest log events from an ERC20 contract using the `eth_subscribe` RPC call.
     *
     * The test performs the following operations:
     * 1. Deploys an ERC20 contract to simulate a real-world token contract scenario.
     * 2. Sets up a log subscription for the deployed contract's address to listen for all emitted events (no specific topics).
     * 3. Executes a `transfer` transaction on the ERC20 contract to simulate activity that would generate a log event.
     * 4. Waits for a message from the subscription, indicating a log event was captured.
     * 5. Validates the received message to ensure it contains the expected structure and data:
     *    - The message is defined and has the correct method.
     *    - The log event's address matches the ERC20 contract's address.
     *    - Topics and data within the log event are present and correctly formatted.
     *
     * @remarks
     * - The `waitForMessage` function is assumed to be a utility that returns a Promise which resolves when a new message is received from the subscription.
     * - The test uses `@ts-expect-error` annotations to bypass TypeScript's type checking for certain properties we expect to be present in the log event message. This is due to the generic nature of the `message` object, which doesn't have a predefined type that includes the expected fields.
     * - An extended timeout of 30 seconds is set to accommodate potential delays in contract deployment, transaction execution, and event propagation.
     *
     * @throws {Error} If the received message doesn't match the expected format or if the log event details are incorrect, indicating an issue with the subscription or the event emission process.
     */
    (0, globals_1.test)('Should be able to get to subscribe to the latest logs of an erc20 contract', async () => {
        const contract = await (0, helpers_1.deployERC20Contract)(thorClient, (await provider.getSigner(fixture_2.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address)));
        const logsParams = {
            address: [contract.address],
            topics: []
        };
        // Call RPC function to subscribe to logs
        const rpcCall = await (0, test_utils_1.retryOperation)(async () => await provider.request({
            method: 'eth_subscribe',
            params: ['logs', logsParams]
        }));
        // Wait for the subscription to receive a message (log event)
        const messageReceived = (0, helpers_1.waitForMessage)(provider);
        // Execute a contract transaction to generate a log event
        await thorClient.contracts.executeTransaction((await provider.getSigner(fixture_2.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address)), contract.address, sdk_core_1.ABIContract.ofAbi(contract.abi).getFunction('transfer'), [fixture_2.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address, 100]);
        const message = await messageReceived;
        // Clean up the subscription
        provider.destroy();
        // Assertions to validate the received message
        (0, globals_1.expect)(message).toBeDefined();
        (0, globals_1.expect)(message.method).toBeDefined();
        (0, globals_1.expect)(message.params).toBeDefined();
        // @ts-expect-error - Asserting that the log event contains the expected contract address
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (0, globals_1.expect)(message.params.result[0].address).toBe(contract.address);
        // @ts-expect-error - Asserting that the log event contains defined topics
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (0, globals_1.expect)(message.params.result[0].topics).toBeDefined();
        // @ts-expect-error - Asserting that the log event contains data
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        (0, globals_1.expect)(message.params.result[0].data).toBeDefined();
        // Validate the RPC call was successful
        (0, globals_1.expect)(rpcCall).not.toBe('0x0');
    }, 30000);
    /**
     * Tests the ability to subscribe to and receive log events for both ERC20 and ERC721 token contracts.
     *
     * This test performs the following operations:
     * 1. Deploys an ERC20 and an ERC721 contract to simulate token transactions.
     * 2. Sets up subscriptions to listen for log events from both contracts using the `eth_subscribe` method.
     * 3. Executes transactions on both contracts:
     *    - For the ERC20 contract, it simulates a token transfer.
     *    - For the ERC721 contract, it simulates minting a new token.
     * 4. Waits for and collects log events emitted by these transactions.
     * 5. Asserts that the received log events match the expected results, including:
     *    - The presence and count of the log events.
     *    - Matching subscription IDs to verify the correct source of the events.
     *    - Non-empty log data to ensure event details are captured.
     *
     * Note: The test uses `@ts-expect-error` to assert the presence of `params.result` in log events,
     * acknowledging potential TypeScript type safety concerns while expecting the data to be present.
     *
     * @remarks
     * The test includes an extended timeout of 10 seconds to accommodate the asynchronous nature of
     * blockchain transactions and event subscriptions.
     *
     * @throws {Error} If any of the assertions fail, indicating a problem with event subscription or log data capture.
     */
    (0, globals_1.test)('Should be able to subscribe to the latest logs of an erc20 and erc721 contract', async () => {
        // Retry mechanism for connection issues
        let lastError = null;
        for (let attempt = 1; attempt <= 5; attempt++) {
            try {
                // Wait for Thor solo node to be ready
                await new Promise((resolve) => setTimeout(resolve, 2000));
                // Test setup: Deploy contracts and set up event subscriptions
                const erc20Contract = await (0, helpers_1.deployERC20Contract)(thorClient, (await provider.getSigner(fixture_2.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address)));
                const erc721Contract = await (0, helpers_1.deployERC721Contract)(thorClient, (await provider.getSigner(fixture_2.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address)));
                const erc20logsParams = {
                    address: [erc20Contract.address],
                    topics: []
                };
                const erc721logsParams = {
                    address: [erc721Contract.address],
                    topics: []
                };
                const erc20Subscription = await (0, test_utils_1.retryOperation)(async () => await provider.request({
                    method: 'eth_subscribe',
                    params: ['logs', erc20logsParams]
                }));
                const erc721Subscription = await (0, test_utils_1.retryOperation)(async () => await provider.request({
                    method: 'eth_subscribe',
                    params: ['logs', erc721logsParams]
                }));
                // Collect and assert log events
                let results = [];
                const eventPromise = new Promise((resolve) => {
                    provider.on('message', (message) => {
                        results.push(message);
                        if (results.length >= 2) {
                            provider.destroy();
                            resolve(results);
                        }
                    });
                });
                // Execute transactions that should emit events
                await thorClient.contracts.executeTransaction((await provider.getSigner(fixture_2.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address)), erc20Contract.address, sdk_core_1.ABIContract.ofAbi(erc20Contract.abi).getFunction('transfer'), [fixture_2.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address, 100]);
                const clauses = sdk_core_1.Clause.callFunction(sdk_core_1.Address.of(erc721Contract.address), sdk_core_1.ABIContract.ofAbi(erc721Contract.abi).getFunction('mintItem'), [fixture_2.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address]);
                const gas = await thorClient.transactions.estimateGas([
                    clauses
                ]);
                await thorClient.contracts.executeTransaction((await provider.getSigner(fixture_2.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address)), erc721Contract.address, sdk_core_1.ABIContract.ofAbi(erc721Contract.abi).getFunction('mintItem'), [fixture_2.TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION.address], { gas: gas.totalGas });
                results = (await eventPromise);
                // Assertions to validate the received log events
                (0, globals_1.expect)(results).toBeDefined();
                (0, globals_1.expect)(results.length).toBeGreaterThan(1);
                (0, globals_1.expect)(results.filter((x) => x.params.subscription === erc20Subscription).length).toBeGreaterThan(0);
                (0, globals_1.expect)(results.filter((x) => x.params.subscription === erc721Subscription).length).toBeGreaterThan(0);
                (0, globals_1.expect)(results[0].method).toBe('eth_subscription');
                (0, globals_1.expect)(results[1].method).toBe('eth_subscription');
                // @ts-expect-error - Asserting that log data is present
                (0, globals_1.expect)(results[0].params.result.length).toBeGreaterThan(0);
                // @ts-expect-error - Asserting that log data is present
                (0, globals_1.expect)(results[1].params.result.length).toBeGreaterThan(0);
                // Success - exit retry loop
                return;
            }
            catch (error) {
                lastError = error;
                console.log(`Attempt ${attempt} failed:`, error);
                if (attempt < 5) {
                    // Wait longer between retries for complex test
                    await new Promise((resolve) => setTimeout(resolve, 10000));
                }
            }
        }
        // All retries failed
        throw lastError ?? new Error('Connection failed after 5 attempts');
    }, 120000);
    /**
     * Invalid RPC method tests
     */
    (0, globals_1.test)('Should throw an error when calling an invalid RPC method', async () => {
        // Check if the provider is defined
        (0, globals_1.expect)(provider).toBeDefined();
        // Call RPC function
        try {
            await provider.request({
                method: 'INVALID_METHOD',
                params: [-1]
            });
            (0, assert_1.fail)('Should throw an error');
        }
        catch (error) {
            (0, globals_1.expect)(error).toBeInstanceOf(sdk_errors_1.JSONRPCMethodNotFound);
            if (error instanceof sdk_errors_1.JSONRPCMethodNotFound) {
                (0, globals_1.expect)(error.data.code).toBe(-32601);
                (0, globals_1.expect)(error.data.message).toBe('Method not found');
            }
        }
    });
    /**
     * Not implemented RPC method tests
     */
    (0, globals_1.test)('Should throw an error when calling an invalid RPC method', async () => {
        // Check if the provider is defined
        (0, globals_1.expect)(provider).toBeDefined();
        // Call RPC function
        try {
            await provider.request({
                method: 'eth_getProof',
                params: [-1]
            });
            (0, assert_1.fail)('Should throw an error');
        }
        catch (error) {
            (0, globals_1.expect)(error).toBeInstanceOf(sdk_errors_1.JSONRPCMethodNotImplemented);
            if (error instanceof sdk_errors_1.JSONRPCMethodNotImplemented) {
                (0, globals_1.expect)(error.data.code).toBe(-32004);
                (0, globals_1.expect)(error.data.message).toBe('Method not implemented');
            }
        }
    });
});
