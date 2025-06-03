import { Address, HexUInt, IllegalArgumentError } from '@vechain/sdk-core';
import { XEventJSON } from '@thor/model/XEventJSON';


/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/blocks/XEvent.ts!'; // todo: check once moved

/**
 * [Event](http://localhost:8669/doc/stoplight-ui/#/schemas/Event)
 */
// eslint-disable-next-line sonarjs/class-name
class XEvent {
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
     * Constructs an instance of the class using the provided EventJSON object.
     *
     * @param {XEventJSON} json - The JSON object containing the required fields to initialize the instance.
     * @throws {IllegalArgumentError} Throws an error if the JSON object cannot be parsed or contains invalid values.
     */
    constructor(json: XEventJSON) {
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
     * @return {XEventJSON} The JSON object representing the current instance.
     */
    toJSON(): XEventJSON {
        return {
            address: this.address.toString(),
            topics: this.topics.map((topic: HexUInt): string =>
                topic.toString()
            ),
            data: this.data.toString()
        } satisfies XEventJSON;
    }
}

export { XEvent };
