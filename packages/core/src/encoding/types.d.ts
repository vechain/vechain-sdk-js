import { type NestedUint8Array, type Input } from '@ethereumjs/rlp';

/**
 * Inpout type for encoding
 */
type RLPInput = Input;

/**
 * Output type for decoding
 */
type RLPOutput = Uint8Array | NestedUint8Array;

export { type RLPInput, type RLPOutput };
