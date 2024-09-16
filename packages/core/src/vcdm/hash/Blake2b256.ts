import { blake2b as nh_blake2b } from '@noble/hashes/blake2b';
import { InvalidOperation } from '@vechain/sdk-errors';
import { Hex, Txt, type Hash } from '../index';
import { HexUInt } from '../HexUInt';

/**
 * Represents the result of an [BLAKE](https://en.wikipedia.org/wiki/BLAKE_(hash_function)) [BlAKE2B 256](https://www.blake2.net/) hash operation.
 *
 * @extends HexUInt
 * @implements Hash
 */
class Blake2b256 extends HexUInt implements Hash {
    /**
     * Generates the [BLAKE](https://en.wikipedia.org/wiki/BLAKE_(hash_function)) [BLAKE2B 256](https://www.blake2.net/) hash of the given input.
     *
     * @param {bigint | number | string | Uint8Array | Hex} exp - The input value to hash.
     *
     * @returns {Sha256} - The [BLAKE2B 256](https://www.blake2.net/) hash of the input value.
     *
     * @throws {InvalidOperation} - If a hash error occurs.
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
            throw new InvalidOperation('Blake2b256.of', 'hash error', {
                exp: `${exp}`, // Needed to serialize bigint values.
                e
            });
        }
    }
}

// Backwards compatibility, remove in future release #1184

function blake2b256(
    data: string | Uint8Array,
    returnType: 'buffer'
): Uint8Array;

function blake2b256(data: string | Uint8Array, returnType: 'hex'): string;

function blake2b256(
    data: string | Uint8Array,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    returnType: 'buffer' | 'hex' = 'buffer'
): string | Uint8Array {
    return returnType === 'buffer'
        ? Blake2b256.of(Txt.of(data).bytes).bytes
        : Blake2b256.of(Txt.of(data).bytes).toString();
}

export { Blake2b256, blake2b256 };
