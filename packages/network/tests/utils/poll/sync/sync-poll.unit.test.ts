import { describe, expect, test } from '@jest/globals';
import { Poll } from '../../../../src/utils/poll';
import { invalidOptionsParameters, simpleIncrementFunction } from './fixture';

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
                    async () =>
                        await Promise.resolve(simpleIncrementFunction(0, 10)),
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
                    async () =>
                        await Promise.resolve(simpleIncrementFunction(0, 10)),
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
    });

    describe('Invalid parameters', () => {
        /**
         * Test with blocking execution on steps
         */
        test('Invalid parameters given as input', async () => {
            for (const invalidParameter of invalidOptionsParameters) {
                await expect(async () => {
                    await Poll.SyncPoll(
                        async () =>
                            await Promise.resolve(
                                simpleIncrementFunction(0, 10)
                            ),
                        {
                            // Invalids
                            requestIntervalInMilliseconds:
                                invalidParameter.requestIntervalInMilliseconds,
                            maximumIterations:
                                invalidParameter.maximumIterations
                        }
                    ).waitUntil((result) => {
                        // @IMPORTANT: Here this simple function will never reach 11. This is a case where the maximum iterations is useful.
                        return result === 10;
                    });
                }).rejects.toThrowError(invalidParameter.expectedError);
            }
        });
    });
});
