import { blake2b as nh_blake2b } from '@noble/hashes/blake2b';
import { Hex } from '../Hex';
import { HexUInt } from '../HexUInt';
import { IllegalArgumentError } from '@errors';

/**
 * Full Qualified Path
 */
const FQP = 'packages/sdk/src/vcdm/hash/Blake2b256.ts!';

/**
 * Represents the result of an [BLAKE](https://en.wikipedia.org/wiki/BLAKE_(hash_function)) [BlAKE2B 256](https://www.blake2.net/) hash operation.
 *
 * @extends HexUInt
 */
class Blake2b256 extends HexUInt {
    /**
     * Generates the [BLAKE](https://en.wikipedia.org/wiki/BLAKE_(hash_function)) [BLAKE2B 256](https://www.blake2.net/) hash of the given input.
     *
     * @param {bigint | number | string | Uint8Array | Hex} exp - The input value to hash.
     *
     * @returns {Sha256} - The [BLAKE2B 256](https://www.blake2.net/) hash of the input value.
     *
     * @throws {IllegalArgumentError} - If a hash error occurs.
     *
     * @remarks Security auditable method, depends on
     * * [`nh_blake2b.create(...).update(...).digest(...)`](https://github.com/paulmillr/noble-hashes#sha3-fips-shake-keccak).
     */
    public static of(
        exp: bigint | number | string | Uint8Array | Hex
    ): Blake2b256 {
        try {
            const hash = nh_blake2b
                .create({ dkLen: 32 })
                .update(HexUInt.of(exp).bytes)
                .digest();
            return new Blake2b256(Hex.POSITIVE, HexUInt.of(hash).digits);
        } catch (e) {
            throw new IllegalArgumentError(
                `${FQP}Blake2b256.of(exp: bigint | number | string | Uint8Array | Hex): Blake2b256`,
                'hash error',
                {
                    exp: `${exp}`, // Needed to serialize bigint values.
                    e
                }
            );
        }
    }
}

export { Blake2b256 };
