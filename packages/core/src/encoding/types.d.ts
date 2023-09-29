import type * as rlp from 'rlp';

/**
 * Inpout type for encoding
 */
type RLPInput = rlp.Input;

/**
 * Output type for decoding
 */
type RLPOutput = Uint8Array | rlp.NestedUint8Array;

export { type RLPInput, type RLPOutput };
