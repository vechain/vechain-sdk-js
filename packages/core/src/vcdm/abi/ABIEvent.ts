import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiItem
} from '@vechain/sdk-errors';
import { type AbiEventParameter } from 'abitype';
import {
    type AbiEvent,
    type DecodeEventLogReturnType,
    encodeEventTopics,
    type EncodeEventTopicsReturnType,
    type Abi as ViemABI,
    decodeEventLog as viemDecodeEventLog,
    type Hex as ViemHex
} from 'viem';
import { Hex } from '../Hex';
import { ABI } from './ABI';
import { ABIItem } from './ABIItem';

type Topics = [] | [signature: ViemHex, ...args: ViemHex[]];

interface ABIEventData {
    data: Hex;
    topics: Array<null | Hex | Hex[]>;
}

/**
 * Represents a function call in the Event ABI.
 * @extends ABIItem
 */
class ABIEvent extends ABIItem {
    private readonly abiEvent: AbiEvent;
    public constructor(signature: string);
    public constructor(signature: AbiEvent);
    public constructor(signature: string | AbiEvent) {
        try {
            super(signature);
            this.abiEvent = this.signature as AbiEvent;
        } catch (error) {
            throw new InvalidAbiItem(
                'ABIEvent constructor',
                'Initialization failed: Cannot create Event ABI. Event format is invalid.',
                {
                    type: 'event',
                    value: signature
                },
                error
            );
        }
    }

    /**
     * Decode event log data using the event's ABI.
     *
     * @param event - Event to decode.
     * @returns Decoding results.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public static parseLog(
        abi: ViemABI,
        eventData: ABIEventData
    ): DecodeEventLogReturnType {
        try {
            return viemDecodeEventLog({
                abi,
                data: eventData.data.toString() as ViemHex,
                topics: eventData.topics.map((topic) => {
                    if (topic === null) {
                        return topic;
                    } else if (Array.isArray(topic)) {
                        return topic.map((t) => t.toString());
                    }
                    return topic.toString();
                }) as Topics
            });
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIEvent.parseLog',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                {
                    data: {
                        abi,
                        data: eventData.data,
                        topics: eventData.topics
                    }
                },
                error
            );
        }
    }

    /**
     * Decode event log data using the event's ABI.
     *
     * @param event - Event to decode.
     * @returns Decoding results.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public decodeEventLog(event: ABIEventData): DecodeEventLogReturnType {
        try {
            return ABIEvent.parseLog([this.abiEvent], event);
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIEvent.decodeEventLog',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                { data: event },
                error
            );
        }
    }

    /**
     * Decode event log data as an array of values
     * @param {ABIEvent} event The data to decode.
     * @returns {unknown[]} The decoded data as array of values.
     */
    public decodeEventLogAsArray(event: ABIEventData): unknown[] {
        try {
            const rawDecodedData = this.decodeEventLog(event);

            if (rawDecodedData.args === undefined) {
                return [];
            } else if (rawDecodedData.args instanceof Object) {
                return Object.values(rawDecodedData.args);
            }
            return rawDecodedData.args as unknown[];
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIEvent.decodeEventLogAsArray',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                { data: event },
                error
            );
        }
    }

    /**
     * Encode event log data returning the encoded data and topics.
     * @param dataToEncode - Data to encode.
     * @returns {ABIEventData} Encoded data along with topics.
     * @remarks There is no equivalent to encodeEventLog in viem {@link https://viem.sh/docs/ethers-migration}. Discussion started here {@link https://github.com/wevm/viem/discussions/2676}.
     */
    public encodeEventLog<TValue>(dataToEncode: TValue[]): ABIEventData {
        try {
            const topics = this.encodeFilterTopics(dataToEncode);
            const dataTypes: AbiEventParameter[] = [];
            const dataValues: unknown[] = [];
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
                data: ABI.of(dataTypes, dataValues).toHex(),
                topics: topics.map((topic) => {
                    if (topic === null) {
                        return topic;
                    } else if (Array.isArray(topic)) {
                        return topic.map((t) => Hex.of(t));
                    }
                    return Hex.of(topic);
                })
            };
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIEvent.encodeEventLog',
                'Encoding failed: Data format is invalid. Event data must be correctly formatted for ABI-compliant encoding.',
                { dataToEncode },
                error
            );
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
    public encodeFilterTopics<TValue>(
        valuesToEncode: TValue[]
    ): EncodeEventTopicsReturnType {
        if (this.abiEvent.inputs.length < valuesToEncode.length) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIEvent.encodeEventLog',
                'Encoding failed: Data format is invalid. Number of values to encode is greater than the inputs.',
                { valuesToEncode }
            );
        }

        try {
            return encodeEventTopics({
                abi: [this.abiEvent],
                args: valuesToEncode
            });
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIEvent.encodeEventLog',
                'Encoding failed: Data format is invalid. Event topics values must be correctly formatted for ABI-compliant encoding.',
                { valuesToEncode },
                error
            );
        }
    }

    /**
     * Encode event log topics using the event's ABI, replacing null values with undefined.
     * @param valuesToEncode - values to encode as topics. Non-indexed values are ignored.
     *                         Only the values of the indexed parameters are needed.
     * @returns Encoded topics array.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public encodeFilterTopicsNoNull<TValue>(
        valuesToEncode: TValue[]
    ): Array<string | undefined> {
        const encodedTopics = this.encodeFilterTopics(
            valuesToEncode
        ) as unknown as Array<string | undefined>;
        return encodedTopics.map((topic) =>
            topic === null ? undefined : topic
        );
    }
}

export { ABIEvent, type ABIEventData };
