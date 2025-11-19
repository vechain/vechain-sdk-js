"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_1 = require("../fixture");
const sdk_errors_1 = require("@vechain/sdk-errors");
const test_utils_1 = require("../../../test-utils");
const src_1 = require("../../../../src");
/**
 * Test the Asynchronous Event poll functionalities side
 * @group unit/utils/event-poll
 */
(0, globals_1.describe)('Events poll unit tests', () => {
    /**
     * Correct cases
     */
    (0, globals_1.describe)('Correct cases', () => {
        /**
         * Restore to the real timers
         */
        (0, globals_1.afterEach)(() => {
            globals_1.jest.useRealTimers();
        });
        /**
         * Simple start and stop of an event poll
         */
        (0, globals_1.test)('Simple start and stop', async () => {
            // To mock setTimeouts we need to use jest fake timers which allow to manipulate time and test asynchronicity
            globals_1.jest.useFakeTimers({
                legacyFakeTimers: true
            });
            // Create event poll
            const eventPoll = src_1.Poll.createEventPoll(async () => await (0, fixture_1.simpleIncrementFunction)(0, 10), 1000)
                .onData((data, eventPoll) => {
                (0, globals_1.expect)(data).toBe(10);
                (0, globals_1.expect)(eventPoll).toBeDefined();
            })
                .onStart((eventPoll) => {
                (0, globals_1.expect)(eventPoll).toBeDefined();
            })
                .onStop((eventPoll) => {
                (0, globals_1.expect)(eventPoll).toBeDefined();
            });
            // Start listening and continue the execution flow
            eventPoll.startListen();
            // Advance timers by the specified interval & tick
            await (0, test_utils_1.advanceTimersByTimeAndTick)(1000);
            // Stop listening
            eventPoll.stopListen();
        });
        /**
         * Simple start and stop of an event poll and test asynchronicity
         */
        (0, globals_1.test)('Create event poll and test asynchronicity', async () => {
            globals_1.jest.useFakeTimers({
                legacyFakeTimers: true
            });
            // Create event poll
            const eventPoll = src_1.Poll.createEventPoll(async () => await (0, fixture_1.simpleIncrementFunction)(0, 10), 1000)
                .onData((data, eventPoll) => {
                (0, globals_1.expect)(data).toBe(10);
                if (eventPoll.getCurrentIteration === 3)
                    eventPoll.stopListen();
            })
                .onStop((eventPoll) => {
                (0, globals_1.expect)(eventPoll.getCurrentIteration).toBe(3);
            });
            // Start listening and continue the execution flow
            eventPoll.startListen();
            // It seems to be strange, BUT onData is called only after 1 second of the eventPoll.startListen() call.
            (0, globals_1.expect)(eventPoll.getCurrentIteration).toBe(0);
            // Advance timers by the specified interval & tick
            await (0, test_utils_1.advanceTimersByTimeAndTick)(1000);
            (0, globals_1.expect)(eventPoll.getCurrentIteration).toBe(1);
            await (0, test_utils_1.advanceTimersByTimeAndTick)(1000);
            (0, globals_1.expect)(eventPoll.getCurrentIteration).toBe(2);
            await (0, test_utils_1.advanceTimersByTimeAndTick)(1000);
            (0, globals_1.expect)(eventPoll.getCurrentIteration).toBe(3);
        }, 5000);
    });
    /**
     * Error cases
     */
    (0, globals_1.describe)('Error cases', () => {
        /**
         * Restore to the real timers
         */
        (0, globals_1.afterEach)(() => {
            globals_1.jest.useRealTimers();
        });
        /**
         * Test the error event
         */
        (0, globals_1.test)('Test the error event - polling loop stop', async () => {
            globals_1.jest.useFakeTimers({
                legacyFakeTimers: true
            });
            // Create event poll
            const eventPoll = src_1.Poll.createEventPoll(async () => await (0, fixture_1.simpleThrowErrorFunctionIfInputIs10)(10), 1000).onError((error) => {
                (0, globals_1.expect)(error).toBeDefined();
                (0, globals_1.expect)(error).toBeInstanceOf(sdk_errors_1.PollExecution);
            });
            eventPoll.startListen();
            await (0, test_utils_1.advanceTimersByTimeAndTick)(1000);
        });
        /**
         * Test the error event without stopping the poll loop.
         */
        (0, globals_1.test)('Test the error event - polling loop no-stop', async () => {
            globals_1.jest.useFakeTimers({
                legacyFakeTimers: true
            });
            // Create event poll
            const eventPoll = src_1.Poll.createEventPoll(async () => await (0, fixture_1.simpleThrowErrorFunctionIfInputIs10)(10), 1000).onError((error) => {
                (0, globals_1.expect)(error).toBeDefined();
                (0, globals_1.expect)(error).toBeInstanceOf(sdk_errors_1.PollExecution);
            });
            eventPoll.startListen();
            await (0, test_utils_1.advanceTimersByTimeAndTick)(1000);
            (0, globals_1.expect)(eventPoll.getCurrentIteration).toBe(1);
            // Advance timers by the specified interval & tick
            await (0, test_utils_1.advanceTimersByTimeAndTick)(1000);
            (0, globals_1.expect)(eventPoll.getCurrentIteration).toBe(2);
        });
        /**
         * Invalid request interval
         */
        (0, globals_1.test)('Invalid request interval', () => {
            for (const invalidParameter of fixture_1.invalidOptionsParametersForPollTests.filter(
            // Remove cases that are valid for sync poll
            (value) => !Number.isInteger(value.requestIntervalInMilliseconds) ||
                value.requestIntervalInMilliseconds <= 0)) {
                (0, globals_1.expect)(() => {
                    src_1.Poll.createEventPoll(async () => await (0, fixture_1.simpleThrowErrorFunctionIfInputIs10)(9), invalidParameter.requestIntervalInMilliseconds);
                }).toThrowError(invalidParameter.expectedError);
            }
        });
    });
});
