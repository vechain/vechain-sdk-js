import { RLP as EthereumjsRLP } from '@ethereumjs/rlp';
import { type RLPProfile } from './kind/scalarkind.abstract';
import { RLP } from './RLP';
import { type RLPValidObject, type RLPValueType } from './types';

/**
 * Class handling the profiling of RLP encoded/decoded objects.
 * Provides methods to encode and decode objects based on a provided RLP profile.
 */
class RLPProfiler extends RLP {
    /**
     * Creates a new Profiler instance.
     * @param profile - Profile for encoding/decoding structures.
     */
    constructor(readonly profile: RLPProfile) {
        super();
    }
    /**
     * Encodes an object following the provided profile.
     * @param data - Object to be encoded.
     * @returns - Encoded data as a Buffer.
     */
    public encodeObject(data: RLPValidObject): Buffer {
        const packedData = this.packData(data, this.profile, '');
        return Buffer.from(EthereumjsRLP.encode(packedData));
    }

    /**
     * Decodes an object following the provided profile.
     * @param encodedData - Data to be decoded.
     * @returns - Decoded data as RLPValueType.
     */
    public decodeObject(encodedData: Buffer): RLPValueType {
        const packedData = EthereumjsRLP.decode(encodedData);
        return this.unpackData(packedData, this.profile, '');
    }
}

export { RLPProfiler };
