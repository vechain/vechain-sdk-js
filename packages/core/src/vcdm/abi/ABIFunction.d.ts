import { type AbiFunction, type ContractFunctionName, type DecodeFunctionDataReturnType, type DecodeFunctionResultReturnType, type Abi as ViemABI } from 'viem';
import { Hex } from '../Hex';
import { ABIItem } from './ABIItem';
/**
 * Represents a function call in the Function ABI.
 * @extends ABIItem
 */
declare class ABIFunction<TAbi extends ViemABI = ViemABI, TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>> extends ABIItem {
    private readonly abiFunction;
    constructor(signature: string);
    constructor(signature: AbiFunction);
    /**
     * Get the function selector.
     * @returns {string} The function selector.
     * @override {@link ABIItem#signatureHash}
     */
    get signatureHash(): string;
    /**
     * Decode data using the function's ABI.
     *
     * @param {Hex} data - Data to decode.
     * @returns Decoding results.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    decodeData(data: Hex): DecodeFunctionDataReturnType<TAbi, TFunctionName>;
    /**
     * Encode data using the function's ABI.
     *
     * @param dataToEncode - Data to encode.
     * @returns {Hex} Encoded data.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    encodeData<TValue>(dataToEncode?: TValue[]): Hex;
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
    decodeResult(data: Hex): DecodeFunctionResultReturnType<TAbi, TFunctionName>;
    /**
     * Decodes a function output returning an array of values.
     * @param {Hex} data The data to be decoded
     * @returns {unknown[]} The decoded data as array of values
     */
    decodeOutputAsArray(data: Hex): unknown[];
}
export { ABIFunction };
//# sourceMappingURL=ABIFunction.d.ts.map