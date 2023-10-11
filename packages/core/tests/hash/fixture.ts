import { blake2b256, keccak256, sha256 } from '../../src';

/**
 * Hash functions to test
 */
const hashFunctionsToTest = [
    {
        hashFunction: keccak256,
        results: {
            HELLO_WORLD_HASH_VALUE:
                '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad',
            ZERO_BUFFER_HASH_VALUE:
                '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
        }
    },
    {
        hashFunction: blake2b256,
        results: {
            HELLO_WORLD_HASH_VALUE:
                '0x256c83b297114d201b30179f3f0ef0cace9783622da5974326b436178aeef610',
            ZERO_BUFFER_HASH_VALUE:
                '0x0e5751c026e543b2e8ab2eb06099daa1d1e5df47778f7787faab45cdf12fe3a8'
        }
    },
    {
        hashFunction: sha256,
        results: {
            HELLO_WORLD_HASH_VALUE:
                '0xb94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
            ZERO_BUFFER_HASH_VALUE:
                '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        }
    }
];

export { hashFunctionsToTest };
