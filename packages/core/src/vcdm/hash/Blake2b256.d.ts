import { Hex } from '../Hex';
import { HexUInt } from '../HexUInt';
/**
 * Represents the result of an [BLAKE](https://en.wikipedia.org/wiki/BLAKE_(hash_function)) [BlAKE2B 256](https://www.blake2.net/) hash operation.
 *
 * @extends HexUInt
 */
declare class Blake2b256 extends HexUInt {
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
    static of(exp: bigint | number | string | Uint8Array | Hex): Blake2b256;
}
export { Blake2b256 };
//# sourceMappingURL=Blake2b256.d.ts.map