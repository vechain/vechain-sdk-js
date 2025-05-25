import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { ABIContract, Address, Clause, HexUInt } from '@vechain/sdk-core';
import {
    JSONRPCMethodNotFound,
    JSONRPCMethodNotImplemented
} from '@vechain/sdk-errors';
import {
    ProviderInternalBaseWallet,
    type SubscriptionEvent,
    THOR_SOLO_URL,
    ThorClient,
    VeChainProvider,
    type VeChainSigner
} from '../../../../src';
import { providerMethodsTestCasesSolo, TEST_ACCOUNT } from '../fixture';
import {
    deployERC20Contract,
    deployERC721Contract,
    waitForMessage
} from '../helpers';
import { fail } from 'assert';

/**
 *VeChain provider tests - Solo Network
 *
 * @group integration/providers/vechain-provider-solo
 */
describe('VeChain provider tests - solo', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let provider: VeChainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = ThorClient.at(THOR_SOLO_URL);
        provider = new VeChainProvider(
            thorClient,
            new ProviderInternalBaseWallet([
                {
                    privateKey: HexUInt.of(TEST_ACCOUNT.privateKey).bytes,
                    address: TEST_ACCOUNT.address
                }
            ])
        );
    });

    /**
     * Destroy thor client and provider after each test
     */
    afterEach(() => {
        provider.destroy();
    });

    /**
     * Provider methods tests
     */
    providerMethodsTestCasesSolo.forEach(
        ({ description, method, params, expected }) => {
            test(description, async () => {
                // Call RPC function
                const rpcCall = await provider.request({
                    method,
                    params
                });

                // Compare the result with the expected value
                expect(rpcCall).toStrictEqual(expected);
            });
        }
    );

    /**
     * eth_getBalance RPC call test
     */
    test('Should be able to get the latest block number', async () => {
        // Call RPC function
        const rpcCall = await provider.request({
            method: 'eth_blockNumber',
            params: []
        });

        // Compare the result with the expected value
        expect(rpcCall).not.toBe('0x0');
    });

    /**
     * eth_subscribe latest blocks RPC call test
     */
    test('Should be able to get to subscribe to the latest blocks', async () => {
        // Call RPC function
        const subscriptionId = await provider.request({
            method: 'eth_subscribe',
            params: ['newHeads']
        });

        const messageReceived = new Promise((resolve) => {
            provider.on('message', (message) => {
                resolve(message);
                provider.destroy();
            });
        });

        const message = (await messageReceived) as SubscriptionEvent;

        // Optionally, you can do assertions or other operations with the message
        expect(message).toBeDefined();
        expect(message.method).toBe('eth_subscription');
        expect(message.params).toBeDefined();
        expect(message.params.subscription).toBe(subscriptionId);
        expect(message.params.result).toBeDefined();
    }, 12000);

    /**
     * eth_subscribe latest blocks and then unsubscribe RPC call test
     */
    test('Should be able to get to subscribe to the latest blocks and then unsubscribe', async () => {
        expect(provider.getPollInstance()).toBeUndefined();
        // Call RPC function
        const subscriptionId = await provider.request({
            method: 'eth_subscribe',
            params: ['newHeads']
        });

        expect(provider.getPollInstance()).toBeDefined();

        expect(subscriptionId).toBeDefined();
        expect(
            provider.subscriptionManager.newHeadsSubscription?.subscriptionId
        ).toBe(subscriptionId);

        await provider.request({
            method: 'eth_unsubscribe',
            params: [subscriptionId]
        });

        expect(provider.getPollInstance()).toBeUndefined();

        expect(
            provider.subscriptionManager.newHeadsSubscription?.subscriptionId
        ).toBeUndefined();
    });

    /**
     * eth_getSubscribe invalid call
     */
    test('Should not be able to subscribe since the subscription type is invalid', async () => {
        // Call RPC function
        await expect(
            async () =>
                await provider.request({
                    method: 'eth_subscribe',
                    params: ['invalid']
                })
        ).rejects.toThrowError('Invalid subscription type');
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
    jest.retryTimes(3);
    test('Should be able to get to subscribe to the latest logs of an erc20 contract', async () => {
        const contract = await deployERC20Contract(
            thorClient,
            (await provider.getSigner(TEST_ACCOUNT.address)) as VeChainSigner
        );

        const logsParams = {
            address: [contract.address],
            topics: []
        };

        // Call RPC function to subscribe to logs
        const rpcCall = await provider.request({
            method: 'eth_subscribe',
            params: ['logs', logsParams]
        });
        // Wait for the subscription to receive a message (log event)
        const messageReceived = waitForMessage(provider);

        // Execute a contract transaction to generate a log event
        await thorClient.contracts.executeTransaction(
            (await provider.getSigner(TEST_ACCOUNT.address)) as VeChainSigner,
            contract.address,
            ABIContract.ofAbi(contract.abi).getFunction('transfer'),
            [TEST_ACCOUNT.address, 100]
        );

        const message = await messageReceived;

        // Clean up the subscription
        provider.destroy();

        // Assertions to validate the received message
        expect(message).toBeDefined();
        expect(message.method).toBeDefined();
        expect(message.params).toBeDefined();

        // @ts-expect-error - Asserting that the log event contains the expected contract address
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(message.params.result[0].address).toBe(contract.address);

        // @ts-expect-error - Asserting that the log event contains defined topics
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(message.params.result[0].topics).toBeDefined();

        // @ts-expect-error - Asserting that the log event contains data
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(message.params.result[0].data).toBeDefined();

        // Validate the RPC call was successful
        expect(rpcCall).not.toBe('0x0');
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
    jest.retryTimes(3);
    test('Should be able to subscribe to the latest logs of an erc20 and erc721 contract', async () => {
        // Test setup: Deploy contracts and set up event subscriptions
        const erc20Contract = await deployERC20Contract(
            thorClient,
            (await provider.getSigner(TEST_ACCOUNT.address)) as VeChainSigner
        );
        const erc721Contract = await deployERC721Contract(
            thorClient,
            (await provider.getSigner(TEST_ACCOUNT.address)) as VeChainSigner
        );

        const erc20logsParams = {
            address: [erc20Contract.address],
            topics: []
        };

        const erc721logsParams = {
            address: [erc721Contract.address],
            topics: []
        };

        const erc20Subscription = await provider.request({
            method: 'eth_subscribe',
            params: ['logs', erc20logsParams]
        });

        const erc721Subscription = await provider.request({
            method: 'eth_subscribe',
            params: ['logs', erc721logsParams]
        });

        // Collect and assert log events
        let results: SubscriptionEvent[] = [];
        const eventPromise = new Promise((resolve) => {
            provider.on('message', (message: SubscriptionEvent) => {
                results.push(message);
                if (results.length >= 2) {
                    provider.destroy();
                    resolve(results);
                }
            });
        });

        // Execute transactions that should emit events
        await thorClient.contracts.executeTransaction(
            (await provider.getSigner(TEST_ACCOUNT.address)) as VeChainSigner,
            erc20Contract.address,
            ABIContract.ofAbi(erc20Contract.abi).getFunction('transfer'),
            [TEST_ACCOUNT.address, 100]
        );

        const clauses = Clause.callFunction(
            Address.of(erc721Contract.address),
            ABIContract.ofAbi(erc721Contract.abi).getFunction('mintItem'),
            [TEST_ACCOUNT.address]
        );

        const gas = await thorClient.transactions.estimateGas([clauses]);

        await thorClient.contracts.executeTransaction(
            (await provider.getSigner(TEST_ACCOUNT.address)) as VeChainSigner,
            erc721Contract.address,
            ABIContract.ofAbi(erc721Contract.abi).getFunction('mintItem'),
            [TEST_ACCOUNT.address],
            { gas: gas.totalGas }
        );

        results = (await eventPromise) as SubscriptionEvent[];

        // Assertions to validate the received log events
        expect(results).toBeDefined();
        expect(results.length).toBeGreaterThan(1);
        expect(
            results.filter((x) => x.params.subscription === erc20Subscription)
                .length
        ).toBeGreaterThan(0);
        expect(
            results.filter((x) => x.params.subscription === erc721Subscription)
                .length
        ).toBeGreaterThan(0);

        expect(results[0].method).toBe('eth_subscription');
        expect(results[1].method).toBe('eth_subscription');

        // @ts-expect-error - Asserting that log data is present
        expect(results[0].params.result.length).toBeGreaterThan(0);

        // @ts-expect-error - Asserting that log data is present
        expect(results[1].params.result.length).toBeGreaterThan(0);
    }, 30000);

    /**
     * Invalid RPC method tests
     */
    test('Should throw an error when calling an invalid RPC method', async () => {
        // Check if the provider is defined
        expect(provider).toBeDefined();

        // Call RPC function
        try {
            await provider.request({
                method: 'INVALID_METHOD',
                params: [-1]
            });
            fail('Should throw an error');
        } catch (error) {
            expect(error).toBeInstanceOf(JSONRPCMethodNotFound);
            if (error instanceof JSONRPCMethodNotFound) {
                expect(error.data.code).toBe(-32601);
                expect(error.data.message).toBe('Method not found');
            }
        }
    });

    /**
     * Not implemented RPC method tests
     */
    test('Should throw an error when calling an invalid RPC method', async () => {
        // Check if the provider is defined
        expect(provider).toBeDefined();

        // Call RPC function
        try {
            await provider.request({
                method: 'eth_getProof',
                params: [-1]
            });
            fail('Should throw an error');
        } catch (error) {
            expect(error).toBeInstanceOf(JSONRPCMethodNotImplemented);
            if (error instanceof JSONRPCMethodNotImplemented) {
                expect(error.data.code).toBe(-32004);
                expect(error.data.message).toBe('Method not implemented');
            }
        }
    });
});
