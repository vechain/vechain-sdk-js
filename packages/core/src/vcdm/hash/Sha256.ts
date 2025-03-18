import * as nh_sha256 from '@noble/hashes/sha256';
import { Hex } from '../Hex';
import { HexUInt } from '../HexUInt';
import { IllegalArgumentError } from '../../errors';

/**
 * Full Qualified Path
 */
const FQP = 'packages/core/src/vcdm/hash/Sha256.ts!';

/**
 * Represents the result of an [SHA256](https://en.wikipedia.org/wiki/SHA-2) hash operation.
 *
 * @extends HexUInt
 * @implements Hash
 */
class Sha256 extends HexUInt {
    /**
     * Generates the [SHA 256](https://en.wikipedia.org/wiki/SHA-2) hash of the given input.
     *
     * @param {bigint | number | string | Uint8Array | Hex} exp - The input value to hash.
     *
     * @returns {Sha256} - The [SHA256](https://en.wikipedia.org/wiki/SHA-2) hash of the input value.
     *
     * @throws {IllegalArgumentError} - If a hash error occurs.
     *
     * @remarks Security auditable method, depends on
     * * [`nh_sha256.sha256`](https://github.com/paulmillr/noble-hashes#sha2-sha256-sha384-sha512-and-others).
     */
    public static of(exp: bigint | number | string | Uint8Array): Sha256 {
        try {
            const hash = nh_sha256.sha256(HexUInt.of(exp).bytes);
            return new Sha256(Hex.POSITIVE, HexUInt.of(hash).digits);
        } catch (e) {
            throw new IllegalArgumentError(
                `${FQP}Sha256.of(exp: bigint | number | string | Uint8Array): Sha256`,
                'hash error',
                {
                    exp: `${exp}`, // Needed to serialize bigint values.
                    e
                }
            );
        }
    }
}

export { Sha256 };
