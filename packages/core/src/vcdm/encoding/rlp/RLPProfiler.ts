import { type RLPProfile } from './kind/ScalarKind';
import { RLP } from './RLP';
import { type RLPInput, type RLPValidObject, type RLPValueType } from './types';

/**
 * Class handling the profiling of RLP encoded/decoded objects.
 * Provides methods to encode and decode objects based on a provided RLP profile.
 */
class RLPProfiler extends RLP {
    /**
     * Creates a new Profiler instance.
     * @param profile - Profile for encoding/decoding structures.
     */
    private constructor(
        data: RLPInput,
        readonly profile: RLPProfile
    ) {
        super(data);
    }

    /**
     * Creates an RLPProfiler instance from a valid object.
     * @param {RLPValidObject} validObject Object to be encoded.
     * @returns {RLPProfiler} RLPProfiler instance.
     */
    public static ofObject(
        validObject: RLPValidObject,
        profile: RLPProfile
    ): RLPProfiler {
        const packedData = this.packData(validObject, profile, '');
        return new RLPProfiler(packedData, profile);
    }

    /**
     * Decodes an object following the provided profile.
     * @param encodedData Data to be decoded.
     * @param profile Profile for encoding/decoding structures.
     * @returns - Decoded data as RLPValueType.
     */
    public static ofObjectEncoded(
        encodedData: Uint8Array,
        profile: RLPProfile
    ): RLPProfiler {
        const packedData = RLP.ofEncoded(encodedData).decoded;
        return new RLPProfiler(packedData, profile);
    }

    /**
     * Returns the decoded unpacked object.
     * @returns {RLPValueType} Decoded unpacked object.
     */
    get object(): RLPValueType {
        return RLPProfiler.unpackData(this.decoded, this.profile, '');
    }
}

export { RLPProfiler };
