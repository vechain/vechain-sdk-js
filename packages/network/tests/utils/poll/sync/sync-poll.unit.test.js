"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
const fixture_1 = require("../fixture");
/**
 * Test the Synchronous poll functionalities side
 * @group unit/utils/sync-poll
 */
(0, globals_1.describe)('Synchronous poll unit tests', () => {
    /**
     * Correct cases without force stopping
     */
    (0, globals_1.describe)('No force stopping', () => {
        /**
         * Test without blocking execution on steps
         */
        (0, globals_1.test)('Sync poll without blocking execution on steps', async () => {
            for (const requestInterval of [undefined, 100, 1000]) {
                const result = await src_1.Poll.SyncPoll(async () => await (0, fixture_1.simpleIncrementFunction)(0, 10), {
                    requestIntervalInMilliseconds: requestInterval
                }).waitUntil((result) => {
                    return result === 10;
                });
                (0, globals_1.expect)(result).toBe(10);
            }
        });
    });
    (0, globals_1.describe)('Force stopping', () => {
        /**
         * Test with blocking execution on steps
         */
        (0, globals_1.test)('Sync poll with blocking execution on steps', async () => {
            // Sync poll - Set or not the request interval
            for (const requestInterval of [undefined, 100]) {
                const result = await src_1.Poll.SyncPoll(async () => await (0, fixture_1.simpleIncrementFunction)(0, 10), {
                    requestIntervalInMilliseconds: requestInterval,
                    // Stop after 3 iterations
                    maximumIterations: 3
                }).waitUntil((result) => {
                    // @IMPORTANT: Here this simple function will never reach 11. This is a case where the maximum iterations is useful.
                    return result === 11;
                });
                (0, globals_1.expect)(result).toBe(10);
            }
        });
        /**
         * Test with maximum waiting time
         */
        (0, globals_1.test)('Sync poll with blocking execution on maximum waiting time', async () => {
            const startTime = Date.now();
            await src_1.Poll.SyncPoll(async () => await (0, fixture_1.simpleIncrementFunction)(0, 10), {
                requestIntervalInMilliseconds: 100,
                maximumWaitingTimeInMilliseconds: 1000 // Stop after 1000ms
            }).waitUntil((result) => {
                return result === 20; // Condition that will never be true because we will stop the poll before (after 1000ms)
            });
            const endTime = Date.now();
            // We expect that the poll will stop after 1000ms
            (0, globals_1.expect)(endTime - startTime).toBeLessThan(2000);
        });
    });
    (0, globals_1.describe)('Invalid parameters', () => {
        /**
         * Test with blocking execution on steps
         */
        (0, globals_1.test)('Invalid parameters given as input', async () => {
            for (const invalidParameter of fixture_1.invalidOptionsParametersForPollTests) {
                await (0, globals_1.expect)(async () => {
                    await src_1.Poll.SyncPoll(async () => await (0, fixture_1.simpleIncrementFunction)(0, 10), {
                        // Invalids
                        requestIntervalInMilliseconds: invalidParameter.requestIntervalInMilliseconds,
                        maximumIterations: invalidParameter.maximumIterations,
                        maximumWaitingTimeInMilliseconds: invalidParameter.maximumWaitingTimeInMilliseconds
                    }).waitUntil((result) => {
                        return result === 10;
                    });
                }).rejects.toThrowError(invalidParameter.expectedError);
            }
        });
    });
    /**
     * Tests when errors are thrown
     */
    (0, globals_1.describe)('Throw error', () => {
        /**
         * Test with blocking execution on steps
         */
        (0, globals_1.test)('Throw error', async () => {
            // Sync poll - Set or not the request interval
            for (const requestInterval of [undefined, 100]) {
                await (0, globals_1.expect)(async () => {
                    await src_1.Poll.SyncPoll(async () => await (0, fixture_1.simpleThrowErrorFunctionIfInputIs10)(10), {
                        requestIntervalInMilliseconds: requestInterval,
                        // Stop after 3 iterations
                        maximumIterations: 3
                    }).waitUntil((result) => {
                        // @IMPORTANT: Here this simple function will never reach 11. But who cares, we know that it will throw an error. And after throwing an error, it will stop.
                        return result === 11;
                    });
                }).rejects.toThrowError(sdk_errors_1.PollExecution);
            }
        });
        (0, globals_1.test)('Test simpleThrowErrorFunctionIfInputIs10', () => {
            const poll = src_1.Poll.SyncPoll(async () => await (0, fixture_1.simpleThrowErrorFunctionIfInputIs10)(7), {
                requestIntervalInMilliseconds: 100,
                // Stop after 2 iterations
                maximumIterations: 2
            }).waitUntil((result) => {
                return result === 9;
            });
            (0, globals_1.expect)(poll).toBeDefined();
        });
    });
});
