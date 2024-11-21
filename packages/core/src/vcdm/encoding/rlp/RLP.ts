import { RLP as EthereumjsRLP } from '@ethereumjs/rlp';
import { bytesToNumberBE } from '@noble/ciphers/utils';
import { InvalidDataType, InvalidRLP } from '@vechain/sdk-errors';
import { Hex } from '../../Hex';
import { type VeChainDataModel } from '../../VeChainDataModel';
import { ScalarKind, type RLPProfile } from './kind/ScalarKind';
import { type RLPInput, type RLPValidObject, type RLPValueType } from './types';

class RLP implements VeChainDataModel<RLP> {
    public readonly encoded: Uint8Array;
    public readonly decoded: RLPInput;

    protected constructor(data: RLPInput);
    protected constructor(data: Uint8Array);
    protected constructor(data: RLPInput | Uint8Array) {
        // ArrayBuffer.isView so we support https://github.com/vitest-dev/vitest/issues/5183
        this.decoded = ArrayBuffer.isView(data)
            ? EthereumjsRLP.decode(data)
            : data;
        this.encoded = ArrayBuffer.isView(data)
            ? data
            : EthereumjsRLP.encode(data);
    }

    /**
     * Returns the bigint representation of the encoded data in the RLP instance.
     * @returns {bigint} The bigint representation of the encoded data.
     */
    get bi(): bigint {
        return bytesToNumberBE(this.bytes);
    }

    /**
     * Returns the encoded data as a Uint8Array.
     * @returns {Uint8Array} The encoded data.
     */
    get bytes(): Uint8Array {
        return this.encoded;
    }

    /**
     * Returns the number representation of the encoded data in the RLP instance.
     * @returns {number} The number representation of the encoded data.
     */
    get n(): number {
        const bi = this.bi;
        if (bi <= Number.MAX_SAFE_INTEGER) {
            return Number(bi);
        }
        throw new InvalidDataType('RLP.n', 'not in the safe number range', {
            bytes: this.bytes
        });
    }

    /**
     * Compares the current RLP instance with another RLP instance.
     * @param {RLP} that The RLP instance to compare.
     * @returns 0 if the RLP instances are equal, -1/1 if they are not.
     */
    public compareTo(that: RLP): number {
        if (this.encoded.length !== that.encoded.length) {
            return -1;
        }

        for (let i = 0; i < this.encoded.length; i++) {
            if (this.encoded[i] !== that.encoded[i]) {
                return 1;
            }
        }

        return 0;
    }

    /**
     * Relies on compareTo to check if the RLP instances are equal.
     * @param {RLP} that The RLP instance to compare.
     * @returns true if the RLP instances are equal, false otherwise.
     */
    public isEqual(that: RLP): boolean {
        return this.compareTo(that) === 0;
    }

    /**
     * Creates {@link Hex} instance from the RLP encoded value.
     * @returns {Hex} The Hex instance.
     */
    public toHex(): Hex {
        return Hex.of(this.bytes);
    }

    /**
     * Returns an RLP instance from a plain value.
     * @param data - The plain data
     * @returns {RLP} The RLP instance.
     */
    public static of(data: RLPInput): RLP {
        try {
            return new RLP(data);
        } catch (error) {
            throw new InvalidRLP(
                'RLP.of()',
                `Error when creating an RLP instance for data ${data}`,
                {
                    context:
                        'This method creates an RLP instance from a plain value.',
                    data: {
                        data
                    }
                },
                error
            );
        }
    }

    /**
     * Returns an RLP instancen from an encoded value.
     * @param {Uint8Array} encodedData - The RLP-encoded data.
     * @returns The decoded data or null if decoding fails.
     */
    public static ofEncoded(encodedData: Uint8Array): RLP {
        try {
            return new RLP(encodedData);
        } catch (error) {
            throw new InvalidRLP(
                'RLP.ofEncoded()',
                `Error when creating an RLP instance for encoded data.`,
                {
                    context:
                        'This method creates an RLP instance from an encoded value.',
                    data: {
                        encodedData
                    }
                },
                error
            );
        }
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
    protected static packData(
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
                'RLP.packData()',
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
    protected static unpackData(
        packed: RLPInput,
        profile: RLPProfile,
        context: string
    ): RLPValueType {
        context = context !== '' ? context + '.' + profile.name : profile.name;

        const kind = profile.kind;

        // ScalarKind: Direct decoding using the provided method.
        if (kind instanceof ScalarKind) {
            // ArrayBuffer.isView so we support https://github.com/vitest-dev/vitest/issues/5183
            if (!ArrayBuffer.isView(packed)) {
                throw new InvalidRLP(
                    'RLP.unpackData()',
                    `Unpacking error: Expected data type is Uint8Array.`,
                    {
                        context,
                        data: {
                            packed,
                            profile
                        }
                    }
                );
            }

            return kind.buffer(packed, context).decode();
        }

        // StructKind: Recursively unpack each struct member based on its profile.
        if (Array.isArray(kind) && Array.isArray(packed)) {
            const parts = packed;

            if (kind.length !== parts.length) {
                throw new InvalidRLP(
                    'RLP.unpackData()',
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
                'RLP.unpackData()',
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
