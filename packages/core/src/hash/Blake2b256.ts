import { blake2b as nh_blake2b } from '@noble/hashes/blake2b';
import { Hex, HexUInt } from '../vcdm';
import { InvalidOperation } from '@vechain/sdk-errors';

class Blake2b256 extends HexUInt implements Blake2b256 {
    protected constructor(hui: HexUInt) {
        super(hui);
    }

    public static of(exp: bigint | string | Uint8Array | Hex): Blake2b256 {
        try {
            let bytes: Uint8Array;
            if (exp instanceof Hex) {
                bytes = exp.bytes;
            } else if (exp instanceof Uint8Array) {
                bytes = exp;
            } else {
                // is (typeof exp === 'bigint' || typeof exp === 'string').
                bytes = Hex.of(exp).bytes;
            }
            const hash = nh_blake2b
                .create({ dkLen: 32 })
                .update(bytes)
                .digest();
            return new Blake2b256(HexUInt.of(hash));
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            throw new InvalidOperation('Blake2b256.of', 'hash error', {
                exp: `${exp}`, // Needed to serialize bigint values.
                e
            });
        }
    }
}

export { Blake2b256 };
