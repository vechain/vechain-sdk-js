import { describe, expect, test } from '@jest/globals';
import { EventPoll } from '../../../../src/utils/poll/event';
import {
    simpleIncrementFunction,
    simpleThrowErrorFunctionIfInputIs10
} from '../sync/fixture';
import { PoolExecutionError } from '@vechainfoundation/vechain-sdk-errors';

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
         * Simple start and stop of an event poll
         */
        test('Simple start and stop', () => {
            // Create event poll
            const eventPoll = new EventPoll(
                async () => await simpleIncrementFunction(0, 10),
                1000
            );

            // No errors
            eventPoll.onError((error) => {
                expect(error).toBeUndefined();
            });

            // Normal data
            eventPoll.onData((data, eventPoll) => {
                expect(data).toBe(10);
                expect(eventPoll).toBeDefined();
            });

            // Start listening
            eventPoll.onStart((eventPoll) => {
                expect(eventPoll).toBeDefined();
            });

            // Stop listening
            eventPoll.onStop((eventPoll) => {
                expect(eventPoll).toBeDefined();
            });

            // Start listening and continue the execution flow
            eventPoll.startListen();

            // Stop listening
            eventPoll.stopListen();
        });

        /**
         * Simple start and stop of an event poll and test asynchronicity
         */
        test('Create event poll and test asynchronicity', () => {
            // Create event poll
            const eventPoll = new EventPoll(
                async () => await simpleIncrementFunction(0, 10),
                100
            );

            // Simple onData
            eventPoll.onData((data, eventPoll) => {
                expect(data).toBe(10);
                if (eventPoll.getCurrentIteration === 3) eventPoll.stopListen();
            });

            // Start listening and continue the execution flow
            eventPoll.startListen();

            // It seeme to be strange, BUT onData is called only after 1 second of the eventPoll.startListen() call.
            expect(eventPoll.getCurrentIteration).toBe(0);

            // Test "Asynchronicity". Code must be executed after the eventPoll.startListen() call
            expect(true).toBe(true);

            // Wait until the event poll is stopped. NOW we know that iteration is 3
            eventPoll.onStop((eventPoll) => {
                expect(eventPoll.getCurrentIteration).toBe(3);
            });
        }, 5000);
    });

    /**
     * Error cases
     */
    describe('Error cases', () => {
        /**
         * Test the error event
         */
        test('Test the error event', () => {
            // Create event poll
            const eventPoll = new EventPoll(async () => {
                await simpleThrowErrorFunctionIfInputIs10(10);
            }, 1000);

            // Error occurred
            eventPoll.onError((error) => {
                expect(error).toBeDefined();
                expect(error).toBeInstanceOf(PoolExecutionError);
            });

            eventPoll.startListen();
        });
    });
});
