/**
 * Data utilities for contract interactions
 */
export const dataUtils = {
    /**
     * Encodes a string to bytes32 format
     * @param value - The string value to encode
     * @param alignment - The alignment direction ('left' or 'right')
     * @returns The encoded bytes32 string
     */
    encodeBytes32String(
        value: string,
        alignment: 'left' | 'right' = 'left'
    ): string {
        // Convert string to bytes32 format
        const encoder = new TextEncoder();
        const bytes = encoder.encode(value);

        // Pad to 32 bytes
        const padded = new Uint8Array(32);
        if (alignment === 'left') {
            padded.set(bytes.slice(0, 32));
        } else {
            padded.set(bytes.slice(0, 32), 32 - bytes.length);
        }

        // Convert to hex string
        return (
            '0x' +
            Array.from(padded)
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('')
        );
    }
};
