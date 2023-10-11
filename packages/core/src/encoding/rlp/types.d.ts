import { type Input, type NestedUint8Array } from '@ethereumjs/rlp';
import { type ScalarKind } from './kind';
/**
 * Represents a valid input for the RLP (Recursive Length Prefix) encoding.
 * The RLP encoding is used to encode arbitrary binary data (nested arrays of bytes).
 *
 * @typeParam Input - Can be a Buffer, Array of Inputs, Buffer array, or nested array of Inputs.
 * @see {@link https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/rlp/src/index.ts}
 */
type RLPInput = Input;

/**
 * Represents an output from RLP decoding.
 * This type can either be a single Uint8Array (byte array) or a nested structure
 * of Uint8Array instances.
 *
 * @typeParam Uint8Array - A typed array of 8-bit unsigned integers.
 * @typeParam NestedUint8Array - A possibly nested array of Uint8Arrays.
 */
type RLPOutput = Uint8Array | NestedUint8Array;

/**
 * Represents a complex RLP object.
 * This type allows for recursive nesting of RLPInput or further RLPComplexObjects,
 * allowing the definition of complex structures.
 *
 * @typeParam RLPInput - A valid RLP input type.
 * @typeParam RLPComplexObject - Recursive type to enable nesting of complex objects.
 */
interface RLPComplexObject {
    [key: string]: RLPInput | RLPComplexObject | RLPComplexObject[];
}

/**
 * Represents a valid RLP object.
 * It is a dictionary-like object where keys are strings and values can be
 * a valid RLP input type or a complex RLP object (which can be further nested).
 *
 * @typeParam RLPValueType - A type that represents all valid RLP values.
 */
type RLPValidObject = Record<string, RLPValueType>;

/**
 * Represents all valid RLP value types.
 * This type union is used to simplify the definition of valid value types within
 * RLP object structures, supporting single inputs, complex objects, and arrays
 * of complex objects.
 *
 * @typeParam RLPInput - A valid RLP input type.
 * @typeParam RLPComplexObject - A valid complex RLP object.
 */
type RLPValueType = RLPInput | RLPComplexObject | RLPComplexObject[];

/* ------- RLP Profile Types ------- */
/**
 * `RLPProfile` Interface - Describes the profile of the RLP encoding.
 */
interface RLPProfile {
    name: string;
    kind: ScalarKind | ArrayKind | StructKind;
}

/**
 * `ArrayKind` Interface - Describes an array-kind in the RLP encoding profile.
 */
interface ArrayKind {
    item: RLPProfile['kind'];
}

/**
 * `StructKind` Type - Describes a structured-kind in the RLP encoding profile using an array of `RLPProfile`.
 */
type StructKind = RLPProfile[];

/**
 * `DataOutput` Interface - Provides an encoding mechanism to convert data into a Buffer.
 */
interface DataOutput {
    encode: () => Buffer;
}

/**
 * `BufferOutput` Interface - Provides a decoding mechanism to convert a Buffer back into data.
 */
interface BufferOutput {
    decode: () => RLPInput;
}

export type {
    RLPInput,
    RLPOutput,
    RLPValidObject,
    RLPValueType,
    RLPProfile,
    ArrayKind,
    StructKind,
    DataOutput,
    BufferOutput
};
