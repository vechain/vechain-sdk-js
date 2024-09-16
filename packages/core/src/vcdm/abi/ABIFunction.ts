import { InvalidAbiDataToEncodeOrDecode } from '@vechain/sdk-errors';
import {
    type AbiFunction,
    decodeFunctionData,
    type DecodeFunctionDataReturnType,
    decodeFunctionResult,
    type DecodeFunctionResultReturnType,
    encodeFunctionData,
    type EncodeFunctionDataReturnType,
    parseAbiItem,
    toFunctionSignature,
    type Abi as ViemABI,
    type Hex as ViemHex
} from 'viem';
import { type Hex } from '../Hex';
import { ABI } from './ABI';

/**
 * Represents a function call in the Function ABI.
 * @extends ABI
 */
class ABIFunction extends ABI {
    public constructor(signature: string | ViemABI) {
        if (typeof signature === 'string') {
            super(undefined, undefined, signature);
            this.abiRepresentation = parseAbiItem([signature]);
        } else {
            super(
                undefined,
                undefined,
                toFunctionSignature(signature as unknown as AbiFunction)
            );
            this.abiRepresentation = signature;
        }
    }

    /**
     * Decode data using the function's ABI.
     *
     * @param {Hex} data - Data to decode.
     * @returns Decoding results.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public decodeData(data: Hex): DecodeFunctionDataReturnType {
        try {
            return decodeFunctionData({
                abi: this.abiRepresentation as ViemABI,
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
     * @returns Encoded data.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public encodeData<TValue>(
        dataToEncode: TValue[]
    ): EncodeFunctionDataReturnType {
        try {
            return encodeFunctionData({
                abi: this.abiRepresentation as ViemABI,
                args: dataToEncode
            });
        } catch (e) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIFunction.encodeInput',
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
    public decodeResult(data: Hex): DecodeFunctionResultReturnType {
        try {
            return decodeFunctionResult({
                abi: this.abiRepresentation as ViemABI,
                data: data.toString() as ViemHex
            });
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIFunction.decodeResult',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                { data },
                error
            );
        }
    }
}

export { ABIFunction };