import { describe, expect, test } from '@jest/globals';
import { stringifyData } from '@vechain/sdk-errors';
import { type AbiEvent } from 'abitype';
import { subscriptions, TESTNET_URL } from '../../../src';
import {
    getBeatSubscriptionUrlTestCases,
    getBlockSubscriptionUrlTestCases,
    getEventSubscriptionUrlTestCases,
    getLegacyBeatSubscriptionUrlTestCases,
    getNewTransactionsSubscriptionUrlTestCases,
    getVETtransfersSubscriptionUrlTestCases,
    testWebSocketConnection
} from './fixture';

/**
 * Test suite for the Subscriptions utility methods for getting the subscription URLs
 *
 * @group integration/utils/subscriptions
 */
describe('Subscriptions Testnet', () => {
    /**
     * Test the Event Subscription URLs functionalities
     *
     */
    describe('Event Subscription URLs', () => {
        /**
         * Test the getEventSubscriptionUrl function
         */
        getEventSubscriptionUrlTestCases.forEach(
            ({ event, valuesToEncode, options, expectedURL }) => {
                test(`getEventSubscriptionUrl: ${
                    typeof event === 'string' ? event : stringifyData(event)
                } with ${valuesToEncode?.toString()}`, async () => {
                    expect(
                        subscriptions.getEventSubscriptionUrl(
                            TESTNET_URL,
                            event as AbiEvent,
                            valuesToEncode,
                            options
                        )
                    ).toEqual(expectedURL);

                    // Test the connection to the websocket
                    await testWebSocketConnection(expectedURL);
                }, 10000);
            }
        );
    });

    /**
     * Test the Block Subscription URLs functionalities
     */
    describe('Block Subscription URLs', () => {
        /**
         * Test the getBlockSubscriptionUrl function
         */
        getBlockSubscriptionUrlTestCases.forEach(({ options, expectedURL }) => {
            test(`getBlockSubscriptionUrl: ${stringifyData(
                options
            )}`, async () => {
                expect(
                    subscriptions.getBlockSubscriptionUrl(TESTNET_URL, options)
                ).toEqual(expectedURL);

                // Test the connection to the websocket
                await testWebSocketConnection(expectedURL);
            });
        });
    });

    /**
     * Test the Beat Subscription URLs functionalities
     */
    describe('Beat Subscription URLs', () => {
        /**
         * Test the getLegacyBeatSubscriptionUrl function
         */
        getLegacyBeatSubscriptionUrlTestCases.forEach(
            ({ options, expectedURL }) => {
                test(`getLegacyBeatSubscriptionUrl: ${stringifyData(
                    options
                )}`, async () => {
                    expect(
                        subscriptions.getLegacyBeatSubscriptionUrl(
                            TESTNET_URL,
                            options
                        )
                    ).toEqual(expectedURL);

                    // Test the connection to the websocket
                    await testWebSocketConnection(expectedURL);
                });
            }
        );

        /**
         * Test the getBeatSubscriptionUrl function
         */
        getBeatSubscriptionUrlTestCases.forEach(({ options, expectedURL }) => {
            test(`getBeatSubscriptionUrl: ${stringifyData(
                options
            )}`, async () => {
                expect(
                    subscriptions.getBeatSubscriptionUrl(TESTNET_URL, options)
                ).toEqual(expectedURL);

                // Test the connection to the websocket
                await testWebSocketConnection(expectedURL);
            });
        });
    });

    /**
     * Test the New Transactions Subscription URLs functionalities
     */
    describe('New Transactions Subscription URLs', () => {
        /**
         * Test the getNewTransactionsSubscriptionUrl function
         */
        getNewTransactionsSubscriptionUrlTestCases.forEach(
            ({ expectedURL }) => {
                test(`getNewTransactionsSubscriptionUrl`, async () => {
                    expect(
                        subscriptions.getNewTransactionsSubscriptionUrl(
                            TESTNET_URL
                        )
                    ).toEqual(expectedURL);

                    // Test the connection to the websocket
                    await testWebSocketConnection(expectedURL);
                });
            }
        );
    });

    /**
     * Test the VET Transfers Subscription URLs functionalities
     */
    describe('VET Transfers Subscription URLs', () => {
        /**
         * Test the getVETtransfersSubscriptionUrl function
         */
        getVETtransfersSubscriptionUrlTestCases.forEach(
            ({ options, expectedURL }) => {
                test(`getVETtransfersSubscriptionUrl: ${stringifyData(
                    options
                )}`, async () => {
                    expect(
                        subscriptions.getVETtransfersSubscriptionUrl(
                            TESTNET_URL,
                            options
                        )
                    ).toEqual(expectedURL);

                    // Test the connection to the websocket
                    await testWebSocketConnection(expectedURL);
                });
            }
        );
    });

    /**
     * Test if the websocket connection is valid
     */
    describe('testWebSocketConnection Errors', () => {
        test('Wrong subscription URL', async () => {
            const wrongUrl = 'ws://wrong.url';
            await expect(
                testWebSocketConnection(wrongUrl)
            ).rejects.toThrowError('WebSocket connection error');
        });
    });
});
