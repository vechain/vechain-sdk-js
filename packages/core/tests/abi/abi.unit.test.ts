import { describe, expect, test } from '@jest/globals';
import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiFragment,
    InvalidAbiSignatureFormat,
    stringifyData
} from '@vechain/sdk-errors';
import { type ethers, ParamType } from 'ethers';
import { abi, type FormatType } from '../../src';
import {
    encodedDecodedInvalidValues,
    encodedDecodedValues,
    encodedParams,
    events,
    functions,
    invalidTopicsEventTestCases,
    simpleParametersDataForFunction2,
    topicsEventTestCases
} from './fixture';

/**
 * ABI tests - encode & decode
 * @group unit/encode-decode
 */
describe('Abi - encode & decode', () => {
    /**
     * Test the encoding and decoding of a single parameter.
     */
    test('encode / decode single parameter', () => {
        // Encode and Decode - NO Errors
        encodedDecodedValues.forEach((encodedDecodedValue) => {
            const encoded = abi.encode<string | string[]>(
                encodedDecodedValue.type,
                encodedDecodedValue.value
            );

            const decoded = abi.decode<bigint | string | object>(
                encodedDecodedValue.type,
                encodedDecodedValue.encoded
            );

            expect(encoded).toBe(encodedDecodedValue.encoded);

            // @NOTE: this is used to avoid JEST error: 'TypeError: Do not know how to serialize a BigInt'
            if (typeof decoded !== 'bigint') {
                expect(decoded).toStrictEqual(encodedDecodedValue.value);
            } else {
                expect(decoded).toBe(
                    BigInt(encodedDecodedValue.value as string)
                );
            }
        });

        // Encode and Decode - Errors
        encodedDecodedInvalidValues.forEach((encodedDecodedValue) => {
            expect(() =>
                abi.encode(encodedDecodedValue.type, encodedDecodedValue.value)
            ).toThrowError(InvalidAbiDataToEncodeOrDecode);

            expect(() =>
                abi.decode(
                    encodedDecodedValue.type,
                    encodedDecodedValue.encoded
                )
            ).toThrowError(InvalidAbiDataToEncodeOrDecode);
        });
    });

    /**
     * Test encoding and decoding of multiple parameters.
     */
    test('encode/decode more parameters', () => {
        // Example encode of function 2 parameters
        const encoded = abi.encode<
            Array<{
                master: string;
                endorsor: string;
                identity: string;
                active: boolean;
            }>
        >(
            ParamType.from(functions[1].objectAbi.outputs[0]),
            simpleParametersDataForFunction2
        );

        // @NOTE: you can use encode and avoid types gymnastics.
        // const encoded = abi.encode(
        //     ParamType.from(functions[1].objectAbi.outputs[0]),
        //     simpleParametersDataForFunction2
        // );

        // Example decode of function 2 parameters
        const decoded = abi.decode<ethers.Result[][]>(
            ParamType.from(functions[1].objectAbi.outputs[0]),
            encoded
        );

        expect(encoded).toBe(
            '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000e8fd586e022f825a109848832d7e552132bc332000000000000000000000000224626926a7a12225a60e127cec119c939db4a5cdbf2712e19af00dc4d376728f7cb06cc215c8e7c53b94cb47cefb4a26ada2a6c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000004977d68df97bb313b23238520580d8d3a59939bf0000000000000000000000007ad1d568b3fe5bad3fc264aca70bc7bcd5e4a6ff83b137cf7e30864b8a4e56453eb1f094b4434685d86895de38ac2edcf5d3f5340000000000000000000000000000000000000000000000000000000000000000'
        );

        expect(decoded).toStrictEqual([
            [
                '0x0E8FD586E022F825A109848832D7E552132bC332',
                '0x224626926A7A12225A60E127CEC119c939db4A5C',
                '0xdbf2712e19af00dc4d376728f7cb06cc215c8e7c53b94cb47cefb4a26ada2a6c',
                false
            ],
            [
                '0x4977d68df97bb313B23238520580D8D3a59939BF',
                '0x7Ad1D568B3fE5BAd3fC264AcA70Bc7Bcd5e4a6fF',
                '0x83b137cf7e30864b8a4e56453eb1f094b4434685d86895de38ac2edcf5d3f534',
                false
            ]
        ]);
    });
});

/**
 * ABI tests - Function & Event
 * @group unit/function-event
 */
