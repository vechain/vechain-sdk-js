import { RLP as rlp } from '@ethereumjs/rlp';
import {
    type RLPInput,
    type RLPOutput,
    type RLPProfile,
    type RLPValidObject,
    type RLPValueType
} from './types';
import { createRlpError, RLP } from '.';

/**
 * Encodes data using the Ethereumjs RLP library.
 * @param data - The data to be encoded.
 * @returns The encoded data as a Buffer.
 */
function encode(data: RLPInput): Buffer {
    const encodedData = rlp.encode(data);
    return Buffer.from(encodedData);
}

/**
 * Decodes RLP-encoded data using the Ethereumjs RLP library.
 * @param encodedData - The RLP-encoded data as a Buffer.
 * @returns The decoded data or null if decoding fails.
 */
function decode(encodedData: Buffer): RLPOutput {
    return rlp.decode(encodedData);
}

/**
 * Class handling the profiling of RLP encoded/decoded objects.
 * Provides methods to encode and decode objects based on a provided RLP profile.
 */
class Profiler {
    /**
     * Creates a new Profiler instance.
     * @param profile - RLP profile for encoding/decoding structures.
     */
    constructor(readonly profile: RLPProfile) {}

    /**
     * Encodes an object following the provided RLP profile.
     * @param data - Object to be encoded.
     * @returns - Encoded data as a Buffer.
     */
    public encodeObject(data: RLPValidObject): Buffer {
        const packedData = _packData(data, this.profile, '');
        return Buffer.from(rlp.encode(packedData));
    }

    /**
     * Decodes an object following the provided RLP profile.
     * @param encodedData - Data to be decoded.
     * @returns - Decoded data as RLPValueType.
     */
    public decodeObject(encodedData: Buffer): RLPValueType {
        const packedData = rlp.decode(encodedData);
        return _unpackData(packedData, this.profile, '');
    }
}

/**
 * Handles the RLP packing of data.
 * Recursively processes through object properties or array elements to prepare data for RLP encoding.
 *
 * @param obj - The object data to be packed.
 * @param profile - RLP profile for encoding structures.
 * @param context - Encoding context for error tracing.
 * @returns Packed data as RLPInput.
 *
 * @throws Throws error if the object data is not valid.
 *
 * @private
 */
const _packData = (
    obj: RLPValidObject,
    profile: RLPProfile,
    context: string
): RLPInput => {
    context = context !== '' ? context + '.' + profile.name : profile.name;
    const kind = profile.kind;

    // ScalarKind: direct encoding using the provided method.
    if (kind instanceof RLP.ScalarKind) {
        return kind.data(obj, context).encode();
    }

    // StructKind: recursively pack each struct member based on its profile.
    if (Array.isArray(kind)) {
        return kind.map((k) =>
            _packData(obj[k.name] as RLPValidObject, k, context)
        );
    }

    if (!Array.isArray(obj)) throw createRlpError(context, 'expected array');

    // ArrayKind: recursively pack each array item based on the shared item profile.
    if ('item' in kind) {
        const item = kind.item;
        return obj.map((part, i) =>
            _packData(
                part as RLPValidObject,
                { name: '#' + i, kind: item },
                context
            )
        );
    }
};

/**
 * Handles the RLP unpacking of data.
 * Recursively processes through packed properties or elements to prepare data post RLP decoding.
 *
 * @param packed - The packed data to be unpacked.
 * @param profile - RLP profile for decoding structures.
 * @param context - Decoding context for error tracing.
 * @returns Unpacked data as RLPValueType.
 *
 * @throws Throws error if the packed data is not valid.
 *
 * @private
 */
const _unpackData = (
    packed: RLPInput,
    profile: RLPProfile,
    context: string
): RLPValueType => {
    context = context !== '' ? context + '.' + profile.name : profile.name;

    const kind = profile.kind;

    // ScalarKind: Direct decoding using the provided method.
    if (kind instanceof RLP.ScalarKind) {
        if (!Buffer.isBuffer(packed) && !(packed instanceof Uint8Array))
            throw createRlpError(context, 'expected buffer');

        if (packed instanceof Uint8Array) packed = Buffer.from(packed);

        return kind.buffer(packed as Buffer, context).decode();
    }

    // StructKind: Recursively unpack each struct member based on its profile.
    if (Array.isArray(kind) && Array.isArray(packed)) {
        const parts = packed;

        if (parts.length !== kind.length)
            throw createRlpError(
                context,
                `expected ${kind.length} items, but got ${parts.length}`
            );

        return kind.reduce(
            (obj: RLPValidObject, profile: RLPProfile, index: number) => {
                obj[profile.name] = _unpackData(parts[index], profile, context);

                return obj;
            },
            {}
        );
    }

    if (!Array.isArray(packed)) throw createRlpError(context, 'expected array');

    // ArrayKind: Recursively unpack each array item based on the shared item profile.
    if ('item' in kind) {
        const item = kind.item;

        return packed.map((part, index) =>
            _unpackData(part, { name: '#' + index, kind: item }, context)
        ) as RLPValueType;
    }
};

export const RLPBase = { encode, decode, Profiler };
