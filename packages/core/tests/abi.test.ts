import { describe, expect, test } from '@jest/globals';
import { abi } from '../src/abi';
import { address } from '../src';

/**
 * Encode and decode parameter values
 */
const encodedDecodedValues = [
    {
        type: 'uint256',
        value: '2345675643',
        encoded:
            '0x000000000000000000000000000000000000000000000000000000008bd02b7b'
    },
    {
        type: 'bytes32',
        value: '0xdf32340000000000000000000000000000000000000000000000000000000000',
        encoded:
            '0xdf32340000000000000000000000000000000000000000000000000000000000'
    },
    {
        type: 'bytes',
        value: '0xdf3234',
        encoded:
            '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003df32340000000000000000000000000000000000000000000000000000000000'
    },
    {
        type: 'bytes32[]',
        value: [
            '0xdf32340000000000000000000000000000000000000000000000000000000000',
            '0xfdfd000000000000000000000000000000000000000000000000000000000000'
        ],
        encoded:
            '0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000002df32340000000000000000000000000000000000000000000000000000000000fdfd000000000000000000000000000000000000000000000000000000000000'
    },
    {
        type: 'string',
        value: 'Hello!%!',
        encoded:
            '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000'
    },
    {
        type: 'uint256',
        value: '16',
        encoded:
            '0x0000000000000000000000000000000000000000000000000000000000000010'
    }
];

/**
 * Encode and decode parameter values - Errors
 */
const encodedDecodedValuesErrors = [
    {
        type: 'INVALID_TYPE',
        value: 'INVALID_VALUE',
        encoded: 'INVALID_ENCODED_VALUE'
    },
    {
        type: 'uint256',
        value: 'INVALID_VALUE',
        encoded: 'INVALID_ENCODED_VALUE'
    },
    {
        type: 'INVALID_TYPE',
        value: '12',
        encoded: 'INVALID_ENCODED_VALUE'
    }
];

/**
 * Simple function to test encode/decode parameters
 *
 * -> 'function nodes() returns (tuple(address master, address endorsor, bytes32 identity, bool active)[] list)'
 */
const simpleFunction = {
    inputs: [],
    name: 'nodes',
    payable: false,
    outputs: [
        {
            components: [
                {
                    internalType: 'address',
                    name: 'master',
                    type: 'address'
                },
                {
                    internalType: 'address',
                    name: 'endorsor',
                    type: 'address'
                },
                {
                    internalType: 'bytes32',
                    name: 'identity',
                    type: 'bytes32'
                },
                {
                    internalType: 'bool',
                    name: 'active',
                    type: 'bool'
                }
            ],
            internalType: 'struct AuthorityUtils.Candidate[]',
            name: 'list',
            type: 'tuple[]'
        }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
};

/**
 * Type of the simple function parameters
 */
interface SimpleFunctionParametersType {
    master: string;
    endorsor: string;
    identity: string;
    active: boolean;
}

/**
 * Simple function parameters
 */
const simpleFunctionParametersData: SimpleFunctionParametersType[] = [
    {
        master: address.toChecksumed(
            '0x0e8fd586e022f825a109848832d7e552132bc332'
        ),
        endorsor: address.toChecksumed(
            '0x224626926a7a12225a60e127cec119c939db4a5c'
        ),
        identity:
            '0xdbf2712e19af00dc4d376728f7cb06cc215c8e7c53b94cb47cefb4a26ada2a6c',
        active: false
    },
    {
        master: address.toChecksumed(
            '0x4977d68df97bb313b23238520580d8d3a59939bf'
        ),
        endorsor: address.toChecksumed(
            '0x7ad1d568b3fe5bad3fc264aca70bc7bcd5e4a6ff'
        ),
        identity:
            '0x83b137cf7e30864b8a4e56453eb1f094b4434685d86895de38ac2edcf5d3f534',
        active: false
    }
];

/**
 * ABI tests
 */
describe('abi', () => {
    /**
     * Encode and Decode parameter
     */
    test('encode/decode parameter', () => {
        // Encode and Decode - NO Errors
        encodedDecodedValues.forEach((encodedDecodedValue) => {
            const encoded = abi.lowLevel.encodeParameter<string | string[]>(
                encodedDecodedValue.type,
                encodedDecodedValue.value
            );

            const decoded = abi.lowLevel.decodeParameter<
                string[] | string | bigint
            >(encodedDecodedValue.type, encodedDecodedValue.encoded);

            expect(encoded).toBe(encodedDecodedValue.encoded);

            // Avoid JEST error: 'TypeError: Do not know how to serialize a BigInt'
            if (typeof decoded !== 'bigint')
                expect(decoded).toStrictEqual(encodedDecodedValue.value);
            else
                expect(decoded).toBe(
                    BigInt(encodedDecodedValue.value as string)
                );
        });

        // Encode and Decode - Errors
        encodedDecodedValuesErrors.forEach((encodedDecodedValue) => {
            expect(() =>
                abi.lowLevel.encodeParameter(
                    encodedDecodedValue.type,
                    encodedDecodedValue.value
                )
            ).toThrow();

            expect(() =>
                abi.lowLevel.decodeParameter(
                    encodedDecodedValue.type,
                    encodedDecodedValue.encoded
                )
            ).toThrow();
        });
    });

    /**
     * Encode and Decode parameters
     */
    test('encode/decode parameters', () => {
        const encoded = abi.lowLevel.encodeParameters<
            SimpleFunctionParametersType[]
        >(simpleFunction.outputs, [simpleFunctionParametersData]);

        const decoded = abi.lowLevel.decodeParameters<
            Record<string, SimpleFunctionParametersType[]>
        >(simpleFunction.outputs, encoded);

        expect(encoded).toBe(
            '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000e8fd586e022f825a109848832d7e552132bc332000000000000000000000000224626926a7a12225a60e127cec119c939db4a5cdbf2712e19af00dc4d376728f7cb06cc215c8e7c53b94cb47cefb4a26ada2a6c00000000000000000000000000000000000000000000000000000000000000000000000000000000000000004977d68df97bb313b23238520580d8d3a59939bf0000000000000000000000007ad1d568b3fe5bad3fc264aca70bc7bcd5e4a6ff83b137cf7e30864b8a4e56453eb1f094b4434685d86895de38ac2edcf5d3f5340000000000000000000000000000000000000000000000000000000000000000'
        );

        expect(decoded).toHaveProperty('list');
        expect(decoded.list.length).toBe(simpleFunctionParametersData.length);
    });

    /**
     * Format of function conversions
     */
    test('Format conversions', () => {
        // JSON to human readable
        expect(
            abi.lowLevel.jsonToHumanReadable([simpleFunction], false)
        ).toStrictEqual([
            'function nodes() returns (tuple(address master, address endorsor, bytes32 identity, bool active)[] list)'
        ]);
        expect(
            abi.lowLevel.jsonToHumanReadable([simpleFunction], true)
        ).toStrictEqual([
            'function nodes() returns (tuple(address,address,bytes32,bool)[])'
        ]);

        // Human readable to JSON
        // ...
    });
});
