import { describe, expect, test } from '@jest/globals';
import { createEventPoll } from '../../../../src/utils/poll/event';

import {
    simpleIncrementFunction,
    simpleThrowErrorFunctionIfInputIs10
} from '../fixture';
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
            const eventPoll = createEventPoll(
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

            // Stop listening
            eventPoll.stopListen();
        });

        /**
         * Simple start and stop of an event poll and test asynchronicity
         */
        test('Create event poll and test asynchronicity', () => {
            // Create event poll
            const eventPoll = createEventPoll(
                async () => await simpleIncrementFunction(0, 10),
                100
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

            // It seeme to be strange, BUT onData is called only after 1 second of the eventPoll.startListen() call.
            expect(eventPoll.getCurrentIteration).toBe(0);

            // Test "Asynchronicity". Code must be executed after the eventPoll.startListen() call
            expect(true).toBe(true);
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
            const eventPoll = createEventPoll(
                async () => await simpleThrowErrorFunctionIfInputIs10(10),
                1000
            ).onError((error) => {
                expect(error).toBeDefined();
                expect(error).toBeInstanceOf(PoolExecutionError);
            });

            eventPoll.startListen();
        });
    });
});
