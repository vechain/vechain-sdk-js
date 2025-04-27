import { Address, HexUInt, IllegalArgumentError } from '../../../../core/src';
import { type _EventJSON } from './_EventJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/blocks/_Event.ts'; // todo: check once moved

/**
 * [Event](http://localhost:8669/doc/stoplight-ui/#/schemas/Event)
 */
// eslint-disable-next-line sonarjs/class-name
class _Event {
    /**
     * he address of the contract that produces the event (bytes20).
     */
    readonly address: Address;

    /**
     * Topics are indexed parameters to an event. The first topic is always the event signature.
     */
    readonly topics: HexUInt[];

    /**
     * The data associated with the event.
     */
    readonly data: HexUInt;

    /**
     * Constructs an instance of the class using the provided _EventJSON object.
     *
     * @param {_EventJSON} json - The JSON object containing the required fields to initialize the instance.
     * @throws {IllegalArgumentError} Throws an error if the JSON object cannot be parsed or contains invalid values.
     */
    constructor(json: _EventJSON) {
        try {
            this.address = Address.of(json.address);
            this.topics = json.topics.map(
                (topic: string): HexUInt => HexUInt.of(topic)
            );
            this.data = HexUInt.of(json.data);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: _EventJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of the class into a _EventJSON representation.
     *
     * @return {_EventJSON} The JSON object representing the current instance.
     */
    toJSON(): _EventJSON {
        return {
            address: this.address.toString(),
            topics: this.topics.map((topic: HexUInt): string =>
                topic.toString()
            ),
            data: this.data.toString()
        } satisfies _EventJSON;
    }
}

export { _Event };
