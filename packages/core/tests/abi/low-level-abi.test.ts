import { describe, expect, test } from '@jest/globals';
import { abi } from '../../src/abi';
import { ParamType, type ethers } from 'ethers';
import {
    encodedDecodedInvalidValues,
    encodedDecodedValues,
    functions,
    simpleParametersDataForFunction2
} from './fixture';
import { ERRORS } from '../../src';

/**
 * Tests for low-level ABI functions.
 */
describe('Abi - Low level', () => {
    /**
     * Test the encoding and decoding of a single parameter.
     */
    test('encode / decode single parameter', () => {
        // Encode and Decode - NO Errors
        encodedDecodedValues.forEach((encodedDecodedValue) => {
            const encoded = abi.lowLevel.encode<string | string[]>(
                encodedDecodedValue.type,
                encodedDecodedValue.value
            );

            const decoded = abi.lowLevel.decode<bigint | string | object>(
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
                abi.lowLevel.encode(
                    encodedDecodedValue.type,
                    encodedDecodedValue.value
                )
            ).toThrowError(ERRORS.ABI.LOW_LEVEL.INVALID_DATA_TO_ENCODE);

            expect(() =>
                abi.lowLevel.decode(
                    encodedDecodedValue.type,
                    encodedDecodedValue.encoded
                )
            ).toThrow(ERRORS.ABI.LOW_LEVEL.INVALID_DATA_TO_DECODE);
        });
    });

    /**
     * Test encoding and decoding of multiple parameters.
     */
    test('encode/decode more parameters', () => {
        // Example encode of function 2 parameters
        const encoded = abi.lowLevel.encode<
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
        // const encoded = abi.lowLevel.encode(
        //     ParamType.from(functions[1].objectAbi.outputs[0]),
        //     simpleParametersDataForFunction2
        // );

        // Example decode of function 2 parameters
        const decoded = abi.lowLevel.decode<ethers.Result[][]>(
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
