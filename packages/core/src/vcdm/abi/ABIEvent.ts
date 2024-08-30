import { InvalidAbiDataToEncodeOrDecode } from '@vechain/sdk-errors';
import {
    type DecodeEventLogReturnType,
    encodeEventTopics,
    type EncodeEventTopicsReturnType,
    type Abi as ViemABI,
    decodeEventLog as viemDecodeEventLog,
    type Hex as ViemHex
} from 'viem';
import { abi as ethersAbi, type FormatType, type Result } from '../../abi';
import { Hex } from '../Hex';
import { ABI } from './ABI';

type Topics = [] | [signature: ViemHex, ...args: ViemHex[]];

/**
 * Represents a function call in the Event ABI.
 * @extends ABI
 */
class ABIEvent extends ABI {
    private readonly eventAbiRepresentation: ViemABI;
    public constructor(signature: string) {
        super(signature);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        this.eventAbiRepresentation = this.abiRepresentation as ViemABI;
    }

    /**
     * Decode event log data using the event's ABI.
     *
     * @param event - Event to decode.
     * @returns Decoding results.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public decodeEventLog(event: {
        data: Hex;
        topics: Hex[];
    }): DecodeEventLogReturnType {
        try {
            return viemDecodeEventLog({
                abi: this.eventAbiRepresentation,
                data: event.data.toString() as ViemHex,
                topics: event.topics.map((topic) => topic.toString()) as Topics
            });
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIEvent.decodeEventLog',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                { data: event },
                error
            );
        }
    }

    // TODO: Add encodeEventLog method

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
        try {
            return encodeEventTopics({
                abi: this.eventAbiRepresentation,
                args: valuesToEncode
            });
        } catch (e) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIEvent.encodeEventLog',
                'Encoding failed: Data format is invalid. Event topics values must be correctly formatted for ABI-compliant encoding.',
                { valuesToEncode },
                e
            );
        }
    }
}
class Event<ABIType> {
    private readonly event: ABIEvent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly ethersEvent: any;
    constructor(abi: ABIType) {
        this.event = new ABIEvent(abi as unknown as string);
        this.ethersEvent = new ethersAbi.Event(abi);
    }

    public signatureHash(): string {
        return this.event.signatureHash;
    }

    public signature(_formatType: FormatType): string {
        return this.event.signature;
    }

    // TODO: review this method
    public decodeEventLog(data: { data: string; topics: string[] }): Result {
        return this.event.decodeEventLog({
            data: Hex.of(data.data),
            topics: data.topics.map((topic) => Hex.of(topic))
        }) as unknown as Result;
    }

    public encodeEventLog<TValue>(dataToEncode: TValue[]): {
        data: string;
        topics: string[];
    } {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        return this.ethersEvent.encodeEventLog(dataToEncode);
    }

    public encodeFilterTopics<TValue>(
        valuesToEncode: TValue[]
    ): Array<string | undefined> {
        return this.event.encodeFilterTopics(
            valuesToEncode
        ) as unknown as Array<string | undefined>;
    }
}

export { ABIEvent, Event };
