import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiItem
} from '@vechain/sdk-errors';
import {
    getAbiItem,
    type AbiEvent,
    type AbiFunction,
    type DecodeEventLogReturnType,
    type DecodeFunctionDataReturnType,
    type DecodeFunctionResultReturnType,
    type Abi as ViemABI
} from 'viem';
import { type Hex } from '../Hex';
import { ABI } from './ABI';
import { ABIEvent, type ABIEventData } from './ABIEvent';
import { ABIFunction } from './ABIFunction';

class ABIContract extends ABI {
    private readonly abi: ViemABI;

    constructor(abi: ViemABI) {
        super();
        this.abi = abi;
    }

    /**
     * Creates an ABIContract instance from a viem ABI.
     * @param {ViemABI} abi representation of the contract.
     * @returns New instance of ABIContract.
     */
    public static ofAbi(abi: ViemABI): ABIContract {
        return new ABIContract(abi);
    }

    /**
     * Returns the function with the given name.
     * @param {string} name The function's name.
     * @returns {ABIFunction} The function with the given name.
     * @throws {InvalidAbiItem}
     */
    public getFunction(name: string): ABIFunction {
        const functionAbiItem = getAbiItem({
            abi: this.abi,
            name
        });
        if (functionAbiItem === null || functionAbiItem === undefined) {
            throw new InvalidAbiItem(
                'ABIContract.getFunction()',
                `Function '${name}' not found in contract ABI.`,
                {
                    type: 'function',
                    value: name
                }
            );
        }
        return new ABIFunction(functionAbiItem as AbiFunction);
    }

    /**
     * Returns the event with the given name.
     * @param {string} name The event's name.
     * @returns {ABIEvent} The event with the given name.
     * @throws {InvalidAbiItem}
     */
    public getEvent(name: string): ABIEvent {
        const eventAbiItem = getAbiItem({
            abi: this.abi,
            name
        });
        if (eventAbiItem === null || eventAbiItem === undefined) {
            throw new InvalidAbiItem(
                'ABIContract.getEvent()',
                `Function '${name}' not found in contract ABI.`,
                {
                    type: 'event',
                    value: name
                }
            );
        }
        return new ABIEvent(eventAbiItem as AbiEvent);
    }

    /**
     * Encode function data that can be used to send a transaction.
     * @param {string} functionName The name of the function defined in the ABI.
     * @param {unknown[]} functionData The data to pass to the function.
     * @returns {Hex} The encoded data in hexadecimal that can be used to send a transaction.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public encodeFunctionInput(
        functionName: string,
        functionData?: unknown[]
    ): Hex {
        try {
            const functionAbiItem = getAbiItem({
                abi: this.abi,
                name: functionName
            });
            const functionAbi = new ABIFunction(functionAbiItem as AbiFunction);

            return functionAbi.encodeData(functionData);
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIContract.encodeFunctionInput()',
                `Encoding failed: Data format is invalid. Function data does not match the expected format for ABI type encoding.`,
                { functionName, functionData },
                error
            );
        }
    }

    /**
     * Decode the function data of an encoded function
     * @param {string} functionName The name of the function defined in the ABI.
     * @param {Hex} encodedFunctionInput The encoded function data.
     * @returns {DecodeFunctionDataReturnType} an array of the decoded function data
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public decodeFunctionInput(
        functionName: string,
        encodedFunctionInput: Hex
    ): DecodeFunctionDataReturnType {
        try {
            const functionAbiItem = getAbiItem({
                abi: this.abi,
                name: functionName
            });
            const functionAbi = new ABIFunction(functionAbiItem as AbiFunction);

            return functionAbi.decodeData(encodedFunctionInput);
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIContract.decodeFunctionInput()',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                { functionName, encodedFunctionInput },
                error
            );
        }
    }

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
    public decodeFunctionOutput(
        functionName: string,
        encodedFunctionOutput: Hex
    ): DecodeFunctionResultReturnType {
        try {
            const functionAbiItem = getAbiItem({
                abi: this.abi,
                name: functionName
            });
            const functionAbi = new ABIFunction(functionAbiItem as AbiFunction);

            return functionAbi.decodeResult(encodedFunctionOutput);
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIContract.decodeFunctionOutput()',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                { functionName, encodedFunctionOutput },
                error
            );
        }
    }

    /**
     * Encodes event log data based on the provided event name, and data to encode.
     * @param {string} eventName - The name of the event to be encoded.
     * @param {unknown[]} eventArgs - An array of data to be encoded in the event log.
     * @returns {ABIEventData} An object containing the encoded data and topics.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public encodeEventLog(
        eventName: string,
        eventArgs: unknown[]
    ): ABIEventData {
        try {
            const eventAbiItem = getAbiItem({
                abi: this.abi,
                name: eventName
            });
            const eventAbi = new ABIEvent(eventAbiItem as AbiEvent);
            return eventAbi.encodeEventLog(eventArgs);
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIContract.encodeEventLog()',
                `Encoding failed: Data format is invalid. Event data does not match the expected format for ABI type encoding.`,
                { eventName, dataToEncode: eventArgs },
                error
            );
        }
    }

    /**
     * Decodes event log data based on the provided event name, and data/topics to decode.
     * @param {string} eventName - The name of the event to be decoded.
     * @param {ABIEventData} eventToDecode - An object containing the data and topics to be decoded.
     * @returns {DecodeEventLogReturnType} The decoded data of the event log.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public decodeEventLog(
        eventName: string,
        eventToDecode: ABIEventData
    ): DecodeEventLogReturnType {
        try {
            const eventAbiItem = getAbiItem({
                abi: this.abi,
                name: eventName
            });
            const eventAbi = new ABIEvent(eventAbiItem as AbiEvent);
            return eventAbi.decodeEventLog(eventToDecode);
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIContract.encodeEventLog()',
                `Encoding failed: Data format is invalid. Event data does not match the expected format for ABI type encoding.`,
                { eventName, dataToDecode: eventToDecode },
                error
            );
        }
    }

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
    public parseLog(data: Hex, topics: Hex[]): DecodeEventLogReturnType {
        try {
            return ABIEvent.parseLog(this.abi, { data, topics });
        } catch (e) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIContract.parseLog()',
                `Decoding failed: Data must be a valid hex string encoding a compliant ABI type.`,
                { data, topics },
                e
            );
        }
    }

    /**
     *
     * Parses the log data and topics into an array of values.
     *
     * @param {Hex} data - The hexadecimal string of the data field in the log.
     * @param {Hex[]} topics - An array of hexadecimal strings representing the topics of the log.
     * @returns {unknown[]} - An array of values of the decoded log data.
     */
    public parseLogAsArray(data: Hex, topics: Hex[]): unknown[] {
        const eventLogDecoded = this.parseLog(data, topics);
        if (eventLogDecoded.args === undefined) {
            return [];
        }

        return this.parseObjectValues(eventLogDecoded.args);
    }
}

export { ABIContract };
