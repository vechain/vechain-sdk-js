import { describe, expect, test } from '@jest/globals';
import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiItem,
    InvalidDataType,
    stringifyData
} from '@vechain/sdk-errors';
import { ParamType, type ethers } from 'ethers';
import { type AbiEvent, type AbiFunction } from 'viem';
import { abi, ABIEvent, ABIFunction, Hex } from '../../src';
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
                        }
                    ];
                })
                .forEach((functionMultiformat) => {
                    // For each function format
                    functionMultiformat.forEach((functionFormat) => {
                        // Create a function from the format without any problems
                        expect(
                            () =>
                                new ABIFunction(
                                    functionFormat.format as AbiFunction
                                )
                        ).not.toThrowError(InvalidAbiItem);

                        // Create a function from the format without any problems
                        const myFunction = new ABIFunction(
                            functionFormat.format as AbiFunction
                        );

                        // Expect to have a signature in each format
                        expect(myFunction.format()).toBeDefined();
                        expect(myFunction.format('json')).toBeDefined();

                        // Verify signature hash
                        expect(myFunction.signatureHash).toBe(
                            functionFormat.signatureHash
                        );

                        // Encode each input
                        functionFormat.encodingTestsInputs.forEach(
                            (encodingInput) => {
                                // Encoded input from each format
                                const encoded =
                                    myFunction.encodeData(encodingInput);

                                expect(encoded).toBeDefined();

                                // Decode input
                                const decoded = myFunction.decodeData(encoded);

                                // Encoded input will be equal to decoded input
                                const expected = decoded.args ?? [];
                                expect(expected).toStrictEqual(encodingInput);
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
            expect(() => new ABIFunction('INVALID_VALUE')).toThrowError(
                InvalidAbiItem
            );
        });

        /**
         * Invalid decode and encode
         */
        test('Invalid decode and encode', () => {
            const myFunction = new ABIFunction(functions[0].full);

            // Encode
            expect(() => myFunction.encodeData([1, 2, 'INVALID'])).toThrowError(
                InvalidAbiDataToEncodeOrDecode
            );

            // Decode
            expect(() => myFunction.decodeData(Hex.of('INVALID'))).toThrowError(
                InvalidDataType
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
                        }
                    ];
                })
                .forEach((eventMultiformat) => {
                    // For each event format
                    eventMultiformat.forEach((eventFormat) => {
                        // Create an event from the format without any problems
                        expect(
                            () => new ABIEvent(eventFormat.format as AbiEvent)
                        ).not.toThrowError();

                        // Create an event from the format without any problems
                        const myEvent = new ABIEvent(
                            eventFormat.format as AbiEvent
                        );

                        // Expect to have a signature in each format
                        expect(myEvent.format()).toBeDefined();
                        expect(myEvent.format('json')).toBeDefined();

                        // Verify signature hash
                        expect(myEvent.signatureHash).toBe(
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
                                const decoded =
                                    myEvent.decodeEventLogAsArray(encoded);

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
            expect(() => new ABIEvent('INVALID_VALUE')).toThrowError(
                InvalidAbiItem
            );
        });

        /**
         * Invalid decode and encode
         */
        test('Invalid decode and encode', () => {
            const myEvent = new ABIEvent(events[0].full);

            // Encode
            expect(() =>
                myEvent.encodeEventLog([1, 2, 'INVALID'])
            ).toThrowError(InvalidAbiDataToEncodeOrDecode);

            // Decode
            expect(() =>
                myEvent.decodeEventLog({
                    data: Hex.of('INVALID'),
                    topics: [Hex.of('INVALID_1'), Hex.of('INVALID_2')]
                })
            ).toThrowError(InvalidDataType);
        });

        /**
         * Encode Event topics test cases
         */
        topicsEventTestCases.forEach(
            ({ event, valuesToEncode, expectedTopics }) => {
                test(`Encode Event topics - ${
                    typeof event === 'string' ? event : stringifyData(event)
                }`, () => {
                    const ev =
                        typeof event === 'string'
                            ? new ABIEvent(event)
                            : new ABIEvent(event as AbiEvent);

                    const topics = ev.encodeFilterTopicsNoNull(valuesToEncode);

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
                    const ev =
                        typeof event === 'string'
                            ? new ABIEvent(event)
                            : new ABIEvent(event as AbiEvent);

                    expect(() =>
                        ev.encodeFilterTopics(valuesToEncode)
                    ).toThrowError(expectedError);
                });
            }
        );
    });
});
