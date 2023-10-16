import { ScalarKind } from './skalarkind.abstract';
import {
    assertValidNumericKindBuffer,
    decodeBufferToNumberOrHex,
    encodeBigIntToBuffer,
    validateNumericKindData
} from '../helpers';
import { type BufferOutput, type DataOutput, type RLPInput } from '../types';

/**
 * `NumericKind` Class - Manages numerical data ensuring it adheres to specific constraints.
 */
class NumericKind extends ScalarKind {
    /**
     * @param maxBytes - [Optional] Maximum number of bytes that numerical data can have when encoded.
     */
    constructor(readonly maxBytes?: number) {
        super();
    }

    public data(data: RLPInput, context: string): DataOutput {
        // Validate and convert the numeric data to a BigInt instance.
        const dataBI = validateNumericKindData(data, context);

        return {
            encode: () =>
                // Encode the BigInt instance into a Buffer.
                encodeBigIntToBuffer(dataBI, this.maxBytes, context)
        };
    }

    public buffer(buffer: Buffer, context: string): BufferOutput {
        // Ensure the buffer adheres to constraints related to numeric data.
        assertValidNumericKindBuffer(buffer, context, this.maxBytes);

        return {
            decode: () =>
                // Decode the buffer into a number or hexadecimal string.
                decodeBufferToNumberOrHex(buffer)
        };
    }
}

export { NumericKind };
