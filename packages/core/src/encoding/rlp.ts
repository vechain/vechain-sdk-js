import * as rlp from 'rlp';

class RLP {
    /**
     * Encodes data using the Ethereumjs RLP library.
     * @param data - The data to be encoded.
     * @returns The encoded data as a Buffer.
     */
    static encode(data: any): Buffer {
        const encodedData = rlp.encode(data);
        return Buffer.from(encodedData);
    }

    /**
     * Decodes RLP-encoded data using the Ethereumjs RLP library.
     * @param encodedData - The RLP-encoded data as a Buffer.
     * @returns The decoded data or null if decoding fails.
     */
    static decode(encodedData: Buffer): any {
        const decodedData = rlp.decode(encodedData);
        return decodedData;
    }
}

export {RLP};

