import { type Address, type Hex } from '@common/vcdm';
import { type EventResponse } from '@thor/thorest/common';

/**
 * Represents an event emitted by a contract.
 */
class Event {
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
     * Create an event from the given address, topics and data.
     *
     * @param address - The address of the contract that produces the event
     * @param topics - Topics are indexed parameters to an event. The first topic is always the event signature.
     * @param data - The data associated with the event.
     */
    constructor(address: Address, topics: Hex[], data: Hex) {
        this.address = address;
        this.topics = topics;
        this.data = data;
    }

    /**
     * Create an event from the given event response.
     *
     * @param response - The event response to create the event from.
     * @returns The event.
     */
    static of(response: EventResponse): Event {
        return new Event(response.address, response.topics, response.data);
    }
}

export { Event };
