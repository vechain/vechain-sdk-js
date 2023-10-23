import { describe, expect, test } from '@jest/globals';
import { events, functions } from './fixture';
import { type FormatType, abi } from '../../src/abi';
import { ERRORS } from '../../src';

/**
 * ABI tests - High level
 * @group unit/high-level-abi
 */
describe('Abi - High level', () => {
    /**
     * Functions
     */
    describe('Functions', () => {
        /**
         * Encode and Decode.
         * Test with each function in each format.
         */
        test('Encode inputs AND Decode outputs', () => {
            // Create a function from each format and compare between format (test if conversions are correct)
            functions
                .map((fixtureFunction) => {
                    return [
                        {
                            format: fixtureFunction.full,
                            encodingTestsInputs:
                                fixtureFunction.encodingTestsInputs,
                            signatureHash: fixtureFunction.signatureHash
                        },
                        {
                            format: fixtureFunction.minimal,
                            encodingTestsInputs:
                                fixtureFunction.encodingTestsInputs,
                            signatureHash: fixtureFunction.signatureHash
                        },
                        {
                            format: fixtureFunction.objectAbi,
                            encodingTestsInputs:
                                fixtureFunction.encodingTestsInputs,
                            signatureHash: fixtureFunction.signatureHash
                        },
                        {
                            format: JSON.parse(
                                fixtureFunction.jsonStringifiedAbi
                            ) as string,
                            encodingTestsInputs:
                                fixtureFunction.encodingTestsInputs,
                            signatureHash: fixtureFunction.signatureHash
                        },
                        {
                            format: fixtureFunction.sighash,
                            encodingTestsInputs:
                                fixtureFunction.encodingTestsInputs,
                            signatureHash: fixtureFunction.signatureHash
                        }
                    ];
                })
                .forEach((functionMultiformat) => {
                    // For each function format
                    functionMultiformat.forEach((functionFormat) => {
                        // Create a function from the format without any problems
                        expect(
                            () =>
                                new abi.highLevel.Function(
                                    functionFormat.format
                                )
                        ).not.toThrow();

                        // Create a function from the format without any problems
                        const myFunction = new abi.highLevel.Function(
                            functionFormat.format
                        );

                        // Expect to have a signature in each format
                        expect(myFunction.signature('full')).toBeDefined();
                        expect(myFunction.signature('minimal')).toBeDefined();
                        expect(myFunction.signature('sighash')).toBeDefined();
                        expect(myFunction.signature('json')).toBeDefined();

                        // Expect to have a signature in each format
                        ['full', 'minimal', 'json', 'sighash'].forEach(
                            (sigFormat: string) => {
                                expect(() =>
                                    myFunction.signature(
                                        sigFormat as FormatType
                                    )
                                ).toBeDefined();
                            }
                        );

                        // Verify signature hash
                        expect(myFunction.signatureHash()).toBe(
                            functionFormat.signatureHash
                        );

                        // Encode each input
                        functionFormat.encodingTestsInputs.forEach(
                            (encodingInput) => {
                                // Encoded input from each format
                                const encoded =
                                    myFunction.encodeInput(encodingInput);

                                expect(encoded).toBeDefined();

                                // Decode output
                                const decoded =
                                    myFunction.decodeOutput(encoded);

                                // Encoded input will be equal to decoded output
                                expect(decoded).toStrictEqual(encodingInput);
                            }
                        );
                    });
                });
        });

        /**
         * Invalid function
         */
        test('Invalid function', () => {
            expect(
                () => new abi.highLevel.Function('INVALID_VALUE')
            ).toThrowError(ERRORS.ABI.HIGH_LEVEL.INVALID_FUNCTION);
        });

        /**
         * Invalid decode and encode
         */
        test('Invalid decode and encode', () => {
            const myFunction = new abi.highLevel.Function(functions[0].full);

            // Encode
            expect(() =>
                myFunction.encodeInput([1, 2, 'INVALID'])
            ).toThrowError(ERRORS.ABI.HIGH_LEVEL.INVALID_DATA_TO_ENCODE);

            // Decode
            expect(() => myFunction.decodeOutput('INVALID')).toThrowError(
                ERRORS.ABI.HIGH_LEVEL.INVALID_DATA_TO_DECODE
            );
        });

        /**
         * Invalid sighash
         */
        test('Invalid signature format type', () => {
            const myFunction = new abi.highLevel.Function(functions[0].full);
            const invalidFormat = 'invalid' as FormatType;
            expect(() => myFunction.signature(invalidFormat)).toThrowError(
                ERRORS.ABI.HIGH_LEVEL.INVALID_FORMAT_TYPE
            );
        });
    });

    /**
     * Events
     */
    describe('Events', () => {
        /**
         * Encode and Decode.
         * Test with each event in each format.
         */
        test('Encode inputs AND Decode event log', () => {
            // Create an event from each format and compare between format (test if conversions are correct)
            events
                .map((fixtureEvent) => {
                    return [
                        {
                            format: fixtureEvent.full,
                            encodingTestsInputs:
                                fixtureEvent.encodingTestsInputs,
                            signatureHash: fixtureEvent.signatureHash
                        },
                        {
                            format: fixtureEvent.minimal,
                            encodingTestsInputs:
                                fixtureEvent.encodingTestsInputs,
                            signatureHash: fixtureEvent.signatureHash
                        },
                        {
                            format: fixtureEvent.objectAbi,
                            encodingTestsInputs:
                                fixtureEvent.encodingTestsInputs,
                            signatureHash: fixtureEvent.signatureHash
                        },
                        {
                            format: JSON.parse(
                                fixtureEvent.jsonStringifiedAbi
                            ) as string,
                            encodingTestsInputs:
                                fixtureEvent.encodingTestsInputs,
                            signatureHash: fixtureEvent.signatureHash
                        },
                        {
                            format: fixtureEvent.sighash,
                            encodingTestsInputs:
                                fixtureEvent.encodingTestsInputs,
                            signatureHash: fixtureEvent.signatureHash
                        }
                    ];
                })
                .forEach((eventMultiformat) => {
                    // For each event format
                    eventMultiformat.forEach((eventFormat) => {
                        // Create an event from the format without any problems
                        expect(
                            () => new abi.highLevel.Event(eventFormat.format)
                        ).not.toThrow();

                        // Create an event from the format without any problems
                        const myEvent = new abi.highLevel.Event(
                            eventFormat.format
                        );

                        // Expect to have a signature in each format
                        expect(myEvent.signature('full')).toBeDefined();
                        expect(myEvent.signature('minimal')).toBeDefined();
                        expect(myEvent.signature('sighash')).toBeDefined();
                        expect(myEvent.signature('json')).toBeDefined();

                        // Verify signature hash
                        expect(myEvent.signatureHash()).toBe(
                            eventFormat.signatureHash
                        );

                        // Encode each input
                        eventFormat.encodingTestsInputs.forEach(
                            (encodingInput) => {
                                // Encoded input from each format
                                const encoded =
                                    myEvent.encodeEventLog(encodingInput);

                                expect(encoded).toBeDefined();

                                // // Decode output
                                const decoded = myEvent.decodeEventLog(encoded);

                                // Encoded input will be equal to decoded output
                                expect(decoded).toStrictEqual(encodingInput);
                            }
                        );
                    });
                });
        });

        /**
         * Invalid event
         */
        test('Invalid event', () => {
            expect(() => new abi.highLevel.Event('INVALID_VALUE')).toThrowError(
                ERRORS.ABI.HIGH_LEVEL.INVALID_EVENT
            );
        });

        /**
         * Invalid decode and encode
         */
        test('Invalid decode and encode', () => {
            const myEvent = new abi.highLevel.Event(events[0].full);

            // Encode
            expect(() =>
                myEvent.encodeEventLog([1, 2, 'INVALID'])
            ).toThrowError(ERRORS.ABI.HIGH_LEVEL.INVALID_DATA_TO_ENCODE);

            // Decode
            expect(() =>
                myEvent.decodeEventLog({
                    data: 'INVALID',
                    topics: ['INVALID_1', 'INVALID_2']
                })
            ).toThrowError(ERRORS.ABI.HIGH_LEVEL.INVALID_DATA_TO_DECODE);
        });

        /**
         * Invalid sighash
         */
        test('Invalid signature format type', () => {
            const myEvent = new abi.highLevel.Event(events[0].full);
            const invalidFormat = 'invalid' as FormatType;
            expect(() => myEvent.signature(invalidFormat)).toThrowError(
                ERRORS.ABI.HIGH_LEVEL.INVALID_FORMAT_TYPE
            );
        });
    });
});
