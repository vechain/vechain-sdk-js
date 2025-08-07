import { type Hex } from '@vcdm';

interface Codec {
    decode: <T>(bytes: Uint8Array) => T;
    encode: <T>(obj: T) => Uint8Array;
    fromHex: <T>(hex: Hex) => T;
    toHex: <T>(obj: T) => Hex;
}

export { type Codec };