describe('Abi - Function & Event', () => {
    /**
     * Functions
     */
    describe('Functions', () => {
        /**
         * Encode and Decode.
         * Test with each function in each format.
         */
        test('Encode AND Decode', () => {
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
                            () => new abi.Function(functionFormat.format)
                        ).not.toThrowError(InvalidAbiFragment);

                        // Create a function from the format without any problems
                        const myFunction = new abi.Function(
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

                                // Decode input
                                const decoded = myFunction.decodeInput(encoded);

                                // Encoded input will be equal to decoded input
                                expect(decoded).toStrictEqual(encodingInput);
                            }
                        );
                    });
                });
        });

        /**
         * Test case for parameters encoding.
         *
         * @test
         */
        test('encode parameters', () => {
            /**
             * Parameters to be encoded using ABI.
             *
             * @type {string}
             */
            const params: string = abi.encodeParams(
                ['uint256', 'uint256'],
                ['123', '234']
            );

            // Assert that the encoded parameters match the expected value.
            expect(params).toBe(encodedParams);
        });

        /**
         * Test case for failed parameters encoding.
         *
         * @test
         */
        test('should throw an error for invalid encoding', () => {
            const abiTypes = ['uint256', 'address'];
            const values = ['123', '0x1567890123456789012345678901234567890']; // the address is invalid

            // Expect the function to throw an error with the specific message
            expect(() => abi.encodeParams(abiTypes, values)).toThrowError(
                InvalidAbiDataToEncodeOrDecode
            );
        });

        /**
         * Invalid function
         */
        test('Invalid function', () => {
            expect(() => new abi.Function('INVALID_VALUE')).toThrowError(
                InvalidAbiFragment
            );
        });

        /**
         * Invalid decode and encode
         */
        test('Invalid decode and encode', () => {
            const myFunction = new abi.Function(functions[0].full);

            // Encode
            expect(() =>
                myFunction.encodeInput([1, 2, 'INVALID'])
            ).toThrowError(InvalidAbiDataToEncodeOrDecode);

            // Decode
            expect(() => myFunction.decodeInput('INVALID')).toThrowError(
                InvalidAbiDataToEncodeOrDecode
            );
        });

        /**
         * Invalid sighash
         */
        test('Invalid signature format type', () => {
            const myFunction = new abi.Function(functions[0].full);
            const invalidFormat = 'invalid' as FormatType;
            expect(() => myFunction.signature(invalidFormat)).toThrowError(
                InvalidAbiSignatureFormat
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
                            () => new abi.Event(eventFormat.format)
                        ).not.toThrowError();

                        // Create an event from the format without any problems
                        const myEvent = new abi.Event(eventFormat.format);

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
            expect(() => new abi.Event('INVALID_VALUE')).toThrowError(
                InvalidAbiFragment
            );
        });

        /**
         * Invalid decode and encode
         */
        test('Invalid decode and encode', () => {
            const myEvent = new abi.Event(events[0].full);

            // Encode
            expect(() =>
                myEvent.encodeEventLog([1, 2, 'INVALID'])
            ).toThrowError(InvalidAbiDataToEncodeOrDecode);

            // Decode
            expect(() =>
                myEvent.decodeEventLog({
                    data: 'INVALID',
                    topics: ['INVALID_1', 'INVALID_2']
                })
            ).toThrowError(InvalidAbiDataToEncodeOrDecode);
        });

        /**
         * Invalid sighash
         */
        test('Invalid signature format type', () => {
            const myEvent = new abi.Event(events[0].full);
            const invalidFormat = 'invalid' as FormatType;
            expect(() => myEvent.signature(invalidFormat)).toThrowError(
                InvalidAbiSignatureFormat
            );
        });

        /**
         * Encode Event topics test cases
         */
        topicsEventTestCases.forEach(
            ({ event, valuesToEncode, expectedTopics }) => {
                test(`Encode Event topics - ${
                    typeof event === 'string' ? event : stringifyData(event)
                }`, () => {
                    const ev = new abi.Event(event);

                    const topics = ev.encodeFilterTopics(valuesToEncode);

                    expect(topics).toStrictEqual(expectedTopics);
                });
            }
        );

        /**
         * Invalid Event topics test cases
         */
        invalidTopicsEventTestCases.forEach(
            ({ event, valuesToEncode, expectedError }) => {
                test(`Encode Event topics - ${stringifyData(event)}`, () => {
                    const ev = new abi.Event(event);

                    expect(() =>
                        ev.encodeFilterTopics(valuesToEncode)
                    ).toThrowError(expectedError);
                });
            }
        );
    });
});
