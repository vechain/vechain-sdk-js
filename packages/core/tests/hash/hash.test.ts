import { describe, expect, test } from '@jest/globals';
import { hashFunctionsToTest } from './fixture';
import { ZERO_BUFFER } from '../../src';
import { ethers } from 'ethers';

/**
 * Test hash functions
 * @group unit/hash
 */
describe('Hash', () => {
    /**
     * Test each hash function
     */
    hashFunctionsToTest.forEach((hashFunction) => {
        describe(`Function ${hashFunction.hashFunction.name}`, () => {
            // Correctness of hash function
            test('Hash is correct', () => {
                // Hello world hash
                expect(hashFunction.hashFunction('hello world')).toBe(
                    hashFunction.results.HELLO_WORLD_HASH_VALUE
                );

                // Zero bytes hash
                expect(hashFunction.hashFunction(ZERO_BUFFER(0))).toBe(
                    hashFunction.results.ZERO_BUFFER_HASH_VALUE
                );
            });

            // Different ways of giving input data take the same hash
            test('Hash is the same for different input formats', () => {
                // Different ways of giving input data take the same hash
                const hashes = [
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

                // All hashes are the same
                for (let i = 0; i < hashes.length; ++i) {
                    for (let j = i + 1; j < hashes.length; ++j) {
                        if (i !== j) expect(hashes[i]).toBe(hashes[j]);
                    }
                }
            });
        });
    });
});
