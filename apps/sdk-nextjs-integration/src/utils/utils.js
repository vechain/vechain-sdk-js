"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceHexStringSize = reduceHexStringSize;
/**
 * Reduce the size of a hex string
 *
 * @param hexString Hex string to reduce
 * @param size Size to reduce the hex string
 */
function reduceHexStringSize(hexString) {
    // Size to reduce the hex string
    const size = 5;
    // Return the reduced hex string
    return `${hexString.slice(0, size)}...${hexString.slice(-size)}`;
}
