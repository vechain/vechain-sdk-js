"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const viem_1 = require("viem");
const src_1 = require("../../../src");
const fixture_1 = require("./fixture");
/**
 * ABI tests - encode & decode
 * @group unit/encode-decode
 */
(0, globals_1.describe)('Abi - encode & decode', () => {
    /**
     * Test the encoding and decoding of a single parameter.
     */
    (0, globals_1.test)('encode / decode single parameter', () => {
        // Encode and Decode - NO Errors
        fixture_1.encodedDecodedValues.forEach((encodedDecodedValue) => {
            const encoded = src_1.ABI.of(encodedDecodedValue.type, [
                encodedDecodedValue.value
            ])
                .toHex()
                .toString();
            const decoded = src_1.ABI.ofEncoded(encodedDecodedValue.type, encodedDecodedValue.encoded).getFirstDecodedValue();
            (0, globals_1.expect)(encoded).toBe(encodedDecodedValue.encoded);
            // @NOTE: this is used to avoid JEST error: 'TypeError: Do not know how to serialize a BigInt'
            if (typeof decoded !== 'bigint') {
                (0, globals_1.expect)(decoded).toStrictEqual(encodedDecodedValue.value);
            }
            else {
                (0, globals_1.expect)(decoded).toBe(BigInt(encodedDecodedValue.value));
            }
        });
        // Encode and Decode - Errors
        fixture_1.encodedDecodedInvalidValues.forEach((encodedDecodedValue) => {
            (0, globals_1.expect)(() => src_1.ABI.of(encodedDecodedValue.type, encodedDecodedValue.value).toHex()).toThrowError(sdk_errors_1.InvalidAbiDataToEncodeOrDecode);
            (0, globals_1.expect)(() => src_1.ABI.ofEncoded(encodedDecodedValue.type, encodedDecodedValue.encoded)).toThrowError(sdk_errors_1.InvalidAbiDataToEncodeOrDecode);
        });
    });
    /**
     * Test encoding and decoding of multiple parameters.
     */
    (0, globals_1.test)('encode/decode more parameters', () => {
        // Example encode of function 2 parameters
        const encoded = src_1.ABI.of([fixture_1.functions[1].objectAbi.outputs[0]], [fixture_1.simpleParametersDataForFunction2])
            .toHex()
            .toString();
        // Example decode of function 2 parameters
        const decoded = src_1.ABI.ofEncoded([fixture_1.functions[1].objectAbi.outputs[0]], encoded).getFirstDecodedValue();
        (0, globals_1.expect)(encoded).toBe('0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000e8fd586e022f825a109848832d7e552132bc332000000000000000000000000224626926a7a12225a60e127cec119c939db4a5cdbf2712e19af00dc4d376728f7cb06cc215c8e7c53b94cb47cefb4a26ada2a6c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000004977d68df97bb313b23238520580d8d3a59939bf0000000000000000000000007ad1d568b3fe5bad3fc264aca70bc7bcd5e4a6ff83b137cf7e30864b8a4e56453eb1f094b4434685d86895de38ac2edcf5d3f5340000000000000000000000000000000000000000000000000000000000000000');
        (0, globals_1.expect)(decoded).toStrictEqual([
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
(0, globals_1.describe)('Abi - Function & Event', () => {
    /**
     * Functions
     */
    (0, globals_1.describe)('Functions', () => {
        /**
         * Encode and Decode.
         * Test with each function in each format.
         */
        (0, globals_1.test)('Encode AND Decode', () => {
            // Create a function from each format and compare between format (test if conversions are correct)
            fixture_1.functions
                .map((fixtureFunction) => {
                return [
                    {
                        format: fixtureFunction.full,
                        encodingTestsInputs: fixtureFunction.encodingTestsInputs,
                        signatureHash: fixtureFunction.signatureHash
                    },
                    {
                        format: fixtureFunction.minimal,
                        encodingTestsInputs: fixtureFunction.encodingTestsInputs,
                        signatureHash: fixtureFunction.signatureHash
                    },
                    {
                        format: fixtureFunction.objectAbi,
                        encodingTestsInputs: fixtureFunction.encodingTestsInputs,
                        signatureHash: fixtureFunction.signatureHash
                    },
                    {
                        format: JSON.parse(fixtureFunction.jsonStringifiedAbi),
                        encodingTestsInputs: fixtureFunction.encodingTestsInputs,
                        signatureHash: fixtureFunction.signatureHash
                    }
                ];
            })
                .forEach((functionMultiformat) => {
                // For each function format
                functionMultiformat.forEach((functionFormat) => {
                    // Create a function from the format without any problems
                    (0, globals_1.expect)(() => new src_1.ABIFunction(functionFormat.format)).not.toThrowError(sdk_errors_1.InvalidAbiItem);
                    // Create a function from the format without any problems
                    const myFunction = new src_1.ABIFunction(functionFormat.format);
                    // Expect to have a signature in each format
                    (0, globals_1.expect)(myFunction.format()).toBeDefined();
                    (0, globals_1.expect)(myFunction.format('json')).toBeDefined();
                    // Verify signature hash
                    (0, globals_1.expect)(myFunction.signatureHash).toBe(functionFormat.signatureHash);
                    // Encode each input
                    functionFormat.encodingTestsInputs.forEach((encodingInput) => {
                        // Encoded input from each format
                        const encoded = myFunction.encodeData(encodingInput);
                        (0, globals_1.expect)(encoded).toBeDefined();
                        // Decode input
                        const decoded = myFunction.decodeData(encoded);
                        // Encoded input will be equal to decoded input
                        const expected = decoded.args ?? [];
                        (0, globals_1.expect)(expected).toStrictEqual(encodingInput);
                    });
                });
            });
        });
        /**
         * Test case for parameters encoding.
         *
         * @test
         */
        (0, globals_1.test)('encode parameters', () => {
            /**
             * Parameters to be encoded using ABI.
             *
             * @type {string}
             */
            const typesParam = (0, viem_1.parseAbiParameters)(['uint256', 'uint256'].join(', '));
            const params = src_1.ABI.of([...typesParam], ['123', '234'])
                .toHex()
                .toString();
            // Assert that the encoded parameters match the expected value.
            (0, globals_1.expect)(params).toBe(fixture_1.encodedParams);
        });
        /**
         * Test case for failed parameters encoding.
         *
         * @test
         */
        (0, globals_1.test)('should throw an error for invalid encoding', () => {
            const abiTypes = ['uint256', 'address'];
            const values = ['123', '0x1567890123456789012345678901234567890']; // the address is invalid
            const typesParam = (0, viem_1.parseAbiParameters)(abiTypes.join(', '));
            // Expect the function to throw an error with the specific message
            (0, globals_1.expect)(() => src_1.ABI.of([...typesParam], values)
                .toHex()
                .toString()).toThrowError(sdk_errors_1.InvalidAbiDataToEncodeOrDecode);
        });
        /**
         * Invalid function
         */
        (0, globals_1.test)('Invalid function', () => {
            (0, globals_1.expect)(() => new src_1.ABIFunction('INVALID_VALUE')).toThrowError(sdk_errors_1.InvalidAbiItem);
        });
        /**
         * Invalid decode and encode
         */
        (0, globals_1.test)('Invalid decode and encode', () => {
            const myFunction = new src_1.ABIFunction(fixture_1.functions[0].full);
            // Encode
            (0, globals_1.expect)(() => myFunction.encodeData([1, 2, 'INVALID'])).toThrowError(sdk_errors_1.InvalidAbiDataToEncodeOrDecode);
            // Decode
            (0, globals_1.expect)(() => myFunction.decodeData(src_1.Hex.of('INVALID'))).toThrowError(sdk_errors_1.InvalidDataType);
        });
    });
    /**
     * Events
     */
    (0, globals_1.describe)('Events', () => {
        /**
         * Encode and Decode.
         * Test with each event in each format.
         */
        (0, globals_1.test)('Encode inputs AND Decode event log', () => {
            // Create an event from each format and compare between format (test if conversions are correct)
            fixture_1.events
                .map((fixtureEvent) => {
                return [
                    {
                        format: fixtureEvent.full,
                        encodingTestsInputs: fixtureEvent.encodingTestsInputs,
                        signatureHash: fixtureEvent.signatureHash
                    },
                    {
                        format: fixtureEvent.minimal,
                        encodingTestsInputs: fixtureEvent.encodingTestsInputs,
                        signatureHash: fixtureEvent.signatureHash
                    },
                    {
                        format: fixtureEvent.objectAbi,
                        encodingTestsInputs: fixtureEvent.encodingTestsInputs,
                        signatureHash: fixtureEvent.signatureHash
                    },
                    {
                        format: JSON.parse(fixtureEvent.jsonStringifiedAbi),
                        encodingTestsInputs: fixtureEvent.encodingTestsInputs,
                        signatureHash: fixtureEvent.signatureHash
                    }
                ];
            })
                .forEach((eventMultiformat) => {
                // For each event format
                eventMultiformat.forEach((eventFormat) => {
                    // Create an event from the format without any problems
                    (0, globals_1.expect)(() => new src_1.ABIEvent(eventFormat.format)).not.toThrowError();
                    // Create an event from the format without any problems
                    const myEvent = new src_1.ABIEvent(eventFormat.format);
                    // Expect to have a signature in each format
                    (0, globals_1.expect)(myEvent.format()).toBeDefined();
                    (0, globals_1.expect)(myEvent.format('json')).toBeDefined();
                    // Verify signature hash
                    (0, globals_1.expect)(myEvent.signatureHash).toBe(eventFormat.signatureHash);
                    // Encode each input
                    eventFormat.encodingTestsInputs.forEach((encodingInput) => {
                        // Encoded input from each format
                        const encoded = myEvent.encodeEventLog(encodingInput);
                        (0, globals_1.expect)(encoded).toBeDefined();
                        // // Decode output
                        const decoded = myEvent.decodeEventLogAsArray(encoded);
                        // Encoded input will be equal to decoded output
                        (0, globals_1.expect)(decoded).toStrictEqual(encodingInput);
                    });
                });
            });
        });
        /**
         * Invalid event
         */
        (0, globals_1.test)('Invalid event', () => {
            (0, globals_1.expect)(() => new src_1.ABIEvent('INVALID_VALUE')).toThrowError(sdk_errors_1.InvalidAbiItem);
        });
        /**
         * Invalid decode and encode
         */
        (0, globals_1.test)('Invalid decode and encode', () => {
            const myEvent = new src_1.ABIEvent(fixture_1.events[0].full);
            // Encode
            (0, globals_1.expect)(() => myEvent.encodeEventLog([1, 2, 'INVALID'])).toThrowError(sdk_errors_1.InvalidAbiDataToEncodeOrDecode);
            // Decode
            (0, globals_1.expect)(() => myEvent.decodeEventLog({
                data: src_1.Hex.of('INVALID'),
                topics: [src_1.Hex.of('INVALID_1'), src_1.Hex.of('INVALID_2')]
            })).toThrowError(sdk_errors_1.InvalidDataType);
        });
        /**
         * Encode Event topics test cases
         */
        fixture_1.topicsEventTestCases.forEach(({ event, valuesToEncode, expectedTopics }) => {
            (0, globals_1.test)(`Encode Event topics - ${typeof event === 'string' ? event : (0, sdk_errors_1.stringifyData)(event)}`, () => {
                const ev = typeof event === 'string'
                    ? new src_1.ABIEvent(event)
                    : new src_1.ABIEvent(event);
                const topics = ev.encodeFilterTopicsNoNull(valuesToEncode);
                (0, globals_1.expect)(topics).toStrictEqual(expectedTopics);
            });
        });
        /**
         * Invalid Event topics test cases
         */
        fixture_1.invalidTopicsEventTestCases.forEach(({ event, valuesToEncode, expectedError }) => {
            (0, globals_1.test)(`Encode Event topics - ${(0, sdk_errors_1.stringifyData)(event)}`, () => {
                const ev = typeof event === 'string'
                    ? new src_1.ABIEvent(event)
                    : new src_1.ABIEvent(event);
                (0, globals_1.expect)(() => ev.encodeFilterTopics(valuesToEncode)).toThrowError(expectedError);
            });
        });
    });
});
