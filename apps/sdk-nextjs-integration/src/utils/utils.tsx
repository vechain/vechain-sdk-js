/**
 * Reduce the size of a hex string
 *
 * @param hexString Hex string to reduce
 */
function reduceHexStringSize(hexString: string): string {
    // Size to reduce the hex string
    const size = 5;

    // Return the reduced hex string
    return `${hexString.slice(0, size)}...${hexString.slice(-size)}`;
}

export { reduceHexStringSize };
