import { Address, type AddressLike, type Hex } from '@common/vcdm';

/**
 * [EventCriteria](http://localhost:8669/doc/stoplight-ui/#/schemas/EventCriteria)
 */
class EventCriteria {
    /**
     * The address of the contract that emits the event.
     */
    readonly address?: Address;

    /**
     * The keccak256 hash representing the event signature.
     */
    readonly topic0?: Hex;

    /**
     * Filters events based on the 1st parameter in the event.
     */
    readonly topic1?: Hex;

    /**
     * Filters events based on the 2nd parameter in the event.
     */
    readonly topic2?: Hex;

    /**
     * Filters events based on the 3rd parameter in the event.
     */
    readonly topic3?: Hex;

    /**
     * Filters events based on the 4th parameter in the event.
     */
    readonly topic4?: Hex;

    /**
     * Constructs a new EventCriteria instance.
     *
     * @param address - The address of the contract that emits the event.
     * @param topic0 - The keccak256 hash representing the event signature.
     * @param topic1 - Filters events based on the 1st parameter in the event.
     * @param topic2 - Filters events based on the 2nd parameter in the event.
     * @param topic3 - Filters events based on the 3rd parameter in the event.
     * @param topic4 - Filters events based on the 4th parameter in the event.
     */
    constructor(
        address?: Address,
        topic0?: Hex,
        topic1?: Hex,
        topic2?: Hex,
        topic3?: Hex,
        topic4?: Hex
    ) {
        this.address = address;
        this.topic0 = topic0;
        this.topic1 = topic1;
        this.topic2 = topic2;
        this.topic3 = topic3;
        this.topic4 = topic4;
    }

    /**
     * Creates a new EventCriteria instance.
     *
     * @param address - The address of the contract that emits the event.
     * @param topic0 - The keccak256 hash representing the event signature.
     * @param topic1 - Filters events based on the 1st parameter in the event.
     * @param topic2 - Filters events based on the 2nd parameter in the event.
     * @param topic3 - Filters events based on the 3rd parameter in the event.
     * @param topic4 - Filters events based on the 4th parameter in the event.
     * @return {EventCriteria} A new EventCriteria instance.
     */
    static of(
        address?: AddressLike,
        topic0?: Hex,
        topic1?: Hex,
        topic2?: Hex,
        topic3?: Hex,
        topic4?: Hex
    ): EventCriteria {
        const normalizedAddress =
            address !== undefined ? Address.of(address) : undefined;
        return new EventCriteria(
            normalizedAddress,
            topic0,
            topic1,
            topic2,
            topic3,
            topic4
        );
    }
}

export { EventCriteria };
