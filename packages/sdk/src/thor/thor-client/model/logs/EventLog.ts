import { type Address, type Hex } from '@vcdm';
import { type EventLogResponse } from '@thor/logs/response/EventLogResponse';
import { LogMeta } from './LogMeta';

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
}

export { EventLog };
