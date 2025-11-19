"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../src");
const fixture_1 = require("./fixture");
/**
 * Test suite for the Subscriptions utility methods for getting the subscription URLs
 *
 * @group integration/utils/subscriptions
 */
(0, globals_1.describe)('Subscriptions Testnet', () => {
    /**
     * Test the Event Subscription URLs functionalities
     *
     */
    (0, globals_1.describe)('Event Subscription URLs', () => {
        /**
         * Test the getEventSubscriptionUrl function
         */
        fixture_1.getEventSubscriptionUrlTestCases.forEach(({ event, valuesToEncode, options, expectedURL }) => {
            (0, globals_1.test)(`getEventSubscriptionUrl: ${typeof event === 'string' ? event : (0, sdk_errors_1.stringifyData)(event)} with ${valuesToEncode?.toString()}`, async () => {
                (0, globals_1.expect)(src_1.subscriptions.getEventSubscriptionUrl(src_1.TESTNET_URL, event, valuesToEncode, options)).toEqual(expectedURL);
                // Test the connection to the websocket
                await (0, fixture_1.testWebSocketConnection)(expectedURL);
            }, 10000);
        });
    });
    /**
     * Test the Block Subscription URLs functionalities
     */
    (0, globals_1.describe)('Block Subscription URLs', () => {
        /**
         * Test the getBlockSubscriptionUrl function
         */
        fixture_1.getBlockSubscriptionUrlTestCases.forEach(({ options, expectedURL }) => {
            (0, globals_1.test)(`getBlockSubscriptionUrl: ${(0, sdk_errors_1.stringifyData)(options)}`, async () => {
                (0, globals_1.expect)(src_1.subscriptions.getBlockSubscriptionUrl(src_1.TESTNET_URL, options)).toEqual(expectedURL);
                // Test the connection to the websocket
                await (0, fixture_1.testWebSocketConnection)(expectedURL);
            });
        });
    });
    /**
     * Test the Beat Subscription URLs functionalities
     */
    (0, globals_1.describe)('Beat Subscription URLs', () => {
        /**
         * Test the getLegacyBeatSubscriptionUrl function
         */
        fixture_1.getLegacyBeatSubscriptionUrlTestCases.forEach(({ options, expectedURL }) => {
            (0, globals_1.test)(`getLegacyBeatSubscriptionUrl: ${(0, sdk_errors_1.stringifyData)(options)}`, async () => {
                (0, globals_1.expect)(src_1.subscriptions.getLegacyBeatSubscriptionUrl(src_1.TESTNET_URL, options)).toEqual(expectedURL);
                // Test the connection to the websocket
                await (0, fixture_1.testWebSocketConnection)(expectedURL);
            });
        });
        /**
         * Test the getBeatSubscriptionUrl function
         */
        fixture_1.getBeatSubscriptionUrlTestCases.forEach(({ options, expectedURL }) => {
            (0, globals_1.test)(`getBeatSubscriptionUrl: ${(0, sdk_errors_1.stringifyData)(options)}`, async () => {
                (0, globals_1.expect)(src_1.subscriptions.getBeatSubscriptionUrl(src_1.TESTNET_URL, options)).toEqual(expectedURL);
                // Test the connection to the websocket
                await (0, fixture_1.testWebSocketConnection)(expectedURL);
            });
        });
    });
    /**
     * Test the New Transactions Subscription URLs functionalities
     */
    (0, globals_1.describe)('New Transactions Subscription URLs', () => {
        /**
         * Test the getNewTransactionsSubscriptionUrl function
         */
        fixture_1.getNewTransactionsSubscriptionUrlTestCases.forEach(({ expectedURL }) => {
            (0, globals_1.test)(`getNewTransactionsSubscriptionUrl`, async () => {
                (0, globals_1.expect)(src_1.subscriptions.getNewTransactionsSubscriptionUrl(src_1.TESTNET_URL)).toEqual(expectedURL);
                // Test the connection to the websocket
                await (0, fixture_1.testWebSocketConnection)(expectedURL);
            });
        });
    });
    /**
     * Test the VET Transfers Subscription URLs functionalities
     */
    (0, globals_1.describe)('VET Transfers Subscription URLs', () => {
        /**
         * Test the getVETtransfersSubscriptionUrl function
         */
        fixture_1.getVETtransfersSubscriptionUrlTestCases.forEach(({ options, expectedURL }) => {
            (0, globals_1.test)(`getVETtransfersSubscriptionUrl: ${(0, sdk_errors_1.stringifyData)(options)}`, async () => {
                (0, globals_1.expect)(src_1.subscriptions.getVETtransfersSubscriptionUrl(src_1.TESTNET_URL, options)).toEqual(expectedURL);
                // Test the connection to the websocket
                await (0, fixture_1.testWebSocketConnection)(expectedURL);
            });
        });
    });
    /**
     * Test if the websocket connection is valid
     */
    (0, globals_1.describe)('testWebSocketConnection Errors', () => {
        (0, globals_1.test)('Wrong subscription URL', async () => {
            const wrongUrl = 'ws://wrong.url';
            await (0, globals_1.expect)((0, fixture_1.testWebSocketConnection)(wrongUrl)).rejects.toThrowError('WebSocket connection error');
        });
    });
});
