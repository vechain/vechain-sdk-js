import { describe, expect, test } from '@jest/globals';
import { Poll } from '../../../../src/utils/poll';
import { PollExecutionError } from '@vechain/vechain-sdk-errors';
import {
    invalidOptionsParametersForPollTests,
    simpleIncrementFunction,
    simpleThrowErrorFunctionIfInputIs10
} from '../fixture';

/**
 * Test the Synchronous poll functionalities side
 * @group unit/utils/sync-poll
 */
describe('Synchronous poll unit tests', () => {
    /**
     * Correct cases without force stopping
     */
    describe('No force stopping', () => {
        /**
         * Test without blocking execution on steps
         */
        test('Sync poll without blocking execution on steps', async () => {
            for (const requestInterval of [undefined, 100, 1000]) {
                const result = await Poll.SyncPoll(
                    async () => await simpleIncrementFunction(0, 10),
                    {
                        requestIntervalInMilliseconds: requestInterval
                    }
                ).waitUntil((result) => {
                    return result === 10;
                });
                expect(result).toBe(10);
            }
        });
    });

    describe('Force stopping', () => {
        /**
         * Test with blocking execution on steps
         */
        test('Sync poll with blocking execution on steps', async () => {
            // Sync poll - Set or not the request interval
            for (const requestInterval of [undefined, 100]) {
                const result = await Poll.SyncPoll(
                    async () => await simpleIncrementFunction(0, 10),
                    {
                        requestIntervalInMilliseconds: requestInterval,
                        // Stop after 3 iterations
                        maximumIterations: 3
                    }
                ).waitUntil((result) => {
                    // @IMPORTANT: Here this simple function will never reach 11. This is a case where the maximum iterations is useful.
                    return result === 11;
                });
                expect(result).toBe(10);
            }
        });

        /**
         * Test with maximum waiting time
         */
        test('Sync poll with blocking execution on maximum waiting time', async () => {
            const startTime = Date.now();

            await Poll.SyncPoll(
                async () => await simpleIncrementFunction(0, 10),
                {
                    requestIntervalInMilliseconds: 100,
                    maximumWaitingTimeInMilliseconds: 1000 // Stop after 1000ms
                }
            ).waitUntil((result) => {
                return result === 20; // Condition that will never be true because we will stop the poll before (after 1000ms)
            });

            const endTime = Date.now();

            // We expect that the poll will stop after 1000ms
            expect(endTime - startTime).toBeLessThan(2000);
        });
    });

    describe('Invalid parameters', () => {
        /**
         * Test with blocking execution on steps
         */
        test('Invalid parameters given as input', async () => {
            for (const invalidParameter of invalidOptionsParametersForPollTests) {
                await expect(async () => {
                    await Poll.SyncPoll(
                        async () => await simpleIncrementFunction(0, 10),
                        {
                            // Invalids
                            requestIntervalInMilliseconds:
                                invalidParameter.requestIntervalInMilliseconds,
                            maximumIterations:
                                invalidParameter.maximumIterations
                        }
                    ).waitUntil((result) => {
                        return result === 10;
                    });
                }).rejects.toThrowError(invalidParameter.expectedError);
            }
        });
    });

    /**
     * Tests when errors are thrown
     */
    describe('Throw error', () => {
        /**
         * Test with blocking execution on steps
         */
        test('Throw error', async () => {
            // Sync poll - Set or not the request interval
            for (const requestInterval of [undefined, 100]) {
                await expect(async () => {
                    await Poll.SyncPoll(
                        async () =>
                            await simpleThrowErrorFunctionIfInputIs10(10),
                        {
                            requestIntervalInMilliseconds: requestInterval,
                            // Stop after 3 iterations
                            maximumIterations: 3
                        }
                    ).waitUntil((result) => {
                        // @IMPORTANT: Here this simple function will never reach 11. But who cares, we know that it will throw an error. And after throwing an error, it will stop.
                        return result === 11;
                    });
                }).rejects.toThrowError(PollExecutionError);
            }
        });
    });
});
