import { Hex, HexUInt, type Hash } from '../vcdm';
import { InvalidOperation } from '@vechain/sdk-errors';
import { blake2b as nh_blake2b } from '@noble/hashes/blake2b';

class Blake2b256 extends HexUInt implements Hash {
    public static of(
        exp: bigint | number | string | Uint8Array | Hex
    ): Blake2b256 {
        try {
            const hash = nh_blake2b
                .create({ dkLen: 32 })
                .update(HexUInt.of(exp).bytes)
                .digest();
            return new Blake2b256(Hex.POSITIVE, HexUInt.of(hash).digits);
        } catch (e) {
            throw new InvalidOperation('Blake2b256.of', 'hash error', {
                exp: `${exp}`, // Needed to serialize bigint values.
                e
            });
        }
    }
}

export { Blake2b256 };
