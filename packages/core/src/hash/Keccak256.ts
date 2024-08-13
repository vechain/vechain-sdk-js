import { Hex, HexUInt, type Hash } from '../vcdm';
import { InvalidOperation } from '@vechain/sdk-errors';
import { keccak_256 as nh_keccak_256 } from '@noble/hashes/sha3';

class Keccak256 extends HexUInt implements Hash {
    public static of(
        exp: bigint | number | string | Uint8Array | Hex
    ): Keccak256 {
        try {
            const hash = nh_keccak_256(HexUInt.of(exp).bytes);
            return new Keccak256(Hex.POSITIVE, HexUInt.of(hash).digits);
        } catch (e) {
            throw new InvalidOperation('Keccak256.of', 'hash error', {
                exp: `${exp}`, // Needed to serialize bigint values.
                e
            });
        }
    }
}

export { Keccak256 };
