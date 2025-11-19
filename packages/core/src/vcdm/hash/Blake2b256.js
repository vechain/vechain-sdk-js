"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blake2b256 = void 0;
const blake2b_1 = require("@noble/hashes/blake2b");
const sdk_errors_1 = require("@vechain/sdk-errors");
const Hex_1 = require("../Hex");
const HexUInt_1 = require("../HexUInt");
/**
 * Represents the result of an [BLAKE](https://en.wikipedia.org/wiki/BLAKE_(hash_function)) [BlAKE2B 256](https://www.blake2.net/) hash operation.
 *
 * @extends HexUInt
 */
class Blake2b256 extends HexUInt_1.HexUInt {
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
    static of(exp) {
        try {
            const hash = blake2b_1.blake2b
                .create({ dkLen: 32 })
                .update(HexUInt_1.HexUInt.of(exp).bytes)
                .digest();
            return new Blake2b256(Hex_1.Hex.POSITIVE, HexUInt_1.HexUInt.of(hash).digits);
        }
        catch (e) {
            throw new sdk_errors_1.InvalidOperation('Blake2b256.of', 'hash error', {
                exp: `${exp}`, // Needed to serialize bigint values.
                e
            });
        }
    }
}
exports.Blake2b256 = Blake2b256;
