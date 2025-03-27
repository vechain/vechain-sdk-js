import { keccak_256 as nh_keccak_256 } from '@noble/hashes/sha3';
import { Hex } from '../Hex';
import { HexUInt } from '../HexUInt';
import { IllegalArgumentError } from '../../errors';

/**
 * Full Qualified Path
 */
const FQP = 'packages/core/src/vcdm/hash/Keccak256.ts!';

/**
 * Represents the result of an [SHA-3](https://en.wikipedia.org/wiki/SHA-3) [KECCAK 256](https://keccak.team/keccak.html) hash operation.
 *
 * @extends HexUInt
 */
class Keccak256 extends HexUInt {
    /**
     * Generates the [SHA-3](https://en.wikipedia.org/wiki/SHA-3) [KECCAK 256](https://keccak.team/keccak.html) hash of the given input.
     *
     * @param {bigint | number | string | Uint8Array | Hex} exp - The input value to hash.
     *
     * @returns {Sha256} - The [KECCAK 256](https://keccak.team/keccak.html) hash of the input value.
     *
     * @throws {IllegalArgumentError} - If a hash error occurs.
     *
     * @remarks Security audit method, depends on
     * * [`nh_keccak_256`](https://github.com/paulmillr/noble-hashes#sha3-fips-shake-keccak).
     */
    public static of(
        exp: bigint | number | string | Uint8Array | Hex
    ): Keccak256 {
        try {
            const hash = nh_keccak_256(HexUInt.of(exp).bytes);
            return new Keccak256(Hex.POSITIVE, HexUInt.of(hash).digits);
        } catch (e) {
            throw new IllegalArgumentError(
                `${FQP}Keccak256.of(exp: bigint | number | string | Uint8Array | Hex): Keccak256`,
                'hash error',
                {
                    exp: `${exp}`, // Needed to serialize bigint values.
                    e
                }
            );
        }
    }
}

export { Keccak256 };
