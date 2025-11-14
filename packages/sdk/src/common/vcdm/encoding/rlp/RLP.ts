import fastJsonStableStringify from 'fast-json-stable-stringify';
import { Hex } from '@common/vcdm';
import { IllegalArgumentError, InvalidEncodingError } from '@common/errors';
import { RLP as EthereumjsRLP } from '@ethereumjs/rlp';
import { ScalarKind, type RLPProfile } from './kind/ScalarKind';
import { bytesToNumberBE } from '@noble/ciphers/utils';
import { type RLPInput, type RLPValidObject, type RLPValueType } from './types';
import { type VeChainDataModel } from '@common/vcdm';

/**
 * Full Qualified Path
 */
const FQP = 'packages/sdk/src/common/vcdm/encoding/rlp/RLP!';

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
        const { bi } = this;
        if (bi <= Number.MAX_SAFE_INTEGER) {
            return Number(bi);
        }
        throw new IllegalArgumentError(
            `${FQP}<RLP>.n: number`,
            'not in the safe number range',
            {
                bytes: this.bytes
            }
        );
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
            throw new InvalidEncodingError(
                `${FQP}RLP.of(data: RLPInput): RLP`,
                `Error when creating an RLP instance for data ${
                    typeof data === 'object'
                        ? fastJsonStableStringify(data)
                        : String(data)
                }`,
                {
                    context:
                        'This method creates an RLP instance from a plain value.',
                    data: {
                        data
                    }
                },
                error instanceof Error ? error : undefined
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
            throw new InvalidEncodingError(
                `${FQP}RLP.ofEncoded(encodedData: Uint8Array): RLP`,
                `Error when creating an RLP instance for encoded data.`,
                {
                    context:
                        'This method creates an RLP instance from an encoded value.',
                    data: {
                        encodedData
                    }
                },
                error instanceof Error ? error : undefined
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
        const currentContext =
            context !== '' ? `${context}.${profile.name}` : profile.name;
        const { kind } = profile;

        // ScalarKind: direct encoding using the provided method.
        if (kind instanceof ScalarKind) {
            return kind.data(obj, currentContext).encode();
        }

        // StructKind: recursively pack each struct member based on its profile.
        if (Array.isArray(kind)) {
            return kind.map((k) =>
                this.packData(obj[k.name] as RLPValidObject, k, context)
            );
        }

        // Valid RLP array
        if (!Array.isArray(obj)) {
            throw new InvalidEncodingError(
                `${FQP}RLP.packData(obj: RLPValidObject, profile: RLPProfile, context: string): RLPInput`,
                `Validation error: Expected an array in ${currentContext}.`,
                {
                    context: currentContext,
                    data: {
                        obj,
                        profile
                    }
                }
            );
        }

        // ArrayKind: recursively pack each array item based on the shared item profile.
        if ('item' in kind && Array.isArray(obj)) {
            const { item } = kind;
            return obj.map((part, i) =>
                this.packData(
                    part as RLPValidObject,
                    { name: `#${i}`, kind: item },
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
        const currentContext =
            context !== '' ? `${context}.${profile.name}` : profile.name;

        const { kind } = profile;

        // ScalarKind: Direct decoding using the provided method.
        if (kind instanceof ScalarKind) {
            // ArrayBuffer.isView so we support https://github.com/vitest-dev/vitest/issues/5183
            if (!ArrayBuffer.isView(packed)) {
                throw new InvalidEncodingError(
                    `${FQP}RLP.unpackData(packed: RLPInput, profile: RLPProfile, context: string): RLPValueType`,
                    `Unpacking error: Expected data type is Uint8Array.`,
                    {
                        context: currentContext,
                        data: {
                            packed,
                            profile
                        }
                    }
                );
            }

            return kind.buffer(packed, currentContext).decode();
        }

        // StructKind: Recursively unpack each struct member based on its profile.
        if (Array.isArray(kind) && Array.isArray(packed)) {
            const parts = packed;

            if (kind.length !== parts.length) {
                throw new InvalidEncodingError(
                    `${FQP}RLP.unpackData(packed: RLPInput, profile: RLPProfile, context: string): RLPValueType`,
                    `Unpacking error: Expected ${kind.length} items, but got ${parts.length}.`,
                    {
                        context: currentContext,
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
            throw new InvalidEncodingError(
                `${FQP}RLP.unpackData(packed: RLPInput, profile: RLPProfile, context: string): RLPValueType`,
                `Validation error: Expected an array in ${currentContext}.`,
                {
                    context: currentContext,
                    data: {
                        packed,
                        profile
                    }
                }
            );
        }

        // ArrayKind: Recursively unpack each array item based on the shared item profile.
        if ('item' in kind && Array.isArray(packed)) {
            const { item } = kind;

            return packed.map((part, index) =>
                this.unpackData(
                    part,
                    { name: `#${index}`, kind: item },
                    context
                )
            ) as RLPValueType;
        }
    }
}

export { RLP };
