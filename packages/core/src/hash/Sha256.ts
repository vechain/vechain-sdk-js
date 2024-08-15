import * as nh_sha256 from '@noble/hashes/sha256';
import { Hex, HexUInt, type Hash } from '../vcdm';
import { InvalidOperation } from '@vechain/sdk-errors';

/**
 * Represents the result of an [SHA256](https://en.wikipedia.org/wiki/SHA-2) hash operation.
 *
 * @extends HexUInt
 * @implements Hash
 */
class Sha256 extends HexUInt implements Hash {
    /**
     * Generates the [SHA 256](https://en.wikipedia.org/wiki/SHA-2) hash of the given input.
     *
     * @param {bigint | number | string | Uint8Array | Hex} exp - The input value to hash.
     *
     * @returns {Sha256} - The [SHA256](https://en.wikipedia.org/wiki/SHA-2) hash of the input value.
     *
     * @throws {InvalidOperation} - If a hash error occurs.
     *
     * @remark Security auditable method, depends on
     * * [`nh_sha256.sha256`](https://github.com/paulmillr/noble-hashes#sha2-sha256-sha384-sha512-and-others).
     */
    public static of(exp: bigint | number | string | Uint8Array): Sha256 {
        try {
            const hash = nh_sha256.sha256(HexUInt.of(exp).bytes);
            return new Sha256(Hex.POSITIVE, HexUInt.of(hash).digits);
        } catch (e) {
            throw new InvalidOperation('Sha256.of', 'hash error', {
                exp: `${exp}`, // Needed to serialize bigint values.
                e
            });
        }
    }
}

// TODO: Backwards compatibility, remove in future release.

const sha256 = (
    hex: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    returnType: 'buffer' | 'hex' = 'buffer'
): string | Uint8Array =>
    returnType === 'buffer' ? Sha256.of(hex).bytes : Sha256.of(hex).toString();

export { Sha256, sha256 };
