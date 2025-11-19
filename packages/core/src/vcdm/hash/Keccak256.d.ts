import { Hex } from '../Hex';
import { HexUInt } from '../HexUInt';
/**
 * Represents the result of an [KECCAK 256](https://keccak.team/keccak.html) hash operation.
 *
 * @extends HexUInt
 */
declare class Keccak256 extends HexUInt {
    /**
     * Generates the [KECCAK 256](https://keccak.team/keccak.html) hash of the given input.
     *
     * @param {bigint | number | string | Uint8Array | Hex} exp - The input value to hash.
     *
     * @returns {Sha256} - The [KECCAK 256](https://keccak.team/keccak.html) hash of the input value.
     *
     * @throws {InvalidOperation} - If a hash error occurs.
     *
     * @remarks Security auditable method, depends on
     * * [`nh_keccak_256`](https://github.com/paulmillr/noble-hashes#sha3-fips-shake-keccak).
     */
    static of(exp: bigint | number | string | Uint8Array | Hex): Keccak256;
}
export { Keccak256 };
//# sourceMappingURL=Keccak256.d.ts.map