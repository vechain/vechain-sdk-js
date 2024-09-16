import * as nh_sha256 from '@noble/hashes/sha256';
import { InvalidOperation } from '@vechain/sdk-errors';
import { Hex, Txt, type Hash } from '../index';
import { HexUInt } from '../HexUInt';

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
     * @remarks Security auditable method, depends on
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

// Backwards compatibility, remove in future release #1184

function sha256(data: string | Uint8Array, returnType: 'buffer'): Uint8Array;

function sha256(data: string | Uint8Array, returnType: 'hex'): string;

function sha256(
    data: string | Uint8Array,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    returnType: 'buffer' | 'hex' = 'buffer'
): string | Uint8Array {
    return returnType === 'buffer'
        ? Sha256.of(Txt.of(data).bytes).bytes
        : Sha256.of(Txt.of(data).bytes).toString();
}

export { Sha256, sha256 };
