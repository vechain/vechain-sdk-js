import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiFragment,
    InvalidAbiSignatureFormat
} from '@vechain/sdk-errors';
import { ethers } from 'ethers';
import {
    type AbiEvent,
    type DecodeEventLogReturnType,
    encodeEventTopics,
    type EncodeEventTopicsReturnType,
    type Abi as ViemABI,
    decodeEventLog as viemDecodeEventLog,
    type Hex as ViemHex
} from 'viem';
import {
    Event as EthersEvent,
    type EventFragment,
    type FormatType,
    type Result
} from '../../abi';
import { Hex } from '../Hex';
import { ABIItem } from './ABIItem';

type Topics = [] | [signature: ViemHex, ...args: ViemHex[]];

/**
 * Represents a function call in the Event ABI.
 * @extends ABI
 */
class ABIEvent extends ABIItem {
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
                abi: [this.signature],
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

    /** DISCLAIMER: There is no equivalent to encodeEventLog in viem {@link https://viem.sh/docs/ethers-migration} Discussion started here {@link https://github.com/wevm/viem/discussions/2676} */

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
        const abiEvent = this.signature as unknown as AbiEvent;
        if (abiEvent.inputs.length < valuesToEncode.length) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'ABIEvent.encodeEventLog',
                'Encoding failed: Data format is invalid. Number of values to encode is greater than the inputs.',
                { valuesToEncode }
            );
        }

        try {
            return encodeEventTopics({
                abi: [this.signature],
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
}

// Backwards compatibility, this entire nested class should be removed as part of #1184
class Event<ABIType> {
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

    private readonly event: ABIEvent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly ethersEvent: any;
    public readonly fragment: EventFragment;
    constructor(abi: ABIType) {
        try {
            if (typeof abi === 'string') {
                const stringAbi =
                    abi.indexOf('event') === 0 ? abi : `event ${abi}`;
                this.event = new ABIEvent(
                    stringAbi.replace(' list', '').replace('tuple', '')
                );
            } else {
                this.event = new ABIEvent(abi as ViemABI);
            }
            this.ethersEvent = new EthersEvent(abi);
            this.fragment = ethers.EventFragment.from(abi);
        } catch (error) {
            throw new InvalidAbiFragment(
                'abi.Event constructor',
                'Initialization failed: Cannot create Event fragment. Event format is invalid.',
                {
                    type: 'event',
                    fragment: abi
                },
                error
            );
        }
    }

    public signatureHash(): string {
        return this.event.signatureHash;
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
        return this.event.stringSignature;
    }

    public decodeEventLog(data: { data: string; topics: string[] }): Result {
        try {
            const eventLogDecoded = this.event.decodeEventLog({
                data: Hex.of(data.data),
                topics: data.topics.map((topic) => Hex.of(topic))
            });

            if (eventLogDecoded.args === undefined) {
                return [] as unknown as Result;
            } else if (eventLogDecoded.args instanceof Object) {
                return Object.values(eventLogDecoded.args) as Result;
            }

            return eventLogDecoded as unknown as Result;
        } catch (error) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'abi.Event.decodeEventLog()',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                { data },
                error
            );
        }
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
        const encodedTopics = this.event.encodeFilterTopics(
            valuesToEncode
        ) as unknown as Array<string | undefined>;
        return encodedTopics.map((topic) =>
            topic === null ? undefined : topic
        );
    }
}

export { ABIEvent, Event };
