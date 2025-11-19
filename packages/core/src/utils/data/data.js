"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataUtils = void 0;
const nc_utils = __importStar(require("@noble/curves/abstract/utils"));
const sdk_errors_1 = require("@vechain/sdk-errors");
const Hex_1 = require("../../vcdm/Hex");
const Txt_1 = require("../../vcdm/Txt");
const const_1 = require("../const");
/**
 * Decodes a hexadecimal string representing a bytes32 value into a string.
 * The bytes32 string can be padded with zeros to the left or right.
 * An example of usage is to decode a bytes32 string returned by a smart contract function.
 *
 * @param {string} hex - The hexadecimal string to decode.
 * @returns {string} - The decoded string value.
 * @throws {InvalidDataType}
 */
const decodeBytes32String = (hex) => {
    if (!Hex_1.Hex.isValid(hex) || Hex_1.Hex.of(hex).digits.length !== 64)
        throw new sdk_errors_1.InvalidDataType('dataUtils.decodeBytes32String()', `Failed to decode value ${hex} to string. Value is not a valid hex string or it is not 64 characters long`, { value: hex });
    const valueInBytes = Hex_1.Hex.of(hex).bytes;
    // Find the first zero byte.
    const firstZeroIndex = valueInBytes.findIndex((byte) => byte === 0);
    // If the first byte is zero, then the encoded bytes 32 string is padded with zeros to the left.
    if (firstZeroIndex === 0) {
        // Find the first non-zero byte.
        const firstNotZeroIndex = valueInBytes.findIndex((byte) => byte !== 0);
        // Decode the encoded bytes 32 string to string by removing the padded zeros.
        return Txt_1.Txt.of(valueInBytes.subarray(firstNotZeroIndex)).toString();
    }
    else if (firstZeroIndex !== -1) {
        // Decode the encoded bytes 32 string to string by removing the padded zeros.
        return Txt_1.Txt.of(valueInBytes.subarray(0, firstZeroIndex)).toString();
    }
    else {
        return Txt_1.Txt.of(valueInBytes).toString();
    }
};
/**
 * Encodes a string into a bytes32 hexadecimal expression with optional zero padding.
 * The encoded bytes32 string can be used as a parameter for a smart contract function.
 *
 * @param {string} value - The value to encode.
 * @param {'left' | 'right'} [zeroPadding='left'] - The type of zero padding to apply.
 * @returns {string} The encoded bytes32 string is a hexadecimal expression prefixed with `0x.
 * @throws {InvalidDataType}
 */
const encodeBytes32String = (value, zeroPadding = 'right' // Default to 'right' as ethers.js does.
) => {
    // Wrap any error raised by utf8BytesOf(value).
    try {
        const valueInBytes = Txt_1.Txt.of(value).bytes;
        if (valueInBytes.length > 32) {
            throw new sdk_errors_1.InvalidDataType('dataUtils.encodeBytes32String()', `Failed to encode value ${value} to bytes32 string. Value exceeds 32 bytes.`, { value });
        }
        const pad = (0, const_1.ZERO_BYTES)(32 - valueInBytes.length);
        return zeroPadding === 'left'
            ? Hex_1.Hex.of(nc_utils.concatBytes(pad, valueInBytes)).toString()
            : Hex_1.Hex.of(nc_utils.concatBytes(valueInBytes, pad)).toString();
    }
    catch (e) {
        throw new sdk_errors_1.InvalidDataType('dataUtils.encodeBytes32String()', `Failed to encode value ${value} to bytes32 string.`, { value }, e);
    }
};
exports.dataUtils = {
    decodeBytes32String,
    encodeBytes32String
};
