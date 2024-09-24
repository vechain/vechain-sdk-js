import { RLP as EthereumjsRLP } from '@ethereumjs/rlp';
import { InvalidRLP } from '@vechain/sdk-errors';
import { RLP, ScalarKind } from '.';
import {
    type RLPInput,
    type RLPProfile,
    type RLPValidObject,
    type RLPValueType
} from './types';

/**
 * Class handling the profiling of RLP encoded/decoded objects.
 * Provides methods to encode and decode objects based on a provided RLP profile.
 */
class RLPProfiler extends RLP {
    /**
     * Creates a new Profiler instance.
     * @param profile - RLP_CODER profile for encoding/decoding structures.
     */
    constructor(readonly profile: RLPProfile) {
        super();
    }

    /**
     * Encodes an object following the provided RLP_CODER profile.
     * @param data - Object to be encoded.
     * @returns - Encoded data as a Buffer.
     */
    public encodeObject(data: RLPValidObject): Buffer {
        const packedData = this.packData(data, this.profile, '');
        return Buffer.from(EthereumjsRLP.encode(packedData));
    }

    /**
     * Decodes an object following the provided RLP_CODER profile.
     * @param encodedData - Data to be decoded.
     * @returns - Decoded data as RLPValueType.
     */
    public decodeObject(encodedData: Buffer): RLPValueType {
        const packedData = EthereumjsRLP.decode(encodedData);
        return this.unpackData(packedData, this.profile, '');
    }

    /**
     * Handles the RLP packing of data.
     * Recursively processes through object properties or array elements to prepare data for RLP encoding.
     *
     * @param obj - The object data to be packed.
     * @param profile - RLP_CODER profile for encoding structures.
     * @param context - Encoding context for error tracing.
     * @returns Packed data as RLPInput.
     * @throws {InvalidRLP}
     *
     * @private
     */
    private packData(
        obj: RLPValidObject,
        profile: RLPProfile,
        context: string
    ): RLPInput {
        context = context !== '' ? context + '.' + profile.name : profile.name;
        const kind = profile.kind;

        // ScalarKind: direct encoding using the provided method.
        if (kind instanceof ScalarKind) {
            return kind.data(obj, context).encode();
        }

        // StructKind: recursively pack each struct member based on its profile.
        if (Array.isArray(kind)) {
            return kind.map((k) =>
                this.packData(obj[k.name] as RLPValidObject, k, context)
            );
        }

        // Valid RLP array
        if (!Array.isArray(obj)) {
            throw new InvalidRLP(
                'packData()',
                `Validation error: Expected an array in ${context}.`,
                {
                    context,
                    data: {
                        obj,
                        profile
                    }
                }
            );
        }

        // ArrayKind: recursively pack each array item based on the shared item profile.
        if ('item' in kind && Array.isArray(obj)) {
            const item = kind.item;
            return obj.map((part, i) =>
                this.packData(
                    part as RLPValidObject,
                    { name: '#' + i, kind: item },
                    context
                )
            );
        }
    }

    /**
     * Handles the RLP unpacking of data.
     * Recursively processes through packed properties or elements to prepare data post RLP decoding.
     *
     * @param packed - The packed data to be unpacked.
     * @param profile - RLP_CODER profile for decoding structures.
     * @param context - Decoding context for error tracing.
     * @returns Unpacked data as RLPValueType.
     * @throws {InvalidRLP}
     *
     * @private
     */
    private unpackData(
        packed: RLPInput,
        profile: RLPProfile,
        context: string
    ): RLPValueType {
        context = context !== '' ? context + '.' + profile.name : profile.name;

        const kind = profile.kind;

        // ScalarKind: Direct decoding using the provided method.
        if (kind instanceof ScalarKind) {
            if (!Buffer.isBuffer(packed) && !(packed instanceof Uint8Array)) {
                throw new InvalidRLP(
                    'unpackData()',
                    `Unpacking error: Expected data type is Buffer.`,
                    {
                        context,
                        data: {
                            packed,
                            profile
                        }
                    }
                );
            }

            if (packed instanceof Uint8Array) packed = Buffer.from(packed);

            return kind.buffer(packed as Buffer, context).decode();
        }

        // StructKind: Recursively unpack each struct member based on its profile.
        if (Array.isArray(kind) && Array.isArray(packed)) {
            const parts = packed;

            if (kind.length !== parts.length) {
                throw new InvalidRLP(
                    'unpackData()',
                    `Unpacking error: Expected ${kind.length} items, but got ${parts.length}.`,
                    {
                        context,
                        data: {
                            packed,
                            profile
                        }
                    }
                );
            }

            return kind.reduce(
                (obj: RLPValidObject, profile: RLPProfile, index: number) => {
                    obj[profile.name] = this.unpackData(
                        parts[index],
                        profile,
                        context
                    );

                    return obj;
                },
                {}
            );
        }

        // Valid RLP array
        if (!Array.isArray(packed)) {
            throw new InvalidRLP(
                'unpackData()',
                `Validation error: Expected an array in ${context}.`,
                {
                    context,
                    data: {
                        packed,
                        profile
                    }
                }
            );
        }

        // ArrayKind: Recursively unpack each array item based on the shared item profile.
        if ('item' in kind && Array.isArray(packed)) {
            const item = kind.item;

            return packed.map((part, index) =>
                this.unpackData(
                    part,
                    { name: '#' + index, kind: item },
                    context
                )
            ) as RLPValueType;
        }
    }
}

export { RLPProfiler };
