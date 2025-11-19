"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABIEvent = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const viem_1 = require("viem");
const Hex_1 = require("../Hex");
const ABI_1 = require("./ABI");
const ABIItem_1 = require("./ABIItem");
/**
 * Represents a function call in the Event ABI.
 * @extends ABIItem
 */
class ABIEvent extends ABIItem_1.ABIItem {
    abiEvent;
    constructor(signature) {
        try {
            super(signature);
            this.abiEvent = this.signature;
        }
        catch (error) {
            throw new sdk_errors_1.InvalidAbiItem('ABIEvent constructor', 'Initialization failed: Cannot create Event ABI. Event format is invalid.', {
                type: 'event',
                value: signature
            }, error);
        }
    }
    /**
     * Decode event log data using the event's ABI.
     *
     * @param abi - Event to decode.
     * @returns Decoding results.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    static parseLog(abi, eventData) {
        try {
            return (0, viem_1.decodeEventLog)({
                abi,
                data: eventData.data.toString(),
                topics: eventData.topics.map((topic) => {
                    if (topic === null) {
                        return topic;
                    }
                    else if (Array.isArray(topic)) {
                        return topic.map((t) => t.toString());
                    }
                    return topic.toString();
                })
            });
        }
        catch (error) {
            throw new sdk_errors_1.InvalidAbiDataToEncodeOrDecode('ABIEvent.parseLog', 'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.', {
                data: {
                    abi,
                    data: eventData.data,
                    topics: eventData.topics
                }
            }, error);
        }
    }
    /**
     * Decode event log data using the event's ABI.
     *
     * @param event - Event to decode.
     * @returns Decoding results.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    decodeEventLog(event) {
        try {
            return ABIEvent.parseLog([this.abiEvent], event);
        }
        catch (error) {
            throw new sdk_errors_1.InvalidAbiDataToEncodeOrDecode('ABIEvent.decodeEventLog', 'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.', { data: event }, error);
        }
    }
    /**
     * Decode event log data as an array of values
     * @param {ABIEvent} event The data to decode.
     * @returns {unknown[]} The decoded data as array of values.
     */
    decodeEventLogAsArray(event) {
        const rawDecodedData = this.decodeEventLog(event);
        if (rawDecodedData.args === undefined) {
            return [];
        }
        return this.parseObjectValues(rawDecodedData.args);
    }
    /**
     * Encode event log data returning the encoded data and topics.
     * @param dataToEncode - Data to encode.
     * @returns {ABIEventData} Encoded data along with topics.
     * @remarks There is no equivalent to encodeEventLog in viem {@link https://viem.sh/docs/ethers-migration}. Discussion started here {@link https://github.com/wevm/viem/discussions/2676}.
     */
    encodeEventLog(dataToEncode) {
        try {
            const topics = this.encodeFilterTopics(dataToEncode);
            const dataTypes = [];
            const dataValues = [];
            this.abiEvent.inputs.forEach((param, index) => {
                if (param.indexed ?? false) {
                    // Skip indexed parameters
                    return;
                }
                const value = dataToEncode[index];
                dataTypes.push(param);
                dataValues.push(value);
            });
            return {
                data: ABI_1.ABI.of(dataTypes, dataValues).toHex(),
                topics: topics.map((topic) => {
                    if (topic === null) {
                        return topic;
                    }
                    else if (Array.isArray(topic)) {
                        return topic.map((t) => Hex_1.Hex.of(t));
                    }
                    return Hex_1.Hex.of(topic);
                })
            };
        }
        catch (error) {
            throw new sdk_errors_1.InvalidAbiDataToEncodeOrDecode('ABIEvent.encodeEventLog', 'Encoding failed: Data format is invalid. Event data must be correctly formatted for ABI-compliant encoding.', { dataToEncode }, error);
        }
    }
    /**
     * Encode event log topics using the event's ABI.
     *
     * @param valuesToEncode - values to encode as topics. Non-indexed values are ignored.
     *                         Only the values of the indexed parameters are needed.
     * @returns Encoded topics array.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    encodeFilterTopics(valuesToEncode) {
        const valuesToEncodeLength = Array.isArray(valuesToEncode)
            ? valuesToEncode.length
            : Object.values(valuesToEncode ?? {}).length;
        if (this.abiEvent.inputs.length < valuesToEncodeLength) {
            throw new sdk_errors_1.InvalidAbiDataToEncodeOrDecode('ABIEvent.encodeEventLog', 'Encoding failed: Data format is invalid. Number of values to encode is greater than the inputs.', { valuesToEncode });
        }
        try {
            return (0, viem_1.encodeEventTopics)({
                abi: [this.abiEvent],
                args: valuesToEncode
            });
        }
        catch (error) {
            throw new sdk_errors_1.InvalidAbiDataToEncodeOrDecode('ABIEvent.encodeEventLog', 'Encoding failed: Data format is invalid. Event topics values must be correctly formatted for ABI-compliant encoding.', { valuesToEncode }, error);
        }
    }
    /**
     * Encode event log topics using the event's ABI, replacing null values with undefined.
     * @param valuesToEncode - values to encode as topics. Non-indexed values are ignored.
     *                         Only the values of the indexed parameters are needed.
     * @returns Encoded topics array.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    encodeFilterTopicsNoNull(valuesToEncode) {
        const encodedTopics = this.encodeFilterTopics(valuesToEncode);
        return encodedTopics.map((topic) => topic === null ? undefined : topic);
    }
}
exports.ABIEvent = ABIEvent;
