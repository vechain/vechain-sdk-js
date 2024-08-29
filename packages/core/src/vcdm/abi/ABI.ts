import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidOperation
} from '@vechain/sdk-errors';
import {
    type Abi,
    type AbiParameter,
    decodeAbiParameters,
    encodeAbiParameters,
    parseAbi,
    parseAbiParameters,
    toFunctionHash
} from 'viem';
import { Hex } from '../Hex';
import { type VeChainDataModel } from '../VeChainDataModel';

class ABI implements VeChainDataModel<ABI> {
    private readonly types: readonly AbiParameter[];
    private readonly values: unknown[];
    protected readonly abiRepresentation: Abi;
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
        this.abiRepresentation = parseAbi([signature]);
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
        try {
            return Hex.of(
                encodeAbiParameters<AbiParameter[]>(
                    [...this.types],
                    this.values
                )
            ).bytes;
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABI.bytes',
                'Encoding failed: Data must be a valid ABI type with corresponding valid data.',
                {
                    types: this.types,
                    values: this.values
                },
                error
            );
        }
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
     * Decodes the ABI values from the given ABI types and encoded data.
     * @param {string| AbiParameter[]} types The list of ABI types representing the types of the values to decode.
     * @param {Hex} dataEncoded The encoded data to decode.
     * @returns An ABI instance with the decoded values.
     */
    public static of(types: string | AbiParameter[], dataEncoded: Hex): ABI {
        try {
            let values: unknown[] = [];
            if (typeof types === 'string') {
                const parsedAbiParams = parseAbiParameters(types);
                values = decodeAbiParameters<AbiParameter[]>(
                    [...parsedAbiParams],
                    dataEncoded.bytes
                );
            } else {
                values = decodeAbiParameters<AbiParameter[]>(
                    [...types],
                    dataEncoded.bytes
                );
            }
            return new ABI(types, values);
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
}

export { ABI };
