import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidOperation
} from '@vechain/sdk-errors';
import { type ParamType } from 'ethers';
import {
    decodeAbiParameters,
    encodeAbiParameters,
    parseAbiItem,
    parseAbiParameters,
    toFunctionHash,
    type AbiParameter,
    type Abi as ViemABI
} from 'viem';
import { fragment, type BytesLike } from '../../abi';
import { Hex } from '../Hex';
import { type VeChainDataModel } from '../VeChainDataModel';

class ABI implements VeChainDataModel<ABI> {
    private readonly types: readonly AbiParameter[];
    private readonly values: unknown[];
    protected readonly abiRepresentation?: ViemABI;
    public readonly signature: string;

    public constructor(types: string | AbiParameter[], values: unknown[]);
    public constructor(signature: string);

    /**
     * ABI values to encode.
     *
     * @param {string | AbiParameter[]} types - An list of ABI types representing the types of the values to encode.
     * @param {unknown[]} values - An array of values to be encoded according to the specified ABI types.
     **/
    public constructor(
        types: string | AbiParameter[] = [],
        values: unknown[] = [],
        signature: string = ''
    ) {
        this.types =
            typeof types === 'string' ? parseAbiParameters(types) : types;
        this.values = values;
        this.signature = signature;
        this.abiRepresentation =
            signature !== '' ? parseAbiItem([signature]) : undefined;
    }

    /**
     * The signature hash of the ABI.
     * @returns {string} The signature hash of the ABI.
     * @remarks Wrapper for {@link toFunctionHash}.
     **/
    public get signatureHash(): string {
        return toFunctionHash(this.signature);
    }

    /**
     * Compares the current ABI instance with another ABI instance.
     * @param that The ABI to compare with.
     * @returns {number} A non-zero number if the current ABI is different to the other ABI or zero if they are equal.
     * @override {@link VeChainDataModel#compareTo}
     * @remark The comparison is done by comparing the types and values of the ABI instances.
     **/
    public compareTo(that: ABI): number {
        // TODO: review the rest of attributes
        this.types.forEach((type, index) => {
            if (type !== that.types[index]) {
                return -1;
            }
        });
        this.values.forEach((value, index) => {
            if (value !== that.values[index]) {
                return 1;
            }
        });
        return 0;
    }

    /**
     * Checks if the current ABI object is equal to the given ABI object.
     * @param that The ABI object to compare with.
     * @returns {boolean} True if the objects are equal, false otherwise.
     * @override {@link VeChainDataModel#isEqual}
     * @remark The comparison is done by comparing the types and values of the ABI instances.
     **/
    public isEqual(that: ABI): boolean {
        return this.compareTo(that) === 0;
    }

    /**
     * Throws an exception because the ABI cannot be represented as a big integer.
     * @returns {bigint} The BigInt representation of the ABI.
     * @throws {InvalidOperation} The ABI cannot be represented as a bigint.
     * @override {@link VeChainDataModel#bi}
     * @remark The conversion to BigInt is not supported for an ABI.
     */
    public get bi(): bigint {
        throw new InvalidOperation(
            'ABI.bi',
            'There is no big integer representation for an ABI.',
            { data: '' }
        );
    }

    /**
     * Encodes the values according to the specified ABI types when creating the ABI instance.
     *
     * @returns The ABI-encoded bytes representing the given values.
     * @throws {InvalidAbiDataToEncodeOrDecode, InvalidDataType}
     */
    public get bytes(): Uint8Array {
        return this.toHex().bytes;
    }

    /**
     * Throws an exception because the ABI cannot be represented as a number.
     * @returns {bigint} The number representation of the ABI.
     * @throws {InvalidOperation} The mnemonic cannot be represented as a number.
     * @override {@link VeChainDataModel#n}
     * @remark The conversion to number is not supported for an ABI.
     */
    public get n(): number {
        throw new InvalidOperation(
            'ABI.n',
            'There is no number representation for an ABI.',
            { data: '' }
        );
    }

    /**
     * Instantiates an ABI object from the given types and values.
     * @param {string | AbiParameter[]} types ABI parameters representing the types of the values.
     * @param {unknown[]} values ABI values.
     * @returns {ABI} The ABI object with the given types and values.
     */
    public static of(types: string | AbiParameter[], values: unknown[]): ABI {
        try {
            return new ABI(types, values);
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABI.of',
                'Types and values must be valid ABI parameters.',
                {
                    types,
                    values
                },
                error
            );
        }
    }

    /**
     * Decodes the ABI values from the given ABI types and encoded data.
     * @param {string| AbiParameter[]} types The list of ABI types representing the types of the values to decode.
     * @param {Hex} dataEncoded The encoded data to decode.
     * @returns An ABI instance with the decoded values.
     */
    public static ofEncoded(
        types: string | AbiParameter[],
        dataEncoded: string | Uint8Array
    ): ABI {
        try {
            const hexDataEncoded = Hex.of(dataEncoded);
            let values: readonly unknown[];
            if (typeof types === 'string') {
                const parsedAbiParams = parseAbiParameters(types);
                values = decodeAbiParameters(
                    [...parsedAbiParams],
                    hexDataEncoded.bytes
                );
            } else {
                values = decodeAbiParameters([...types], hexDataEncoded.bytes);
            }
            return new ABI(types, [...values]);
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABI.of',
                'Decoding failed: Data must be a valid ABI type with corresponding valid data.',
                {
                    types,
                    data: dataEncoded
                },
                error
            );
        }
    }

    /**
     * It gets the first decoded value from the ABI.
     * @returns {ReturnType} The first decoded value from the ABI.
     */
    public getFirstDecodedValue<ReturnType>(): ReturnType {
        return this.values[0] as ReturnType;
    }

    /**
     * Parses an ABI to its Hex representation.
     * @returns {Hex} The Hex representation of the ABI.
     */
    public toHex(): Hex {
        try {
            return Hex.of(
                encodeAbiParameters<AbiParameter[]>(
                    [...this.types],
                    this.values
                )
            );
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABI.toHex',
                'Encoding failed: Data must be a valid ABI type with corresponding valid data.',
                {
                    types: this.types,
                    values: this.values
                },
                error
            );
        }
    }
}

// TODO: rename to abi
const abi2 = {
    ...fragment,
    encode: <ValueType>(type: string | ParamType, value: ValueType): string =>
        ABI.of(type as string, [value])
            .toHex()
            .toString(),
    encodeParams: (types: string[] | ParamType[], values: string[]): string => {
        const typesParam = parseAbiParameters((types as string[]).join(', '));
        return ABI.of([...typesParam], values)
            .toHex()
            .toString();
    },
    decode: <ReturnType>(
        types: string | ParamType,
        data: BytesLike
    ): ReturnType => ABI.ofEncoded(types as string, data).getFirstDecodedValue()
};

export { ABI, abi2 };
