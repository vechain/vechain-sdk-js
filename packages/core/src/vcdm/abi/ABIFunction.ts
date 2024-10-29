import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiItem
} from '@vechain/sdk-errors';
import {
    type AbiFunction,
    type ContractFunctionName,
    decodeFunctionData,
    type DecodeFunctionDataReturnType,
    decodeFunctionResult,
    type DecodeFunctionResultReturnType,
    encodeFunctionData,
    type Abi as ViemABI,
    type Hex as ViemHex
} from 'viem';
import { Hex } from '../Hex';
import { ABIItem } from './ABIItem';

/**
 * Represents a function call in the Function ABI.
 * @extends ABIItem
 */
class ABIFunction<
    TAbi extends ViemABI = ViemABI,
    TFunctionName extends
        ContractFunctionName<TAbi> = ContractFunctionName<TAbi>
> extends ABIItem {
    private readonly abiFunction: AbiFunction;
    public constructor(signature: string);
    public constructor(signature: AbiFunction);
    public constructor(signature: string | AbiFunction) {
        try {
            super(signature);
            this.abiFunction = this.signature as AbiFunction;
        } catch (error) {
            throw new InvalidAbiItem(
                'ABIFunction constructor',
                'Initialization failed: Cannot create Function ABI. Function format is invalid.',
                {
                    type: 'function',
                    value: signature
                },
                error
            );
        }
    }

    /**
     * Get the function selector.
     * @returns {string} The function selector.
     * @override {@link ABIItem#signatureHash}
     */
    public get signatureHash(): string {
        return super.signatureHash.substring(0, 10);
    }

    /**
     * Decode data using the function's ABI.
     *
     * @param {Hex} data - Data to decode.
     * @returns Decoding results.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public decodeData(
        data: Hex
    ): DecodeFunctionDataReturnType<TAbi, TFunctionName> {
        try {
            return decodeFunctionData({
                abi: [this.abiFunction],
                data: data.toString() as ViemHex
            });
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIFunction.decodeData',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                { data },
                error
            );
        }
    }

    /**
     * Encode data using the function's ABI.
     *
     * @param dataToEncode - Data to encode.
     * @returns {Hex} Encoded data.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public encodeData<TValue>(dataToEncode?: TValue[]): Hex {
        try {
            return Hex.of(
                encodeFunctionData({
                    abi: [this.abiFunction],
                    args: dataToEncode
                })
            );
        } catch (e) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIFunction.encodeData',
                'Encoding failed: Data format is invalid. Function data does not match the expected format for ABI type encoding.',
                { dataToEncode },
                e
            );
        }
    }

    /**
     * Decodes the output data from a transaction based on ABI (Application Binary Interface) specifications.
     * This method attempts to decode the given hex-like data into a readable format using the contract's interface.
     *
     * @param {Hex} data - The data to be decoded, typically representing the output of a contract function call.
     * @returns {DecodeFunctionResultReturnType} An object containing the decoded data.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     *
     * @example
     * ```typescript
     *   const decoded = abiFunctionInstance.decodeResult(rawTransactionOutput);
     *   console.log('Decoded Output:', decoded);
     * ```
     */
    public decodeResult(
        data: Hex
    ): DecodeFunctionResultReturnType<TAbi, TFunctionName> {
        try {
            const result = decodeFunctionResult({
                abi: [this.abiFunction],
                data: data.toString() as ViemHex
            });

            return result as DecodeFunctionResultReturnType<
                TAbi,
                TFunctionName
            >;
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIFunction.decodeResult',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                { data },
                error
            );
        }
    }

    /**
     * Decodes a function output returning an array of values.
     * @param {Hex} data The data to be decoded
     * @returns {unknown[]} The decoded data as array of values
     */
    public decodeOutputAsArray(data: Hex): unknown[] {
        const resultDecoded = this.decodeResult(data);
        if (this.abiFunction.outputs.length > 1) {
            return this.parseObjectValues(resultDecoded as object);
        } else if (
            this.abiFunction.outputs.length === 1 &&
            this.abiFunction.outputs[0].type === 'tuple'
        ) {
            return [this.parseObjectValues(resultDecoded as object)];
        }
        return [resultDecoded];
    }
}
export { ABIFunction };
