import * as rlp from 'rlp';

/**
 * Encodes data using the Ethereumjs RLP library.
 * @param data - The data to be encoded.
 * @returns The encoded data as a Buffer.
 */
function encode(data: rlp.Input): Buffer {
    const encodedData = rlp.encode(data);
    return Buffer.from(encodedData);
}

/**
 * Decodes RLP-encoded data using the Ethereumjs RLP library.
 * @param encodedData - The RLP-encoded data as a Buffer.
 * @returns The decoded data or null if decoding fails.
 */
function decode(encodedData: Buffer): Uint8Array | rlp.NestedUint8Array {
    const decodedData = rlp.decode(encodedData);
    return decodedData;
}

export const RLP = { encode, decode };
