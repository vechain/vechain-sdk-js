import { describe, expect, test } from '@jest/globals';
import { RLP, type RLPInput } from '../../src';

/**
 * RLP tests
 */
describe('RLP', () => {
    /**
     * Encoding tests
     */
    describe('encode', () => {
        /**
         * Array encoding tests
         */
        test('Should encode an array correctly', () => {
            const dataToEncode = [1, 2, 3, [4, 5]];
            const encodedData = RLP.encode(dataToEncode);
            const expectedHex = 'c6010203c20405'; // The expected hexadecimal encoding

            // Assert that the encoded data matches the expected value
            expect(encodedData.toString('hex')).toEqual(expectedHex);
        });

        /**
         * Single value encoding tests
         */
        test('Should encode a single value correctly', () => {
            const dataToEncode = 42;
            const encodedData = RLP.encode(dataToEncode);
            const expectedHex = '2a'; // The expected hexadecimal encoding

            // Assert that the encoded data matches the expected value
            expect(encodedData.toString('hex')).toEqual(expectedHex);
        });

        /**
         * Empty array encoding tests
         */
        test('Should encode an empty array correctly', () => {
            const dataToEncode: RLPInput = [];
            const encodedData = RLP.encode(dataToEncode);
            const expectedHex = 'c0'; // The expected hexadecimal encoding

            // Assert that the encoded data matches the expected value
            expect(encodedData.toString('hex')).toEqual(expectedHex);
        });
    });

    /**
     * Decoding tests
     */
    describe('decode', () => {
        /**
         * Array decoding tests
         */
        test('Should decode an encoded single value correctly', () => {
            const encodedHex = '2a';
            const encodedData = Buffer.from(encodedHex, 'hex');
            const decodedData = RLP.decode(encodedData);

            // Adjust the expected decoded data to match the received Buffer
            const expectedDecodedData = Buffer.from([42]);

            // Assert that the decoded data matches the expected value
            expect(decodedData).toEqual(expectedDecodedData);
        });

        /**
         * Empty array decoding tests
         */
        test('Should decode an empty encoded array correctly', () => {
            const encodedHex = 'c0';
            const encodedData = Buffer.from(encodedHex, 'hex');
            const decodedData = RLP.decode(encodedData);
            const expectedDecodedData: RLPInput = []; // The expected decoded data

            // Assert that the decoded data matches the expected value
            expect(decodedData).toEqual(expectedDecodedData);
        });
    });
});
