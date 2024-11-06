import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiItem
} from '@vechain/sdk-errors';
import { type AbiEventParameter } from 'abitype';
import {
    type AbiEvent,
    type ContractEventName,
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
class ABIEvent<
    TAbi extends ViemABI = ViemABI,
    TEventName extends ContractEventName<TAbi> = ContractEventName<TAbi>
> extends ABIItem {
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
     * @param abi - Event to decode.
     * @returns Decoding results.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public static parseLog<
        TAbi extends ViemABI,
        TEventName extends ContractEventName<TAbi>
    >(
        abi: TAbi,
        eventData: ABIEventData
    ): DecodeEventLogReturnType<TAbi, TEventName> {
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
    public decodeEventLog(
        event: ABIEventData
    ): DecodeEventLogReturnType<TAbi, TEventName> {
        try {
            return ABIEvent.parseLog([this.abiEvent] as ViemABI, event);
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
        const rawDecodedData = this.decodeEventLog(event);

        if (rawDecodedData.args === undefined) {
            return [];
        }

        return this.parseObjectValues(rawDecodedData.args as unknown as object);
    }

    /**
     * Encode event log data returning the encoded data and topics.
     * @param dataToEncode - Data to encode.
     * @returns {ABIEventData} Encoded data along with topics.
     * @remarks There is no equivalent to encodeEventLog in viem {@link https://viem.sh/docs/ethers-migration}. Discussion started here {@link https://github.com/wevm/viem/discussions/2676}.
     */
    public encodeEventLog(dataToEncode: unknown[]): ABIEventData {
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
    public encodeFilterTopics(
        valuesToEncode: Record<string, unknown> | unknown[] | undefined
    ): EncodeEventTopicsReturnType {
        const valuesToEncodeLength = Array.isArray(valuesToEncode)
            ? valuesToEncode.length
            : Object.values(valuesToEncode ?? {}).length;
        if (this.abiEvent.inputs.length < valuesToEncodeLength) {
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
    public encodeFilterTopicsNoNull(
        valuesToEncode: Record<string, unknown> | unknown[] | undefined
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
