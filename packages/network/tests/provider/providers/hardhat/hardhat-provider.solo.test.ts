import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { ABIContract, HexUInt } from '@vechain/sdk-core';
import {
    HardhatVeChainProvider,
    ProviderInternalBaseWallet,
    type SubscriptionEvent,
    THOR_SOLO_URL,
    ThorClient,
    type VeChainSigner
} from '../../../../src';
import { providerMethodsTestCasesSolo } from '../fixture';
import { TEST_ACCOUNTS } from '../../../fixture';
import {
    deployERC20Contract,
    deployERC721Contract,
    waitForMessage
} from '../helpers';
import { retryOperation } from '../../../test-utils';

/**
 *VeChain provider tests - Solo Network
 *
 * @group integration/providers/vechain-provider-solo
 */
describe('Hardhat provider tests', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let provider: HardhatVeChainProvider;
    let fundedAccount: { privateKey: string; address: string };

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        // Use a funded account from TEST_ACCOUNTS
        const account = TEST_ACCOUNTS.SUBSCRIPTION.EVENT_SUBSCRIPTION;
        fundedAccount = {
            privateKey: account.privateKey,
            address: account.address
        };

        thorClient = ThorClient.at(THOR_SOLO_URL);
        provider = new HardhatVeChainProvider(
            new ProviderInternalBaseWallet([
                {
                    privateKey: HexUInt.of(fundedAccount.privateKey).bytes,
                    address: fundedAccount.address
                }
            ]),
            THOR_SOLO_URL,
            (message: string, parent?: Error) => new Error(message, parent),
            false
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
        ).rejects.toThrowError();
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
     *    - The message is defined and has the correct method name.
     *    - The message contains the expected parameters with log event details.
     *    - The log event includes the correct contract address, topics, and data.
     *
     * @remarks
     * - The test uses `retryOperation` to handle potential connection issues and retry failed operations.
     * - The test uses `@ts-expect-error` annotations to bypass TypeScript's type checking for certain properties we expect to be present in the log event message. This is due to the generic nature of the `message` object, which doesn't have a predefined type that includes the expected fields.
     * - An extended timeout of 30 seconds is set to accommodate potential delays in contract deployment, transaction execution, and event propagation.
     *
     * @throws {Error} If the received message doesn't match the expected format or if the log event details are incorrect, indicating an issue with the subscription or the event emission process.
     */
    test('Should be able to get to subscribe to the latest logs of an erc20 contract', async () => {
        try {
            console.log('Starting ERC20 contract deployment...');
            const contract = await retryOperation(
                async () =>
                    deployERC20Contract(
                        thorClient,
                        (await provider.getSigner(
                            fundedAccount.address
                        )) as VeChainSigner
                    ),
                5,
                2000
            );
            console.log(
                'ERC20 contract deployed successfully at:',
                contract.address
            );

            const logsParams = {
                address: [contract.address],
                topics: []
            };

            // Call RPC function to subscribe to logs
            console.log('Setting up log subscription...');
            const rpcCall = await retryOperation(
                async () =>
                    provider.request({
                        method: 'eth_subscribe',
                        params: ['logs', logsParams]
                    }),
                5,
                2000
            );
            console.log('Subscription created:', rpcCall);

            // Wait for the subscription to receive a message (log event) using retryOperation
            const message = await retryOperation(
                async () => waitForMessage(provider),
                5,
                2000
            );

            // Execute a contract transaction to generate a log event
            console.log('Executing transfer transaction...');
            await retryOperation(
                async () =>
                    thorClient.contracts.executeTransaction(
                        (await provider.getSigner(
                            fundedAccount.address
                        )) as VeChainSigner,
                        contract.address,
                        ABIContract.ofAbi(contract.abi).getFunction('transfer'),
                        [fundedAccount.address, 100]
                    ),
                5,
                2000
            );
            console.log('Transfer transaction executed');

            console.log('Received subscription message');

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
            console.log('Test completed successfully');
        } catch (error) {
            console.error('Test failed with error:', error);
            console.error('Error details:', {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                name: error instanceof Error ? error.name : undefined
            });

            // Check if it's an insufficient energy error
            if (
                error instanceof Error &&
                error.message.includes('insufficient energy')
            ) {
                console.error(
                    'This is an insufficient energy error. The test account needs to be funded with VET.'
                );
                console.error('Test account address:', fundedAccount.address);
                console.error(
                    'Please ensure the solo node is running and the test account has sufficient VET for contract deployment.'
                );
            }

            throw error; // Re-throw to fail the test properly
        }
    }, 120000);

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
    test('Should be able to subscribe to the latest logs of an erc20 and erc721 contract', async () => {
        try {
            // Test setup: Deploy contracts and set up event subscriptions
            console.log('Starting contract deployment...');
            const erc20Contract = await deployERC20Contract(
                thorClient,
                (await provider.getSigner(
                    fundedAccount.address
                )) as VeChainSigner
            );
            console.log(
                'ERC20 contract deployed successfully at:',
                erc20Contract.address
            );

            const erc721Contract = await deployERC721Contract(
                thorClient,
                (await provider.getSigner(
                    fundedAccount.address
                )) as VeChainSigner
            );
            console.log(
                'ERC721 contract deployed successfully at:',
                erc721Contract.address
            );

            const erc20logsParams = {
                address: [erc20Contract.address],
                topics: []
            };

            const erc721logsParams = {
                address: [erc721Contract.address],
                topics: []
            };

            console.log('Setting up subscriptions...');
            const erc20Subscription = await retryOperation(
                async () =>
                    provider.request({
                        method: 'eth_subscribe',
                        params: ['logs', erc20logsParams]
                    }),
                5,
                2000
            );

            const erc721Subscription = await retryOperation(
                async () =>
                    provider.request({
                        method: 'eth_subscribe',
                        params: ['logs', erc721logsParams]
                    }),
                5,
                2000
            );

            console.log('Subscriptions created:', {
                erc20Subscription,
                erc721Subscription
            });

            // Collect and assert log events using retryOperation
            const results = await retryOperation(
                async (): Promise<SubscriptionEvent[]> => {
                    return new Promise((resolve) => {
                        const results: SubscriptionEvent[] = [];
                        provider.on('message', (message: SubscriptionEvent) => {
                            results.push(message);
                            if (results.length >= 2) {
                                provider.destroy();
                                resolve(results);
                            }
                        });
                    });
                },
                5,
                2000
            );

            console.log('Executing transactions to generate events...');
            // Execute transactions that should emit events
            await retryOperation(
                async () =>
                    thorClient.contracts.executeTransaction(
                        (await provider.getSigner(
                            fundedAccount.address
                        )) as VeChainSigner,
                        erc20Contract.address,
                        ABIContract.ofAbi(erc20Contract.abi).getFunction(
                            'transfer'
                        ),
                        [fundedAccount.address, 100]
                    ),
                5,
                2000
            );
            console.log('ERC20 transfer transaction executed');

            await retryOperation(
                async () =>
                    thorClient.contracts.executeTransaction(
                        (await provider.getSigner(
                            fundedAccount.address
                        )) as VeChainSigner,
                        erc721Contract.address,
                        ABIContract.ofAbi(erc721Contract.abi).getFunction(
                            'mintItem'
                        ),
                        [fundedAccount.address]
                    ),
                5,
                2000
            );
            console.log('ERC721 mint transaction executed');

            console.log('Received events:', results.length);

            // Assertions to validate the received log events
            expect(results).toBeDefined();
            expect(results.length).toBeGreaterThan(1);
            expect(
                results.filter(
                    (x) => x.params.subscription === erc20Subscription
                ).length
            ).toBeGreaterThan(0);
            expect(
                results.filter(
                    (x) => x.params.subscription === erc721Subscription
                ).length
            ).toBeGreaterThan(0);

            expect(results[0].method).toBe('eth_subscription');
            expect(results[1].method).toBe('eth_subscription');

            // @ts-expect-error - Asserting that log data is present
            expect(results[0].params.result.length).toBeGreaterThan(0);

            // @ts-expect-error - Asserting that log data is present
            expect(results[1].params.result.length).toBeGreaterThan(0);

            console.log('Test completed successfully');
        } catch (error) {
            console.error('Test failed with error:', error);
            console.error('Error details:', {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
                name: error instanceof Error ? error.name : undefined
            });

            // Check if it's an insufficient energy error
            if (
                error instanceof Error &&
                error.message.includes('insufficient energy')
            ) {
                console.error(
                    'This is an insufficient energy error. The test account needs to be funded with VET.'
                );
                console.error('Test account address:', fundedAccount.address);
                console.error(
                    'Please ensure the solo node is running and the test account has sufficient VET for contract deployment.'
                );
            }

            throw error; // Re-throw to fail the test properly
        }
    }, 120000);

    /**
     * Invalid RPC method tests
     */
    test('Should throw an error when calling an invalid RPC method', async () => {
        // Check if the provider is defined
        expect(provider).toBeDefined();

        // Call RPC function
        await expect(
            async () =>
                await provider.request({
                    method: 'INVALID_METHOD',
                    params: [-1]
                })
        ).rejects.toThrowError();
    });
});
