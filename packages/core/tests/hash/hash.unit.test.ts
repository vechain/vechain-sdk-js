import { Buffer } from 'buffer';
import { InvalidDataReturnTypeError } from '@vechain/sdk-errors';
import { ZERO_BYTES } from '../../src';
import { bytesToHex } from '@noble/ciphers/utils';
import { cert } from '../certificate/fixture';
import { describe, expect, test } from '@jest/globals';
import { ethers } from 'ethers';
import { hashFunctionsToTest } from './fixture';
import { txt } from '../../src/utils/txt/txt';

/**
 * Test hash functions
 * @group unit/hash
 */
describe('Hash', () => {
    test('thordevkit', () => {
        const json = JSON.stringify(cert);
        console.log(json);
        // const blake_dev_dir = ThorDevKit.blake2b256(json);
        // console.log('dir', blake_dev_dir);
        const buffer = Buffer.from(json, `utf8`);
        console.log(bytesToHex(buffer));
        // const textEncoder = new TextEncoder();
        // form: "NFC" | "NFD" | "NFKC" | "NFKD"): string
        const array = txt.encode(json);
        console.log(bytesToHex(array));
        // const blake_dev_ind = ThorDevKit.blake2b256(buffer);
        // console.log('ind', blake_dev_ind);
        // const blake_sdk = blake2b256(buffer);
        // console.log('sdk', blake_sdk);
    });

    /**
     * Test each hash function
     */
    hashFunctionsToTest.forEach((hashFunction) => {
        describe(`Function ${hashFunction.hashFunction.name}`, () => {
            // Correctness of hash function
            test('Hash as hex is correct', () => {
                // Hello world hash
                expect(hashFunction.hashFunction('hello world', 'hex')).toBe(
                    hashFunction.results.HELLO_WORLD_HASH_VALUE_HEX
                );

                // Zero bytes hash
                expect(hashFunction.hashFunction(ZERO_BYTES(0), 'hex')).toBe(
                    hashFunction.results.ZERO_BUFFER_HASH_VALUE_HEX
                );
            });

            test('Hash as buffer is correct', () => {
                // Hello world hash
                expect(
                    hashFunction.hashFunction('hello world', 'buffer')
                ).toStrictEqual(
                    hashFunction.results.HELLO_WORLD_HASH_VALUE_BUFFER
                );

                expect(hashFunction.hashFunction('hello world')).toStrictEqual(
                    hashFunction.results.HELLO_WORLD_HASH_VALUE_BUFFER
                );

                // Zero bytes hash
                expect(
                    hashFunction.hashFunction(ZERO_BYTES(0), 'buffer')
                ).toStrictEqual(
                    hashFunction.results.ZERO_BUFFER_HASH_VALUE_BUFFER
                );

                expect(hashFunction.hashFunction(ZERO_BYTES(0))).toStrictEqual(
                    hashFunction.results.ZERO_BUFFER_HASH_VALUE_BUFFER
                );
            });

            // Different ways of giving input data take the same hash
            test('Hash is the same for different input formats', () => {
                // Different ways of giving input data take the same hash
                const hashesToHex = [
                    hashFunction.hashFunction('hello world', 'hex'),
                    hashFunction.hashFunction(
                        Buffer.from('hello world'),
                        'hex'
                    ),
                    hashFunction.hashFunction(
                        ethers.toUtf8Bytes('hello world'),
                        'hex'
                    ),
                    hashFunction.hashFunction(
                        ethers.toUtf8Bytes(['hello', ' world'].join('')),
                        'hex'
                    ),
                    hashFunction.hashFunction(
                        Buffer.from('hello world', 'utf8'),
                        'hex'
                    )
                ];

                const hashesToBufferWithDefaultedParameter = [
                    hashFunction.hashFunction('hello world'),
                    hashFunction.hashFunction(Buffer.from('hello world')),
                    hashFunction.hashFunction(
                        ethers.toUtf8Bytes('hello world')
                    ),
                    hashFunction.hashFunction(
                        ethers.toUtf8Bytes(['hello', ' world'].join(''))
                    ),
                    hashFunction.hashFunction(
                        Buffer.from('hello world', 'utf8')
                    )
                ];

                const hashesToBuffer = [
                    hashFunction.hashFunction('hello world', 'buffer'),
                    hashFunction.hashFunction(
                        Buffer.from('hello world'),
                        'buffer'
                    ),
                    hashFunction.hashFunction(
                        ethers.toUtf8Bytes('hello world'),
                        'buffer'
                    ),
                    hashFunction.hashFunction(
                        ethers.toUtf8Bytes(['hello', ' world'].join('')),
                        'buffer'
                    ),
                    hashFunction.hashFunction(
                        Buffer.from('hello world', 'utf8'),
                        'buffer'
                    )
                ];

                // All hashes are the same
                for (let i = 0; i < hashesToHex.length; ++i) {
                    for (let j = i + 1; j < hashesToHex.length; ++j) {
                        if (i !== j) {
                            expect(hashesToHex[i]).toStrictEqual(
                                hashesToHex[j]
                            );
                            expect(
                                hashesToBufferWithDefaultedParameter[i]
                            ).toStrictEqual(
                                hashesToBufferWithDefaultedParameter[j]
                            );
                            expect(hashesToBuffer[i]).toStrictEqual(
                                hashesToBuffer[j]
                            );
                            expect(hashesToBuffer[i]).toStrictEqual(
                                hashesToBufferWithDefaultedParameter[j]
                            );
                        }
                    }
                }
            });

            test('Invalid return type throws an error', () => {
                expect(() =>
                    // @ts-expect-error: Invalid return type
                    hashFunction.hashFunction('hello world', 'foo')
                ).toThrowError(InvalidDataReturnTypeError);
            });
        });
    });
});
