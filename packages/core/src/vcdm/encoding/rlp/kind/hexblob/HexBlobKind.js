"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HexBlobKind = void 0;
const Hex_1 = require("../../../../Hex");
const HexUInt_1 = require("../../../../HexUInt");
const helpers_1 = require("../../helpers");
const ScalarKind_1 = require("../ScalarKind");
/**
 * Represents a scalar kind with hex blob functionality.
 * This class extends the {@link ScalarKind} class.
 *
 * @remarks
 * A hex blob is a hex string that is prefixed with '0x' and has even length.
 */
class HexBlobKind extends ScalarKind_1.ScalarKind {
    /**
     * Encodes the input data into a Uint8Array.
     *
     * @param data - The data to encode, expected to be a '0x' prefixed even sized hex string.
     * @param context - Context string for error handling.
     * @returns An object containing an encode function which returns the encoded Uint8Array.
     */
    data(data, context) {
        (0, helpers_1.assertValidHexBlobKindData)(data, context);
        return {
            encode: () => HexUInt_1.HexUInt.of(data.slice(2)).bytes
        };
    }
    /**
     * Decodes the input buffer into a hex string.
     *
     * @param buffer - The buffer to decode.
     * @param context - Context string for error handling.
     * @returns An object containing a decode function which returns the decoded hex string.
     */
    buffer(buffer, _context) {
        return {
            decode: () => Hex_1.Hex.of(buffer).toString()
        };
    }
}
exports.HexBlobKind = HexBlobKind;
