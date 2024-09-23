import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiItem
} from '@vechain/sdk-errors';
import { type Result } from 'ethers';
import {
    type AbiFunction,
    decodeFunctionData,
    type DecodeFunctionDataReturnType,
    decodeFunctionResult,
    type DecodeFunctionResultReturnType,
    encodeFunctionData,
    type Hex as ViemHex
} from 'viem';
import { ABIItem } from './ABIItem';
import { HexUInt } from '../HexUInt';

/**
 * Represents a function call in the Function ABI.
 * @extends ABIItem
 */
class ABIFunction extends ABIItem {
    private readonly functionSignature: AbiFunction;
    public constructor(signature: string);
    public constructor(signature: AbiFunction);
    public constructor(signature: string | AbiFunction) {
        try {
            super(signature);
            this.functionSignature = this.signature as AbiFunction;
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
     * @param {HexUInt} data - Data to decode.
     * @returns Decoding results.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public decodeData(data: HexUInt): DecodeFunctionDataReturnType {
        try {
            return decodeFunctionData({
                abi: [this.signature],
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
     * @returns {HexUInt} Encoded data.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public encodeData<TValue>(dataToEncode?: TValue[]): HexUInt {
        try {
            return HexUInt.of(
                encodeFunctionData({
                    abi: [this.signature],
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
     * @param {HexUInt} data - The data to be decoded, typically representing the output of a contract function call.
     * @returns {DecodeFunctionResultReturnType} An object containing the decoded data.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     *
     * @example
     * ```typescript
     *   const decoded = abiFunctionInstance.decodeResult(rawTransactionOutput);
     *   console.log('Decoded Output:', decoded);
     * ```
     */
    public decodeResult(data: HexUInt): DecodeFunctionResultReturnType {
        try {
            return decodeFunctionResult({
                abi: [this.signature],
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

    /**
     * DISCLAIMER: This method will be eventually deprecated in favour of viem via #1184.
     * Decodes a function output following the ethers format.
     * @param {HexUInt} data The data to be decoded
     * @returns {Result} The decoded data
     * @deprecated
     */
    public decodeEthersOutput(data: HexUInt): Result {
        const resultDecoded = this.decodeResult(data);
        if (this.functionSignature.outputs.length > 1) {
            return this.parseObjectValues(resultDecoded as object) as Result;
        } else if (
            this.functionSignature.outputs.length === 1 &&
            this.functionSignature.outputs[0].type === 'tuple'
        ) {
            return [this.parseObjectValues(resultDecoded as object)] as Result;
        }
        return [resultDecoded] as Result;
    }
}
export { ABIFunction };
