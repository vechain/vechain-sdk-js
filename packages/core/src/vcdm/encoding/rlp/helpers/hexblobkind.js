"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertValidHexBlobKindData = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const Hex_1 = require("../../../Hex");
/**
 * Validates if the input is a proper hex string for HexBlobKind.
 *
 * @param data - The input data to validate.
 * @param context - Additional context for error handling.
 * @throws {InvalidRLP}
 */
const assertValidHexBlobKindData = (data, context) => {
    if (typeof data !== 'string') {
        throw new sdk_errors_1.InvalidRLP('assertValidHexBlobKindData()', `Validation error: Input must be a string.`, {
            context,
            data: {
                data
            }
        });
    }
    // Check if data is a valid hex string with '0x' prefix.
    if (!Hex_1.Hex.isValid(data)) {
        throw new sdk_errors_1.InvalidRLP('assertValidHexBlobKindData()', `Validation error: Input must be a valid hex string with a '0x' prefix.`, {
            context,
            data: {
                data
            }
        });
    }
    // Ensure the hex string length is even.
    if (data.length % 2 !== 0) {
        throw new sdk_errors_1.InvalidRLP('assertValidHexBlobKindData()', `Validation error: Hex string must have an even length.`, {
            context,
            data: {
                data
            }
        });
    }
};
exports.assertValidHexBlobKindData = assertValidHexBlobKindData;
