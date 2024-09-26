import { RLP as EthereumjsRLP } from '@ethereumjs/rlp';
import { InvalidRLP } from '@vechain/sdk-errors';
import { ScalarKind, type RLPProfile } from './kind/scalarkind.abstract';
import {
    type RLPInput,
    type RLPOutput,
    type RLPValidObject,
    type RLPValueType
} from './types';

class RLP {
    /**
     * Encodes data using the Ethereumjs RLP library.
     * @param data - The data to be encoded.
     * @returns The encoded data as a Buffer.
     */
    public static encode(data: RLPInput): Buffer {
        const encodedData = EthereumjsRLP.encode(data);
        return Buffer.from(encodedData);
    }

    /**
     * Decodes RLP-encoded data using the Ethereumjs RLP library.
     * @param encodedData - The RLP-encoded data as a Buffer.
     * @returns The decoded data or null if decoding fails.
     */
    public static decode(encodedData: Buffer): RLPOutput {
        return EthereumjsRLP.decode(encodedData);
    }

    /**
     * Handles the RLP packing of data.
     * Recursively processes through object properties or array elements to prepare data for RLP encoding.
     *
     * @param obj - The object data to be packed.
     * @param profile - Profile for encoding structures.
     * @param context - Encoding context for error tracing.
     * @returns Packed data as RLPInput.
     * @throws {InvalidRLP}
     *
     */
    protected packData(
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
                '_packData()',
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
     * @param profile - Profile for decoding structures.
     * @param context - Decoding context for error tracing.
     * @returns Unpacked data as RLPValueType.
     * @throws {InvalidRLP}
     *
     */
    protected unpackData(
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
                    '_unpackData()',
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
                    '_unpackData()',
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
                '_unpackData()',
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

export { RLP };
