import { describe, expect, test } from '@jest/globals';
import {
    getEventSubscriptionUrlTestCases,
    getBlockSubscriptionUrlTestCases,
    getLegacyBeatSubscriptionUrlTestCases,
    getBeatSubscriptionUrlTestCases,
    getNewTransactionsSubscriptionUrlTestCases,
    getVETtransfersSubscriptionUrlTestCases,
    testWebSocketConnection
} from './fixture';
import { subscriptions } from '../../../src';
import { testnetUrl } from '../../fixture';

/**
 * Test suite for the Subscriptions utility methods for getting the subscription URLs
 *
 * @group unit/utils/subscriptions
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
                    typeof event === 'string' ? event : JSON.stringify(event)
                } with ${valuesToEncode?.toString()}`, async () => {
                    expect(
                        subscriptions.getEventSubscriptionUrl(
                            testnetUrl,
                            event,
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
            test(`getBlockSubscriptionUrl: ${JSON.stringify(
                options
            )}`, async () => {
                expect(
                    subscriptions.getBlockSubscriptionUrl(testnetUrl, options)
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
                test(`getLegacyBeatSubscriptionUrl: ${JSON.stringify(
                    options
                )}`, async () => {
                    expect(
                        subscriptions.getLegacyBeatSubscriptionUrl(
                            testnetUrl,
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
            test(`getBeatSubscriptionUrl: ${JSON.stringify(
                options
            )}`, async () => {
                expect(
                    subscriptions.getBeatSubscriptionUrl(testnetUrl, options)
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
                            testnetUrl
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
                test(`getVETtransfersSubscriptionUrl: ${JSON.stringify(
                    options
                )}`, async () => {
                    expect(
                        subscriptions.getVETtransfersSubscriptionUrl(
                            testnetUrl,
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
            ).rejects.toThrowError('getaddrinfo ENOTFOUND wrong.url');
        });
    });
});
