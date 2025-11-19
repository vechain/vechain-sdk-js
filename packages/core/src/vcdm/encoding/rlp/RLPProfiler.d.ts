import { type RLPProfile } from './kind/ScalarKind';
import { RLP } from './RLP';
import { type RLPValidObject, type RLPValueType } from './types';
/**
 * Class handling the profiling of RLP encoded/decoded objects.
 * Provides methods to encode and decode objects based on a provided RLP profile.
 */
declare class RLPProfiler extends RLP {
    readonly profile: RLPProfile;
    /**
     * Creates a new Profiler instance.
     * @param profile - Profile for encoding/decoding structures.
     */
    private constructor();
    /**
     * Creates an RLPProfiler instance from a valid object.
     * @param {RLPValidObject} validObject Object to be encoded.
     * @returns {RLPProfiler} RLPProfiler instance.
     */
    static ofObject(validObject: RLPValidObject, profile: RLPProfile): RLPProfiler;
    /**
     * Decodes an object following the provided profile.
     * @param encodedData Data to be decoded.
     * @param profile Profile for encoding/decoding structures.
     * @returns - Decoded data as RLPValueType.
     */
    static ofObjectEncoded(encodedData: Uint8Array, profile: RLPProfile): RLPProfiler;
    /**
     * Returns the decoded unpacked object.
     * @returns {RLPValueType} Decoded unpacked object.
     */
    get object(): RLPValueType;
}
export { RLPProfiler };
//# sourceMappingURL=RLPProfiler.d.ts.map