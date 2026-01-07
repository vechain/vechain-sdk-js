import { type Address, type Hex } from '@common/vcdm';
import { type EventLogResponse } from '@thor/thorest/logs/response/EventLogResponse';
import { LogMeta } from './LogMeta';
import { DecodedEventLog } from './DecodedEventLog';
import { AbiEvent, decodeEventLog } from 'viem';

class EventLog {
    /**
     * The address of the contract that produces the event (bytes20).
     */
    readonly address: Address;

    /**
     * Topics are indexed parameters to an event. The first topic is always the event signature.
     */
    readonly topics: Hex[];

    /**
     * The data associated with the event.
     */
    readonly data: Hex;

    /**
     * The event or transfer log metadata such as block number, block timestamp, etc.
     */
    readonly meta: LogMeta;

    /**
     * Creates a new EventLog instance.
     * @param address - The address of the contract that produces the event.
     * @param topics - The topics of the event.
     * @param data - The data associated with the event.
     * @param meta - The event or transfer log metadata such as block number, block timestamp, etc.
     */
    constructor(address: Address, topics: Hex[], data: Hex, meta: LogMeta) {
        this.address = address;
        this.topics = topics;
        this.data = data;
        this.meta = meta;
    }

    /**
     * Creates a new EventLog instance from an EventLogResponse.
     * @param eventLog - The EventLogResponse to create the EventLog from.
     * @returns A new EventLog instance.
     */
    static of(eventLog: EventLogResponse): EventLog {
        return new EventLog(
            eventLog.address,
            eventLog.topics,
            eventLog.data,
            new LogMeta(eventLog.meta)
        );
    }

    /**
     * Decodes an event log using the provided ABI event item.
     * @param eventLog - The event log to decode.
     * @param eventAbi - The ABI event item to decode the event log.
     * @returns The decoded event log.
     */
    public decode(eventAbi: AbiEvent): DecodedEventLog {
        const normalizedTopics = this.topics.map(
            (topic) => topic.toString() as `0x${string}`
        );
        const decoded = decodeEventLog({
            abi: [eventAbi],
            data: this.data.toString() as `0x${string}`,
            topics: [normalizedTopics[0], ...normalizedTopics.slice(1)]
        });
        return DecodedEventLog.of(this, decoded);
    }
}

export { EventLog };
