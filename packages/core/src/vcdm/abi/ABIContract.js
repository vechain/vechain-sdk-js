"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABIContract = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const viem_1 = require("viem");
const ABI_1 = require("./ABI");
const ABIEvent_1 = require("./ABIEvent");
const ABIFunction_1 = require("./ABIFunction");
class ABIContract extends ABI_1.ABI {
    abi;
    viemABI;
    constructor(abi) {
        super();
        this.abi = abi;
        this.viemABI = abi;
    }
    /**
     * Creates an ABIContract instance from a viem ABI.
     * @param {ViemABI} abi representation of the contract.
     * @returns New instance of ABIContract.
     */
    static ofAbi(abi) {
        return new ABIContract(abi);
    }
    /**
     * Returns the function with the given name.
     * @param {string} name The function's name.
     * @returns {ABIFunction} The function with the given name.
     * @throws {InvalidAbiItem}
     */
    getFunction(name) {
        const functionAbiItem = (0, viem_1.getAbiItem)({
            abi: this.viemABI,
            name: name
        });
        if (functionAbiItem === null || functionAbiItem === undefined) {
            throw new sdk_errors_1.InvalidAbiItem('ABIContract.getFunction()', `Function '${name}' not found in contract ABI.`, {
                type: 'function',
                value: name
            });
        }
        return new ABIFunction_1.ABIFunction(functionAbiItem);
    }
    /**
     * Returns the event with the given name.
     * @param {string} name The event's name.
     * @returns {ABIEvent} The event with the given name.
     * @throws {InvalidAbiItem}
     */
    getEvent(name) {
        const eventAbiItem = (0, viem_1.getAbiItem)({
            abi: this.viemABI,
            name: name
        });
        if (eventAbiItem === null || eventAbiItem === undefined) {
            throw new sdk_errors_1.InvalidAbiItem('ABIContract.getEvent()', `Function '${name}' not found in contract ABI.`, {
                type: 'event',
                value: name
            });
        }
        return new ABIEvent_1.ABIEvent(eventAbiItem);
    }
    /**
     * Encode function data that can be used to send a transaction.
     * @param {string} functionName The name of the function defined in the ABI.
     * @param {unknown[]} functionData The data to pass to the function.
     * @returns {Hex} The encoded data in hexadecimal that can be used to send a transaction.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    encodeFunctionInput(functionName, functionData) {
        try {
            const functionAbiItem = (0, viem_1.getAbiItem)({
                abi: this.viemABI,
                name: functionName
            });
            const functionAbi = new ABIFunction_1.ABIFunction(functionAbiItem);
            return functionAbi.encodeData(functionData);
        }
        catch (error) {
            throw new sdk_errors_1.InvalidAbiDataToEncodeOrDecode('ABIContract.encodeFunctionInput()', `Encoding failed: Data format is invalid. Function data does not match the expected format for ABI type encoding.`, { functionName, functionData }, error);
        }
    }
    /**
     * Decode the function data of an encoded function
     * @param {string} functionName The name of the function defined in the ABI.
     * @param {Hex} encodedFunctionInput The encoded function data.
     * @returns {DecodeFunctionDataReturnType} an array of the decoded function data
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    decodeFunctionInput(functionName, encodedFunctionInput) {
        try {
            const functionAbiItem = (0, viem_1.getAbiItem)({
                abi: this.viemABI,
                name: functionName
            });
            const functionAbi = new ABIFunction_1.ABIFunction(functionAbiItem);
            return functionAbi.decodeData(encodedFunctionInput);
        }
        catch (error) {
            throw new sdk_errors_1.InvalidAbiDataToEncodeOrDecode('ABIContract.decodeFunctionInput()', 'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.', { functionName, encodedFunctionInput }, error);
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
    decodeFunctionOutput(functionName, encodedFunctionOutput) {
        try {
            const functionAbiItem = (0, viem_1.getAbiItem)({
                abi: this.viemABI,
                name: functionName
            });
            const functionAbi = new ABIFunction_1.ABIFunction(functionAbiItem);
            return functionAbi.decodeResult(encodedFunctionOutput);
        }
        catch (error) {
            throw new sdk_errors_1.InvalidAbiDataToEncodeOrDecode('ABIContract.decodeFunctionOutput()', 'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.', { functionName, encodedFunctionOutput }, error);
        }
    }
    /**
     * Encodes event log data based on the provided event name, and data to encode.
     * @param {string} eventName - The name of the event to be encoded.
     * @param {unknown[]} eventArgs - An array of data to be encoded in the event log.
     * @returns {ABIEventData} An object containing the encoded data and topics.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    encodeEventLog(eventName, eventArgs) {
        try {
            const eventAbiItem = (0, viem_1.getAbiItem)({
                abi: this.viemABI,
                name: eventName
            });
            const eventAbi = new ABIEvent_1.ABIEvent(eventAbiItem);
            return eventAbi.encodeEventLog(eventArgs);
        }
        catch (error) {
            throw new sdk_errors_1.InvalidAbiDataToEncodeOrDecode('ABIContract.encodeEventLog()', `Encoding failed: Data format is invalid. Event data does not match the expected format for ABI type encoding.`, { eventName, dataToEncode: eventArgs }, error);
        }
    }
    /**
     * Decodes event log data based on the provided event name, and data/topics to decode.
     * @param {string} eventName - The name of the event to be decoded.
     * @param {ABIEventData} eventToDecode - An object containing the data and topics to be decoded.
     * @returns {DecodeEventLogReturnType} The decoded data of the event log.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    decodeEventLog(eventName, eventToDecode) {
        try {
            const eventAbiItem = (0, viem_1.getAbiItem)({
                abi: this.viemABI,
                name: eventName
            });
            const eventAbi = new ABIEvent_1.ABIEvent(eventAbiItem);
            return eventAbi.decodeEventLog(eventToDecode);
        }
        catch (error) {
            throw new sdk_errors_1.InvalidAbiDataToEncodeOrDecode('ABIContract.encodeEventLog()', `Encoding failed: Data format is invalid. Event data does not match the expected format for ABI type encoding.`, { eventName, dataToDecode: eventToDecode }, error);
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
    parseLog(data, topics) {
        try {
            return ABIEvent_1.ABIEvent.parseLog(this.abi, {
                data,
                topics
            });
        }
        catch (e) {
            throw new sdk_errors_1.InvalidAbiDataToEncodeOrDecode('ABIContract.parseLog()', `Decoding failed: Data must be a valid hex string encoding a compliant ABI type.`, { data, topics }, e);
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
    parseLogAsArray(data, topics) {
        const eventLogDecoded = this.parseLog(data, topics);
        if (eventLogDecoded.args === undefined) {
            return [];
        }
        return this.parseObjectValues(eventLogDecoded.args);
    }
}
exports.ABIContract = ABIContract;
