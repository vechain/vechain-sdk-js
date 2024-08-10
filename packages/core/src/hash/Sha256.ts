import { Hex, HexUInt, type Hash } from '../vcdm';
import * as nh_sha256 from '@noble/hashes/sha256';
import { InvalidOperation } from '@vechain/sdk-errors';

/**
 * Represents the result of an [SHA256](https://en.wikipedia.org/wiki/SHA-2) hash operation.
 *
 * @implements Hash
 */
class Sha256 extends HexUInt implements Hash {
    /**
     * Creates a new instance of this class to represent the absolute `hui` hash result.
     *
     * @param hui The hash result.
     * @protected
     */
    protected constructor(hui: HexUInt) {
        super(hui);
    }

    /**
     * Generates the [SHA256](https://en.wikipedia.org/wiki/SHA-2) hash of the given input.
     *
     * @param {bigint | number | string | Uint8Array | Hex} exp - The input value to hash.
     *
     * @returns {Sha256} - The [SHA256](https://en.wikipedia.org/wiki/SHA-2) hash of the input value.
     *
     *  @throws {InvalidOperation} - If a hash error occurs.
     */
    public static of(exp: bigint | number | string | Uint8Array | Hex): Sha256 {
        try {
            return new Sha256(
                HexUInt.of(
                    nh_sha256.sha256(
                        (exp instanceof Hex ? exp : Hex.of(exp)).bytes
                    )
                )
            );
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            throw new InvalidOperation('Sha256.of', 'hash error', {
                exp: `${exp}`, // Needed to serialize bigint values.
                e
            });
        }
    }
}

export { Sha256 };
