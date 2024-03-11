import { afterEach, describe, expect, jest, test } from '@jest/globals';
import {
    invalidOptionsParametersForPollTests,
    simpleIncrementFunction,
    simpleThrowErrorFunctionIfInputIs10
} from '../fixture';
import { PollExecutionError } from '@vechain/sdk-errors';
import { advanceTimersByTimeAndTick } from '../../../test-utils';
import { Poll } from '../../../../src';

/**
 * Test the Asynchronous Event poll functionalities side
 * @group unit/utils/event-poll
 */
describe('Events poll unit tests', () => {
    /**
     * Correct cases
     */
    describe('Correct cases', () => {
        /**
         * Restore to the real timers
         */
        afterEach(() => {
            jest.useRealTimers();
        });

        /**
         * Simple start and stop of an event poll
         */
        test('Simple start and stop', async () => {
            // To mock setTimeouts we need to use jest fake timers which allow to manipulate time and test asynchronicity
            jest.useFakeTimers({
                legacyFakeTimers: true
            });

            // Create event poll
            const eventPoll = Poll.createEventPoll(
                async () => await simpleIncrementFunction(0, 10),
                1000
            )
                .onData((data, eventPoll) => {
                    expect(data).toBe(10);
                    expect(eventPoll).toBeDefined();
                })
                .onStart((eventPoll) => {
                    expect(eventPoll).toBeDefined();
                })
                .onStop((eventPoll) => {
                    expect(eventPoll).toBeDefined();
                });

            // Start listening and continue the execution flow
            eventPoll.startListen();

            // Advance timers by the specified interval & tick
            await advanceTimersByTimeAndTick(1000);

            // Stop listening
            eventPoll.stopListen();
        });

        /**
         * Simple start and stop of an event poll and test asynchronicity
         */
        test('Create event poll and test asynchronicity', async () => {
            jest.useFakeTimers({
                legacyFakeTimers: true
            });

            // Create event poll
            const eventPoll = Poll.createEventPoll(
                async () => await simpleIncrementFunction(0, 10),
                1000
            )
                .onData((data, eventPoll) => {
                    expect(data).toBe(10);
                    if (eventPoll.getCurrentIteration === 3)
                        eventPoll.stopListen();
                })
                .onStop((eventPoll) => {
                    expect(eventPoll.getCurrentIteration).toBe(3);
                });

            // Start listening and continue the execution flow
            eventPoll.startListen();

            // It seems to be strange, BUT onData is called only after 1 second of the eventPoll.startListen() call.
            expect(eventPoll.getCurrentIteration).toBe(0);

            // Advance timers by the specified interval & tick
            await advanceTimersByTimeAndTick(1000);

            expect(eventPoll.getCurrentIteration).toBe(1);

            await advanceTimersByTimeAndTick(1000);

            expect(eventPoll.getCurrentIteration).toBe(2);

            await advanceTimersByTimeAndTick(1000);

            expect(eventPoll.getCurrentIteration).toBe(3);
        }, 5000);
    });

    /**
     * Error cases
     */
    describe('Error cases', () => {
        /**
         * Restore to the real timers
         */
        afterEach(() => {
            jest.useRealTimers();
        });
        /**
         * Test the error event
         */
        test('Test the error event', async () => {
            jest.useFakeTimers({
                legacyFakeTimers: true
            });

            // Create event poll
            const eventPoll = Poll.createEventPoll(
                async () => await simpleThrowErrorFunctionIfInputIs10(10),
                1000
            ).onError((error) => {
                expect(error).toBeDefined();
                expect(error).toBeInstanceOf(PollExecutionError);
            });

            eventPoll.startListen();

            await advanceTimersByTimeAndTick(1000);
        });

        /**
         * Invalid request interval
         */
        test('Invalid request interval', () => {
            for (const invalidParameter of invalidOptionsParametersForPollTests.filter(
                // Remove cases that are valid for sync poll
                (value) =>
                    !Number.isInteger(value.requestIntervalInMilliseconds) ||
                    value.requestIntervalInMilliseconds <= 0
            )) {
                expect(() => {
                    Poll.createEventPoll(
                        async () =>
                            await simpleThrowErrorFunctionIfInputIs10(9),
                        invalidParameter.requestIntervalInMilliseconds
                    );
                }).toThrowError(invalidParameter.expectedError);
            }
        });
    });
});
