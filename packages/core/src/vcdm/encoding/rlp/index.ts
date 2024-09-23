import { RLPBase } from './rlp';
import { RLPProfiles } from './kind';

export * from './rlp';
export * from './kind';
export * from './types.d';
export * from './helpers';

/**
 * The `RLP_CODER` object, encapsulating all functionalities related to Recursive Length Prefix (RLP_CODER) encoding.
 *
 * RLP_CODER contains the following classes and methods:
 * - `encode` - Encodes data using the Ethereumjs RLP_CODER library.
 * - `decode` - Decodes RLP_CODER-encoded data using the Ethereumjs RLP_CODER library.
 * - `Profiler` - Class handling the profiling of RLP_CODER encoded/decoded objects.
 * - `ScalarKind` - Abstract class for scalar types.
 * - `BufferKind` - Class managing buffers and ensuring type safety with encode/decode methods.
 * - `NumericKind` - Class managing numerical data ensuring it adheres to specific constraints.
 */
export const RLP_CODER = {
    ...RLPBase,
    ...RLPProfiles
};
