"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keccak256 = void 0;
const sha3_1 = require("@noble/hashes/sha3");
const sdk_errors_1 = require("@vechain/sdk-errors");
const Hex_1 = require("../Hex");
const HexUInt_1 = require("../HexUInt");
/**
 * Represents the result of an [KECCAK 256](https://keccak.team/keccak.html) hash operation.
 *
 * @extends HexUInt
 */
class Keccak256 extends HexUInt_1.HexUInt {
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
    static of(exp) {
        try {
            const hash = (0, sha3_1.keccak_256)(HexUInt_1.HexUInt.of(exp).bytes);
            return new Keccak256(Hex_1.Hex.POSITIVE, HexUInt_1.HexUInt.of(hash).digits);
        }
        catch (e) {
            throw new sdk_errors_1.InvalidOperation('Keccak256.of', 'hash error', {
                exp: `${exp}`, // Needed to serialize bigint values.
                e
            });
        }
    }
}
exports.Keccak256 = Keccak256;
