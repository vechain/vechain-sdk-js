import { describe, expect, test } from '@jest/globals';
import {
    // abi
    type AbiEvent,
    type AbiFunction,
    parseAbiParameters,
    parseAbiItem,
    encodeAbiParameters,
    decodeAbiParameters,
    encodeFunctionData,
    decodeFunctionData,
    encodeEventTopics,
    decodeEventLog,

    // hash
    toFunctionHash,
    toEventHash
} from '@viem';
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
import fastJsonStableStringify from 'fast-json-stable-stringify';

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
            const abiParams = parseAbiParameters(
                encodedDecodedValue.type as string
            );

            const encoded = encodeAbiParameters(abiParams, [
                encodedDecodedValue.value
            ]);

            const decoded = decodeAbiParameters(
                abiParams,
                encodedDecodedValue.encoded as `0x${string}`
            );

            expect(encoded).toBe(encodedDecodedValue.encoded);

            // @NOTE: this is used to avoid JEST error: 'TypeError: Do not know how to serialize a BigInt'
            if (typeof decoded[0] !== 'bigint') {
                expect(decoded[0]).toStrictEqual(encodedDecodedValue.value);
            } else {
                expect(decoded[0]).toBe(
                    BigInt(encodedDecodedValue.value as string)
                );
            }
        });

        // Encode and Decode - Errors
        encodedDecodedInvalidValues.forEach((encodedDecodedValue) => {
            expect(() => {
                try {
                    const abiParams = parseAbiParameters(
                        encodedDecodedValue.type as string
                    );
                    encodeAbiParameters(abiParams, [
                        encodedDecodedValue.value
                    ] as readonly unknown[]);
                } catch {
                    throw new Error('Invalid encoding');
                }
            }).toThrowError();
        });
    });

    /**
     * Test encoding and decoding of multiple parameters.
     */
    test('encode/decode more parameters', () => {
        const encoded = encodeAbiParameters(
            [functions[1].objectAbi.outputs[0]],
            [simpleParametersDataForFunction2]
        ).toString();

        expect(encoded).toBe(
            '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000e8fd586e022f825a109848832d7e552132bc332000000000000000000000000224626926a7a12225a60e127cec119c939db4a5cdbf2712e19af00dc4d376728f7cb06cc215c8e7c53b94cb47cefb4a26ada2a6c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000004977d68df97bb313b23238520580d8d3a59939bf0000000000000000000000007ad1d568b3fe5bad3fc264aca70bc7bcd5e4a6ff83b137cf7e30864b8a4e56453eb1f094b4434685d86895de38ac2edcf5d3f5340000000000000000000000000000000000000000000000000000000000000000'
        );

        const decoded = decodeAbiParameters(
            [functions[1].objectAbi.outputs[0]],
            encoded as `0x${string}`
        );
        expect(decoded).toStrictEqual([
            [
                {
                    active: false,
                    endorsor: '0x224626926A7A12225A60E127CEC119c939db4A5C',
                    identity:
                        '0xdbf2712e19af00dc4d376728f7cb06cc215c8e7c53b94cb47cefb4a26ada2a6c',
                    master: '0x0E8FD586E022F825A109848832D7E552132bC332'
                },
                {
                    active: false,
                    endorsor: '0x7Ad1D568B3fE5BAd3fC264AcA70Bc7Bcd5e4a6fF',
                    identity:
                        '0x83b137cf7e30864b8a4e56453eb1f094b4434685d86895de38ac2edcf5d3f534',
                    master: '0x4977d68df97bb313B23238520580D8D3a59939BF'
                }
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
            functions.forEach((fixtureFunction) => {
                [fixtureFunction.objectAbi].forEach((functionFormat) => {
                    const abiFunction = functionFormat as AbiFunction;

                    // Test signature hash
                    expect(toFunctionHash(abiFunction).slice(0, 10)).toBe(
                        fixtureFunction.signatureHash
                    );

                    // Test encoding and decoding each input
                    fixtureFunction.encodingTestsInputs.forEach(
                        (encodingInput) => {
                            const encoded = encodeFunctionData({
                                abi: [abiFunction],
                                functionName: abiFunction.name,
                                args: encodingInput
                            });

                            expect(encoded).toBeDefined();

                            // Decode input
                            const decoded = decodeFunctionData({
                                abi: [abiFunction],
                                data: encoded
                            });

                            // Encoded input will be equal to decoded input
                            expect(decoded.args).toStrictEqual(encodingInput);
                        }
                    );
                });
            });
        });

        /**
         * Test case for parameters encoding.
         */
        test('encode parameters', () => {
            const typesParam = parseAbiParameters('uint256, uint256');
            const params = encodeAbiParameters(typesParam, [123n, 234n]);

            // Assert that the encoded parameters match the expected value.
            expect(params).toBe(encodedParams);
        });

        /**
         * Test case for failed parameters encoding.
         */
        test('should throw an error for invalid encoding', () => {
            const typesParam = parseAbiParameters('uint256, address');

            // Expect the function to throw an error
            expect(() =>
                encodeAbiParameters(typesParam, [
                    123n,
                    '0x1567890123456789012345678901234567890' as `0x${string}`
                ])
            ).toThrowError();
        });

        /**
         * Invalid function - This test is no longer relevant with viem
         */
        test('Invalid function', () => {
            expect(() => {
                encodeFunctionData({
                    abi: [
                        {
                            type: 'function',
                            name: 'test',
                            inputs: []
                        }
                    ] as const,
                    functionName: 'nonexistent' as any,
                    args: []
                });
            }).toThrowError();
        });

        /**
         * Invalid decode and encode
         */
        test('Invalid decode and encode', () => {
            const abiFunction = functions[0].objectAbi as AbiFunction;

            // Encode with invalid data should throw
            expect(() =>
                encodeFunctionData({
                    abi: [abiFunction],
                    functionName: abiFunction.name,
                    args: [1, 2, 'INVALID']
                })
            ).toThrowError();

            // Decode with invalid hex should throw
            expect(() =>
                decodeFunctionData({
                    abi: [abiFunction],
                    data: 'INVALID' as `0x${string}`
                })
            ).toThrowError();
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
            events.forEach((fixtureEvent) => {
                [fixtureEvent.objectAbi].forEach((eventFormat) => {
                    const abiEvent = eventFormat as AbiEvent;

                    // Test signature hash
                    expect(toEventHash(abiEvent)).toBe(
                        fixtureEvent.signatureHash
                    );

                    // Test encoding and decoding each input
                    fixtureEvent.encodingTestsInputs.forEach(
                        (encodingInput) => {
                            // Encode event topics
                            const encodedTopics = encodeEventTopics({
                                abi: [abiEvent],
                                eventName: abiEvent.name!,
                                args: encodingInput as any
                            });

                            expect(encodedTopics).toBeDefined();

                            // Separate indexed and non-indexed parameters
                            const indexedInputs =
                                abiEvent.inputs?.filter(
                                    (input) => input.indexed
                                ) || [];
                            const nonIndexedInputs =
                                abiEvent.inputs?.filter(
                                    (input) => !input.indexed
                                ) || [];

                            // Prepare data field for non-indexed parameters
                            let data: `0x${string}` = '0x';
                            if (nonIndexedInputs.length > 0) {
                                // Map input values to their corresponding parameters
                                const nonIndexedValues: any[] = [];
                                abiEvent.inputs?.forEach((input, index) => {
                                    if (!input.indexed) {
                                        nonIndexedValues.push(
                                            encodingInput[index]
                                        );
                                    }
                                });

                                if (nonIndexedValues.length > 0) {
                                    data = encodeAbiParameters(
                                        nonIndexedInputs.map((input) => ({
                                            name: input.name,
                                            type: input.type
                                        })),
                                        nonIndexedValues
                                    );
                                }
                            }

                            // Create mock event log with proper topic types
                            const eventLog = {
                                data,
                                topics: encodedTopics.filter(
                                    (t) => t !== null
                                ) as [`0x${string}`, ...`0x${string}`[]]
                            };

                            // Decode event log
                            const decoded = decodeEventLog({
                                abi: [abiEvent],
                                ...eventLog
                            });

                            // Convert args to array for comparison
                            const decodedArray = Object.values(
                                decoded.args || {}
                            );
                            expect(decodedArray).toStrictEqual(encodingInput);
                        }
                    );
                });
            });
        });

        /**
         * Invalid decode and encode
         */
        test('Invalid decode and encode', () => {
            const abiEvent = events[0].objectAbi as AbiEvent;

            // Encode with invalid data - use a simpler test that will actually throw
            expect(() =>
                encodeEventTopics({
                    abi: [abiEvent],
                    eventName: 'nonExistentEvent' as any,
                    args: [] as any
                })
            ).toThrowError();

            // Decode with invalid data should throw
            expect(() =>
                decodeEventLog({
                    abi: [abiEvent],
                    data: 'INVALID' as `0x${string}`,
                    topics: ['INVALID_1', 'INVALID_2'] as any
                })
            ).toThrowError();
        });

        /**
         * Encode Event topics test cases
         */
        topicsEventTestCases.forEach(
            ({ event, valuesToEncode, expectedTopics }) => {
                test(`Encode Event topics - ${
                    typeof event === 'string'
                        ? event
                        : fastJsonStableStringify(event)
                }`, () => {
                    let topics;

                    if (typeof event === 'string') {
                        // For string signatures, use parseAbiItem to convert to proper ABI format
                        const abiEvent = parseAbiItem(event) as AbiEvent;

                        topics = encodeEventTopics({
                            abi: [abiEvent],
                            eventName: abiEvent.name!,
                            args: valuesToEncode as any
                        });
                    } else {
                        // For event objects, use them directly
                        const abiEvent = event as AbiEvent;

                        topics = encodeEventTopics({
                            abi: [abiEvent],
                            eventName: abiEvent.name!,
                            args: valuesToEncode as any
                        });
                    }

                    expect(topics).toStrictEqual(expectedTopics);
                });
            }
        );

        /**
         * Invalid Event topics test cases
         */

        test('Encode Event topics - Invalid address format', () => {
            const abiEvent = invalidTopicsEventTestCases[0].event as AbiEvent;

            expect(() =>
                encodeEventTopics({
                    abi: [abiEvent],
                    eventName: abiEvent.name!,
                    args: invalidTopicsEventTestCases[0].valuesToEncode as any
                })
            ).toThrowError();
        });

        test('Encode Event topics - Wrong event name', () => {
            const abiEvent = invalidTopicsEventTestCases[1].event as AbiEvent;

            expect(() =>
                encodeEventTopics({
                    abi: [abiEvent],
                    eventName: 'NonExistentEvent' as any,
                    args: invalidTopicsEventTestCases[1].valuesToEncode as any
                })
            ).toThrowError();
        });
    });
});
