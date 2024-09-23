import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiItem
} from '@vechain/sdk-errors';
import { type Result } from 'ethers';
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
import { ABIEthersEvent } from './ABIEthersEvent';
import { ABIItem } from './ABIItem';

type Topics = [] | [signature: ViemHex, ...args: ViemHex[]];

interface ABIEventData {
    data: Hex;
    topics: Hex[];
}

/**
 * Represents a function call in the Event ABI.
 * @extends ABIItem
 */
class ABIEvent extends ABIItem {
    private readonly ethersEvent: ABIEthersEvent<string | AbiEvent>;
    public constructor(signature: string);
    public constructor(signature: AbiEvent);
    public constructor(signature: string | AbiEvent) {
        try {
            super(signature);
            this.ethersEvent = new ABIEthersEvent(signature);
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
        data: Hex,
        topics: Hex[]
    ): DecodeEventLogReturnType {
        try {
            return viemDecodeEventLog({
                abi,
                data: data.toString() as ViemHex,
                topics: topics.map((topic) => topic.toString()) as Topics
            });
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIEvent.parseLog',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                {
                    data: {
                        abi,
                        data,
                        topics
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
            return ABIEvent.parseLog(
                [this.signature],
                event.data,
                event.topics
            );
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
     * DISCLAIMER: This method will be eventually deprecated in favour of viem via #1184.
     * Decode event log data in a ethers format.
     * @param {ABIEvent} event The data to decode.
     * @returns {Result} The decoded data.
     * @deprecated
     */
    public decodeEthersEventLog(event: ABIEventData): Result {
        try {
            const rawDecodedData = this.decodeEventLog(event);

            if (rawDecodedData?.args === undefined) {
                return [] as unknown as Result;
            } else if (rawDecodedData.args instanceof Object) {
                return Object.values(rawDecodedData.args) as Result;
            }
            return rawDecodedData as unknown as Result;
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIEvent.decodeEthersEventLog',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                { data: event },
                error
            );
        }
    }

    /** DISCLAIMER: There is no equivalent to encodeEventLog in viem {@link https://viem.sh/docs/ethers-migration}
     * Discussion started here {@link https://github.com/wevm/viem/discussions/2676}.
     * @param dataToEncode - Data to encode.
     * @returns Encoded data along with topics.
     */
    public encodeEventLog<TValue>(dataToEncode: TValue[]): ABIEventData {
        const { data, topics } = this.ethersEvent.encodeEventLog(dataToEncode);
        return {
            data: Hex.of(data),
            topics: topics.map((topic) => Hex.of(topic))
        };
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
        const abiEvent = this.signature;
        if (abiEvent.inputs.length < valuesToEncode.length) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIEvent.encodeEventLog',
                'Encoding failed: Data format is invalid. Number of values to encode is greater than the inputs.',
                { valuesToEncode }
            );
        }

        try {
            return encodeEventTopics({
                abi: [abiEvent],
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
