import * as nh_sha3 from '@noble/hashes/sha3';
import { Hex, HexUInt, type Hash } from '../vcdm';
import { InvalidOperation } from '@vechain/sdk-errors';

/**
 * Represent the result of an [KECCAK256](https://en.wikipedia.org/wiki/SHA-3) hash operation.
 *
 * @extends HexUInt
 * @implements Hash
 */
class Keccak256 extends HexUInt implements Hash {
    /**
     * Creates a new instance of this class to represent the absolute `hui` hash result.
     *
     * @param hui The hash result.
     */
    protected constructor(hui: HexUInt) {
        super(hui);
    }

    /**
     * Generates the [KECCAK256](https://en.wikipedia.org/wiki/SHA-3) hash of a given input.
     *
     * @param {bigint | number | string | Uint8Array | Hex} exp - The input to be hashed.
     *
     * @returns {Keccak256} - The [KECCAK256](https://en.wikipedia.org/wiki/SHA-3) hash of the input.
     *
     * @throws {InvalidOperation} - If there is an error while hashing.
     *
     * @remark Security auditable method, depends on
     * * [nh_sha3.keccak_256](https://github.com/paulmillr/noble-hashes#sha3-fips-shake-keccak)
     */
    public static of(
        exp: bigint | number | string | Uint8Array | Hex
    ): Keccak256 {
        try {
            return new Keccak256(
                HexUInt.of(
                    nh_sha3.keccak_256(
                        (exp instanceof Hex ? exp : Hex.of(exp)).bytes
                    )
                )
            );
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            throw new InvalidOperation('Keccak256.of', 'hash error', {
                exp: `${exp}`, // Needed to serialize bigint values.
                e
            });
        }
    }
}

export { Keccak256 };
