import { type ContractEventName, type ContractFunctionName, type DecodeEventLogReturnType, type DecodeFunctionDataReturnType, type DecodeFunctionResultReturnType, type Abi as ViemABI } from 'viem';
import { type Hex } from '../Hex';
import { ABI } from './ABI';
import { ABIEvent, type ABIEventData } from './ABIEvent';
import { ABIFunction } from './ABIFunction';
declare class ABIContract<TAbi extends ViemABI> extends ABI {
    readonly abi: TAbi;
    private readonly viemABI;
    constructor(abi: TAbi);
    /**
     * Creates an ABIContract instance from a viem ABI.
     * @param {ViemABI} abi representation of the contract.
     * @returns New instance of ABIContract.
     */
    static ofAbi<TAbi extends ViemABI>(abi: TAbi): ABIContract<TAbi>;
    /**
     * Returns the function with the given name.
     * @param {string} name The function's name.
     * @returns {ABIFunction} The function with the given name.
     * @throws {InvalidAbiItem}
     */
    getFunction<TFunctionName extends ContractFunctionName<TAbi>>(name: TFunctionName | string): ABIFunction<TAbi, TFunctionName>;
    /**
     * Returns the event with the given name.
     * @param {string} name The event's name.
     * @returns {ABIEvent} The event with the given name.
     * @throws {InvalidAbiItem}
     */
    getEvent<TEventName extends ContractEventName<TAbi>>(name: TEventName | string): ABIEvent<TAbi, TEventName>;
    /**
     * Encode function data that can be used to send a transaction.
     * @param {string} functionName The name of the function defined in the ABI.
     * @param {unknown[]} functionData The data to pass to the function.
     * @returns {Hex} The encoded data in hexadecimal that can be used to send a transaction.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    encodeFunctionInput<TFunctionName extends ContractFunctionName<TAbi>>(functionName: TFunctionName | string, functionData?: unknown[]): Hex;
    /**
     * Decode the function data of an encoded function
     * @param {string} functionName The name of the function defined in the ABI.
     * @param {Hex} encodedFunctionInput The encoded function data.
     * @returns {DecodeFunctionDataReturnType} an array of the decoded function data
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    decodeFunctionInput<TFunctionName extends ContractFunctionName<TAbi>>(functionName: TFunctionName | string, encodedFunctionInput: Hex): DecodeFunctionDataReturnType<TAbi, TFunctionName>;
    /**
     * Decodes the output from a contract function using the specified ABI and function name.
     * It takes the encoded function output and attempts to decode it according to the ABI definition.
     *
     * @param {string} functionName - The name of the function in the contract to decode the output for.
     * @param {Hex} encodedFunctionOutput - The encoded output data from the contract function.
     * @returns {DecodeFunctionResultReturnType} - The decoded output, which provides a user-friendly way
     * to interact with the decoded data.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     *
     * @example
     * // Example of decoding output for a function called "getValue":
     * const decodedOutput = decodeFunctionOutput('getValue', encodedValue);
     *
     */
    decodeFunctionOutput<TFunctionName extends ContractFunctionName<TAbi>>(functionName: TFunctionName | string, encodedFunctionOutput: Hex): DecodeFunctionResultReturnType<TAbi, TFunctionName>;
    /**
     * Encodes event log data based on the provided event name, and data to encode.
     * @param {string} eventName - The name of the event to be encoded.
     * @param {unknown[]} eventArgs - An array of data to be encoded in the event log.
     * @returns {ABIEventData} An object containing the encoded data and topics.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    encodeEventLog<TEventName extends ContractEventName<TAbi>>(eventName: TEventName | string, eventArgs: unknown[]): ABIEventData;
    /**
     * Decodes event log data based on the provided event name, and data/topics to decode.
     * @param {string} eventName - The name of the event to be decoded.
     * @param {ABIEventData} eventToDecode - An object containing the data and topics to be decoded.
     * @returns {DecodeEventLogReturnType} The decoded data of the event log.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    decodeEventLog<TEventName extends ContractEventName<TAbi>>(eventName: TEventName | string, eventToDecode: ABIEventData): DecodeEventLogReturnType<TAbi, TEventName>;
    /**
     * Decodes a VeChain log based on the ABI definition.
     *
     * This method takes raw `data` and `topics` from a VeChain log and attempts
     * to decode them using the contract's ABI definition. If the decoding is successful,
     * it returns a log object representing the decoded information. If the decoding fails,
     * it throws a custom error with detailed information.
     *
     * @param {Hex} data - The hexadecimal string of the data field in the log.
     * @param {Hex[]} topics - An array of hexadecimal strings representing the topics of the log.
     * @returns {DecodeEventLogReturnType} - A log object representing the decoded log or null if decoding fails.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    parseLog<TEventName extends ContractEventName<TAbi>>(data: Hex, topics: Hex[]): DecodeEventLogReturnType<TAbi, TEventName>;
    /**
     *
     * Parses the log data and topics into an array of values.
     *
     * @param {Hex} data - The hexadecimal string of the data field in the log.
     * @param {Hex[]} topics - An array of hexadecimal strings representing the topics of the log.
     * @returns {unknown[]} - An array of values of the decoded log data.
     */
    parseLogAsArray(data: Hex, topics: Hex[]): unknown[];
}
export { ABIContract };
//# sourceMappingURL=ABIContract.d.ts.map