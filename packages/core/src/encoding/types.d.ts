import { type NestedUint8Array, type Input } from '@ethereumjs/rlp';

/**
 * Represents the input type for the RLP encoding process.
 *
 * RLP (Recursive Length Prefix) is a serialization method used in Ethereum to encode nested arrays of binary data.
 *
 * @public
 */
type RLPInput = Input;

/**
 * Represents the output type from the RLP decoding process.
 *
 * After decoding, the data can either be a flat array (`Uint8Array`) or a nested structure (`NestedUint8Array`).
 *
 * @public
 */
type RLPOutput = Uint8Array | NestedUint8Array;

export { type RLPInput, type RLPOutput };
