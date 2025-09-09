import { type Address, type Hex } from '@common/vcdm';
import { type EventCriteriaJSON } from '@thor/thorest/json';
import { type EventCriteria } from '@thor/thor-client/model/logs/EventCriteria';

/**
 * Filter criteria for event logs.
 */
class EventCriteriaRequest {
    /**
     * The address of the contract that emits the event.
     */
    readonly address?: Address;

    /**
     * The keccak256 hash representing the event signature.
     */
    readonly topic0?: Hex;

    /**
     * Filter by first indexed parameter.
     */
    readonly topic1?: Hex;

    /**
     * Filter by second indexed parameter.
     */
    readonly topic2?: Hex;

    /**
     * Filter by third indexed parameter.
     */
    readonly topic3?: Hex;

    /**
     * Filter by fourth indexed parameter.
     */
    readonly topic4?: Hex;

    /**
     * Constructs an instance of the class.
     *
     * @param {Address} address - The address of the contract that emits the event.
     * @param {Hex} topic0 - The keccak256 hash representing the event signature.
     * @param {Hex} topic1 - Filter for first indexed parameter.
     * @param {Hex} topic2 - Filter for second indexed parameter.
     * @param {Hex} topic3 - Filter for third indexed parameter.
     * @param {Hex} topic4 - Filter for fourth indexed parameter.
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
     * Constructs an instance of the class from a EventCriteria.
     *
     * @param {EventCriteria} criteria - The EventCriteria to convert to a EventCriteriaRequest.
     * @return {EventCriteriaRequest} The EventCriteriaRequest instance created from the EventCriteria.
     */
    static of(criteria: EventCriteria): EventCriteriaRequest {
        return new EventCriteriaRequest(
            criteria.address ?? undefined,
            criteria.topic0 ?? undefined,
            criteria.topic1 ?? undefined,
            criteria.topic2 ?? undefined,
            criteria.topic3 ?? undefined,
            criteria.topic4 ?? undefined
        );
    }

    /**
     * Converts into a JSON representation.
     *
     * @return {EventCriteriaJSON} The JSON object representing the current EventCriteriaRequest instance.
     */
    toJSON(): EventCriteriaJSON {
        return {
            address: this.address?.toString(),
            topic0: this.topic0?.toString(),
            topic1: this.topic1?.toString(),
            topic2: this.topic2?.toString(),
            topic3: this.topic3?.toString(),
            topic4: this.topic4?.toString()
        } satisfies EventCriteriaJSON;
    }
}

export { EventCriteriaRequest };
