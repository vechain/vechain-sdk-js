import { blake2b256, keccak256, sha256 } from '../../src';

/**
 * Hash functions to test
 */
const hashFunctionsToTest = [
    {
        hashFunction: keccak256,
        results: {
            HELLO_WORLD_HASH_VALUE_HEX:
                '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad',
            HELLO_WORLD_HASH_VALUE_BUFFER: Buffer.from(
                '47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad',
                'hex'
            ),
            ZERO_BUFFER_HASH_VALUE_HEX:
                '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
            ZERO_BUFFER_HASH_VALUE_BUFFER: Buffer.from(
                'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
                'hex'
            )
        }
    },
    {
        hashFunction: blake2b256,
        results: {
            HELLO_WORLD_HASH_VALUE_HEX:
                '0x256c83b297114d201b30179f3f0ef0cace9783622da5974326b436178aeef610',
            HELLO_WORLD_HASH_VALUE_BUFFER: Buffer.from(
                '256c83b297114d201b30179f3f0ef0cace9783622da5974326b436178aeef610',
                'hex'
            ),
            ZERO_BUFFER_HASH_VALUE_HEX:
                '0x0e5751c026e543b2e8ab2eb06099daa1d1e5df47778f7787faab45cdf12fe3a8',
            ZERO_BUFFER_HASH_VALUE_BUFFER: Buffer.from(
                '0e5751c026e543b2e8ab2eb06099daa1d1e5df47778f7787faab45cdf12fe3a8',
                'hex'
            )
        }
    },
    {
        hashFunction: sha256,
        results: {
            HELLO_WORLD_HASH_VALUE_HEX:
                '0xb94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
            HELLO_WORLD_HASH_VALUE_BUFFER: Buffer.from(
                'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
                'hex'
            ),
            ZERO_BUFFER_HASH_VALUE_HEX:
                '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            ZERO_BUFFER_HASH_VALUE_BUFFER: Buffer.from(
                'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                'hex'
            )
        }
    }
];

export { hashFunctionsToTest };
