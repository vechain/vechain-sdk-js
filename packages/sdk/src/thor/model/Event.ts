import { Address, HexUInt, type Hex } from '@common/vcdm';
import { type EventJSON } from '@/json';
import { IllegalArgumentError } from '@errors';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/blocks/XEvent.ts!';

/**
 * [Event](http://localhost:8669/doc/stoplight-ui/#/schemas/Event)
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
    readonly data: HexUInt;

    /**
     * Constructs an instance of the class using the provided JSON object.
     *
     * @param {EventJSON} json - The JSON object containing the required fields to initialize the instance.
     * @throws {IllegalArgumentError} Throws an error if the JSON object cannot be parsed or contains invalid values.
     */
    constructor(json: EventJSON) {
        try {
            this.address = Address.of(json.address);
            this.topics = json.topics.map(
                (topic: string): HexUInt => HexUInt.of(topic)
            );
            this.data = HexUInt.of(json.data);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: EventJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of the class into an EventJSON representation.
     *
     * @return {EventJSON} The JSON object representing the current instance.
     */
    toJSON(): EventJSON {
        return {
            address: this.address.toString(),
            topics: this.topics.map((topic: HexUInt): string =>
                topic.toString()
            ),
            data: this.data.toString()
        } satisfies EventJSON;
    }
}

export { Event };
