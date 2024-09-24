import { RLP as EthereumjsRLP } from '@ethereumjs/rlp';
import { type VeChainDataModel } from '../../VeChainDataModel';
import { type RLPInput, type RLPOutput } from './types';

abstract class RLP implements VeChainDataModel<RLP> {
    get bi(): bigint {
        throw new Error('Method not implemented.');
    }
    get bytes(): Uint8Array {
        throw new Error('Method not implemented.');
    }
    get n(): number {
        throw new Error('Method not implemented.');
    }
    public compareTo(_that: RLP): number {
        throw new Error('Method not implemented.');
    }
    public isEqual(_that: RLP): boolean {
        throw new Error('Method not implemented.');
    }
    /**
     * Encodes data using the Ethereumjs RLP library.
     * @param data - The data to be encoded.
     * @returns The encoded data as a Buffer.
     */
    protected encode(data: RLPInput): Buffer {
        const encodedData = EthereumjsRLP.encode(data);
        return Buffer.from(encodedData);
    }

    /**
     * Decodes RLP-encoded data using the Ethereumjs RLP library.
     * @param encodedData - The RLP-encoded data as a Buffer.
     * @returns The decoded data or null if decoding fails.
     */
    protected decode(encodedData: Buffer): RLPOutput {
        return EthereumjsRLP.decode(encodedData);
    }
}

export { RLP };
