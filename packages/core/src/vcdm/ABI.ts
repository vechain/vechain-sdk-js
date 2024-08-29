import { InvalidOperation } from '@vechain/sdk-errors';
import { type AbiParameter, encodeAbiParameters } from 'viem';
import { type VeChainDataModel } from './VeChainDataModel';
import { Hex } from './Hex';

class ABI implements VeChainDataModel<ABI> {
    private readonly types: AbiParameter[];
    private readonly values: AbiParameter[];

    /**
     * ABI values to encode.
     *
     * @param types - An array of ABI types representing the types of the values to encode.
     * @param values - An array of values to be encoded according to the specified ABI types.
     **/
    public constructor(types: AbiParameter[], values: AbiParameter[]) {
        this.types = types;
        this.values = values;
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
     */
    public get bytes(): Uint8Array {
        return Hex.of(
            encodeAbiParameters<AbiParameter[]>(this.types, this.values)
        ).bytes;
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
}

export { ABI };
