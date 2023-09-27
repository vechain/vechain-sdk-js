import { describe, expect, it } from '@jest/globals';
import { RLP } from '../src/encoding/rlp';
import { type Input as RLPInput } from 'rlp';

describe('RLP', () => {
    describe('encode', () => {
        it('should encode an array correctly', () => {
            const dataToEncode = [1, 2, 3, [4, 5]];
            const encodedData = RLP.encode(dataToEncode);
            const expectedHex = 'c6010203c20405'; // The expected hexadecimal encoding

            // Assert that the encoded data matches the expected value
            expect(encodedData.toString('hex')).toEqual(expectedHex);
        });

        it('should encode a single value correctly', () => {
            const dataToEncode = 42;
            const encodedData = RLP.encode(dataToEncode);
            const expectedHex = '2a'; // The expected hexadecimal encoding

            // Assert that the encoded data matches the expected value
            expect(encodedData.toString('hex')).toEqual(expectedHex);
        });

        it('should encode an empty array correctly', () => {
            const dataToEncode: RLPInput = [];
            const encodedData = RLP.encode(dataToEncode);
            const expectedHex = 'c0'; // The expected hexadecimal encoding

            // Assert that the encoded data matches the expected value
            expect(encodedData.toString('hex')).toEqual(expectedHex);
        });
    });

    describe('decode', () => {
        it('should decode an encoded single value correctly', () => {
            const encodedHex = '2a';
            const encodedData = Buffer.from(encodedHex, 'hex');
            const decodedData = RLP.decode(encodedData);

            // Adjust the expected decoded data to match the received Buffer
            const expectedDecodedData = Buffer.from([42]);

            // Assert that the decoded data matches the expected value
            expect(decodedData).toEqual(expectedDecodedData);
        });

        it('should decode an empty encoded array correctly', () => {
            const encodedHex = 'c0';
            const encodedData = Buffer.from(encodedHex, 'hex');
            const decodedData = RLP.decode(encodedData);
            const expectedDecodedData: RLPInput = []; // The expected decoded data

            // Assert that the decoded data matches the expected value
            expect(decodedData).toEqual(expectedDecodedData);
        });
    });
});
