"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_1 = require("./fixture");
const src_1 = require("../../../src");
const test_utils_1 = require("../../test-utils");
/**
 * ThorClient class tests
 *
 * @group integration/clients/thor-client/logs
 */
(0, globals_1.describe)('ThorClient - Logs Module', () => {
    // ThorClient instance
    let thorClient;
    (0, globals_1.beforeEach)(() => {
        thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
    });
    /**
     * filterGroupedEventLogs tests
     */
    (0, globals_1.test)('filterEventLogs', async () => {
        const eventLogs = await (0, test_utils_1.retryOperation)(async () => {
            return await thorClient.logs.filterRawEventLogs(fixture_1.argFilterEventLogs);
        });
        (0, globals_1.expect)(eventLogs).toEqual(fixture_1.expectedFilterEventLogs);
    }, 15000);
    /**
     * filterTransferLogs tests
     */
    (0, globals_1.test)('filterTransferLogs', async () => {
        const transferLogs = await (0, test_utils_1.retryOperation)(async () => {
            return await thorClient.logs.filterTransferLogs(fixture_1.argFilterTransferLogs);
        });
        //
        (0, globals_1.expect)(transferLogs).toEqual(fixture_1.expectedFilterTransferLogs);
    }, 15000);
});
