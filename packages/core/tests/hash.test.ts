import { describe, expect, test } from '@jest/globals'
import { keccak256 } from '../src/hash/keccak256'
import { ethers } from 'ethers'
import { blake2b256 } from '../src/hash/blake2b256'

/**
 * Hash functions to test
 */
const HASH_FUNCTIONS = [
  {
    hashFunction: keccak256,
    results: {
      HELLO_WORLD_HASH_VALUE: '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad',
      ZERO_BUFFER_HASH_VALUE: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
    }
  },
  {
    hashFunction: blake2b256,
    results: {
      HELLO_WORLD_HASH_VALUE: '0x256c83b297114d201b30179f3f0ef0cace9783622da5974326b436178aeef610',
      ZERO_BUFFER_HASH_VALUE: '0x0e5751c026e543b2e8ab2eb06099daa1d1e5df47778f7787faab45cdf12fe3a8'
    }
  }
]

describe('Hash', () => {
  /**
     * Test each hash function
     */
  HASH_FUNCTIONS.map(hashFunction => {
    describe(`Function ${hashFunction.hashFunction.name}`, () => {
      // Correctness of hash function
      test('Hash is correct', () => {
        // Hello world hash
        expect(hashFunction.hashFunction('hello world')).toBe(hashFunction.results.HELLO_WORLD_HASH_VALUE)

        // Zero bytes hash
        expect(hashFunction.hashFunction(Buffer.alloc(0))).toBe(hashFunction.results.ZERO_BUFFER_HASH_VALUE)
      })

      // Different ways of giving input data take the same hash
      test('Hash is the same for different input formats', () => {
        // Different ways of giving input data take the same hash
        const hashes = [
          hashFunction.hashFunction('hello world'),
          hashFunction.hashFunction(Buffer.from('hello world')),
          hashFunction.hashFunction(ethers.toUtf8Bytes('hello world')),
          hashFunction.hashFunction(ethers.toUtf8Bytes(['hello', ' world'].join(''))),
          hashFunction.hashFunction(Buffer.from('hello world', 'utf8'))
        ]

        // All hashes are the same
        for (let i = 0; i < hashes.length; ++i) {
          for (let j = i + 1; j < hashes.length; ++j) { if (i != j) expect(hashes[i]).toBe(hashes[j]) }
        }
      })

      // Input data is not valid
      test('Input data is not valid', () => {

      })
    })
  })
})
