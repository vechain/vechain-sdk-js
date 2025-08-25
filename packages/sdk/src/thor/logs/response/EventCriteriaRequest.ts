import { type Address, type Hex, HexUInt32 } from '@vcdm';
import { type EventCriteriaJSON } from '@thor/json';
import { IllegalArgumentError } from '@errors';
import { type EventCriteria } from '@thor/thor-client/model/logs/EventCriteria';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/sdk/src/thor/logs/EventCriteria.ts!';

/**
 * [EventCriteria](http://localhost:8669/doc/stoplight-ui/#/schemas/EventCriteria)
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
     * Constructs an instance of the class with the given event criteria represented as a JSON object.
     *
     * @param {EventCriteriaJSON} json - The JSON object containing event criteria.
     * Each property in the JSON object is parsed and converted to its respective type.
     * @throws {IllegalArgumentError} Thrown when the provided JSON object contains invalid or unparsable data.
     */
    constructor(criteria: EventCriteria) {
        try {
            this.address = criteria.address;
            this.topic0 = criteria.topic0;
            this.topic1 = criteria.topic1;
            this.topic2 = criteria.topic2;
            this.topic3 = criteria.topic3;
            this.topic4 = criteria.topic4;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: EventCriteriaJSON)`,
                'Unable to construct EventCriteriaRequest from EventCriteria',
                { criteria },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current EventCriteria instance into a JSON representation.
     *
     * @return {EventCriteriaJSON} The JSON object representing the current EventCriteria instance.
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
