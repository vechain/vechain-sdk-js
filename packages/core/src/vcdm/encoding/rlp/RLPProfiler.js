"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RLPProfiler = void 0;
const RLP_1 = require("./RLP");
/**
 * Class handling the profiling of RLP encoded/decoded objects.
 * Provides methods to encode and decode objects based on a provided RLP profile.
 */
class RLPProfiler extends RLP_1.RLP {
    profile;
    /**
     * Creates a new Profiler instance.
     * @param profile - Profile for encoding/decoding structures.
     */
    constructor(data, profile) {
        super(data);
        this.profile = profile;
    }
    /**
     * Creates an RLPProfiler instance from a valid object.
     * @param {RLPValidObject} validObject Object to be encoded.
     * @returns {RLPProfiler} RLPProfiler instance.
     */
    static ofObject(validObject, profile) {
        const packedData = this.packData(validObject, profile, '');
        return new RLPProfiler(packedData, profile);
    }
    /**
     * Decodes an object following the provided profile.
     * @param encodedData Data to be decoded.
     * @param profile Profile for encoding/decoding structures.
     * @returns - Decoded data as RLPValueType.
     */
    static ofObjectEncoded(encodedData, profile) {
        const packedData = RLP_1.RLP.ofEncoded(encodedData).decoded;
        return new RLPProfiler(packedData, profile);
    }
    /**
     * Returns the decoded unpacked object.
     * @returns {RLPValueType} Decoded unpacked object.
     */
    get object() {
        return RLPProfiler.unpackData(this.decoded, this.profile, '');
    }
}
exports.RLPProfiler = RLPProfiler;
