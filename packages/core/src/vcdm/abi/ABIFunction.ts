import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiFragment,
    InvalidAbiSignatureFormat
} from '@vechain/sdk-errors';
import {
    decodeFunctionData,
    type DecodeFunctionDataReturnType,
    decodeFunctionResult,
    type DecodeFunctionResultReturnType,
    encodeFunctionData,
    type EncodeFunctionDataReturnType,
    type Abi as ViemABI,
    type Hex as ViemHex
} from 'viem';
import { type BytesLike, type FormatType, type Result } from '../../abi';
import { Hex } from '../Hex';
import { ABI } from './ABI';

/**
 * Represents a function call in the Function ABI.
 * @extends ABI
 */
class ABIFunction extends ABI {
    public constructor(signature: string | ViemABI) {
        super(undefined, undefined, signature);
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
                abi: this.signature,
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
                abi: this.signature,
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
                abi: this.signature,
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

// Backwards comapatibility, this entire nested class should be removed as part of #1184
class Function<ABIType> {
    /**
     * Allowed formats for the signature.
     *
     * @private
     */
    private readonly allowedSignatureFormats = [
        'sighash',
        'minimal',
        'full',
        'json'
    ];

    private readonly function: ABIFunction;
    constructor(abi: ABIType) {
        try {
            if (typeof abi === 'string') {
                const stringAbi =
                    abi.indexOf('function') === 0 ? abi : `function ${abi}`;
                this.function = new ABIFunction(stringAbi);
            } else {
                this.function = new ABIFunction(abi as ViemABI);
            }
        } catch (error) {
            throw new InvalidAbiFragment(
                'abi.Function constructor',
                'Initialization failed: Cannot create Function fragment. Function format is invalid.',
                {
                    type: 'function',
                    fragment: abi
                },
                error
            );
        }
    }

    public signatureHash(): string {
        return this.function.signatureHash;
    }

    public signature(formatType: FormatType): string {
        // If the formatType is not included in the allowed formats, throw an error.
        if (!this.allowedSignatureFormats.includes(formatType)) {
            throw new InvalidAbiSignatureFormat(
                'getSignature()',
                'Initialization failed: Cannot create Function fragment. Function format is invalid.',
                {
                    signatureFormat: formatType
                }
            );
        }
        return this.function.stringSignature;
    }

    /**
     * Decode data using the function's ABI.
     *
     * @param data - Data to decode.
     * @returns Decoding results.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public decodeInput(data: BytesLike): Result {
        try {
            const dataDecoded = this.function.decodeData(Hex.of(data));
            return dataDecoded as unknown as Result;
        } catch (e) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'abi.Function.decodeInput()',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                { data },
                e
            );
        }
    }

    /**
     * Decodes the output data from a transaction based on ABI (Application Binary Interface) specifications.
     * This method attempts to decode the given byte-like data into a readable format using the contract's interface.
     *
     * @param data - The `BytesLike` data to be decoded, typically representing the output of a contract function call.
     * @returns A `Result` object containing the decoded data.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     *
     * @example
     * ```typescript
     *   const decoded = contractInstance.decodeOutput(rawTransactionOutput);
     *   console.log('Decoded Output:', decoded);
     * ```
     */
    public decodeOutput(data: BytesLike): Result {
        try {
            const resultDecoded = this.function.decodeResult(Hex.of(data));
            return resultDecoded as Result;
        } catch (e) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'abi.Function.decodeOutput()',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                { data },
                e
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
    public encodeInput<TValue>(dataToEncode?: TValue[]): string {
        try {
            return this.function.encodeData(dataToEncode as TValue[]);
        } catch (e) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'abi.Function.encodeInput()',
                'Encoding failed: Data format is invalid. Function data does not match the expected format for ABI type encoding.',
                { dataToEncode },
                e
            );
        }
    }
}

export { ABIFunction, Function };
