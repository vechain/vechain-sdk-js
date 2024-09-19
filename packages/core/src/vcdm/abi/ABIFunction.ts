import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiFragment,
    InvalidAbiSignatureFormat
} from '@vechain/sdk-errors';
import {
    type BytesLike,
    type FormatType,
    FunctionFragment,
    type Result
} from 'ethers';
import {
    type AbiFunction,
    decodeFunctionData,
    type DecodeFunctionDataReturnType,
    decodeFunctionResult,
    type DecodeFunctionResultReturnType,
    encodeFunctionData,
    type Hex as ViemHex
} from 'viem';
import { Hex } from '../Hex';
import { ABIItem } from './ABIItem';

/**
 * Represents a function call in the Function ABI.
 * @extends ABIItem
 */
class ABIFunction extends ABIItem {
    private readonly functionSignature: AbiFunction;
    public constructor(signature: string);
    public constructor(signature: AbiFunction);
    public constructor(signature: string | AbiFunction) {
        super(signature);
        this.functionSignature = this.signature as AbiFunction;
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
     * @returns {Hex} Encoded data.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public encodeData<TValue>(dataToEncode?: TValue[]): Hex {
        try {
            return Hex.of(
                encodeFunctionData({
                    abi: [this.signature],
                    args: dataToEncode
                })
            );
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
     * @param {Hex} data The data to be decoded
     * @returns {Result} The decoded data
     * @deprecated
     */
    public decodeEthersOutput(data: Hex): Result {
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

// Backwards compatibility, this entire nested class should be removed as part of #1184
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
    private readonly functionAbi: ABIType;
    constructor(abi: ABIType) {
        try {
            if (typeof abi === 'string') {
                const stringAbi =
                    abi.indexOf('function') === 0 ? abi : `function ${abi}`;
                this.function = new ABIFunction(
                    stringAbi.replace(' list', '').replace('tuple', '')
                );
            } else if (abi instanceof FunctionFragment) {
                this.function = new ABIFunction(
                    abi.format('full').replace(' list', '').replace('tuple', '')
                );
            } else {
                this.function = new ABIFunction(abi as AbiFunction);
            }
            this.functionAbi = abi;
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
        // This is a selector in Ethers
        return this.function.signatureHash.substring(0, 10);
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
            if (dataDecoded.args === undefined) {
                return [] as unknown as Result;
            } else if (dataDecoded.args instanceof Object) {
                return Object.values(dataDecoded.args) as Result;
            }

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
     * Encode data using the function's ABI.
     *
     * @param dataToEncode - Data to encode.
     * @returns Encoded data.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public encodeInput<TValue>(dataToEncode?: TValue[]): string {
        return this.function.encodeData(dataToEncode as TValue[]).toString();
    }
}

export { ABIFunction, Function };
