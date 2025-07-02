import { LogMeta } from '@thor/logs';
import { Address, HexUInt, ThorId } from '@vcdm';
import { type SubscriptionEventResponseJSON } from '@thor/subscriptions';
import { IllegalArgumentError } from '@errors';

/**
 * Full-Qualified Path
 */
const FQP =
    'packages/core/src/thor/subscriptions/SubscriptionEventResponse.ts!';

/**
 * [SubscriptionEventResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/SubscriptionEventResponse)
 *
 * Represents an event response from a subscription.
 */
class SubscriptionEventResponse {
    /**
     * The contract address that emitted the event.
     */
    readonly address: Address;

    /**
     * The event topics.
     */
    readonly topics: ThorId[];

    /**
     * The event data.
     */
    readonly data: HexUInt;

    /**
     * Whether the event is obsolete.
     */
    readonly obsolete: boolean;

    /**
     * The log metadata associated with the event.
     */
    readonly meta: LogMeta;

    /**
     * Constructs a new instance of the class by parsing the provided JSON object.
     *
     * @param {SubscriptionEventResponseJSON} json - The JSON object containing event response data.
     * @throws {IllegalArgumentError} If the parsing of the JSON object fails.
     */
    constructor(json: SubscriptionEventResponseJSON) {
        try {
            this.address = Address.of(json.address);
            this.topics = json.topics.map(
                (topic: string): ThorId => ThorId.of(topic)
            );
            this.data = HexUInt.of(json.data);
            this.obsolete = json.obsolete;
            this.meta = new LogMeta(json.meta);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: SubscriptionEventResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current event response data into a JSON representation.
     *
     * @returns {SubscriptionEventResponseJSON} A JSON object containing the event response data.
     */
    toJSON(): SubscriptionEventResponseJSON {
        return {
            address: this.address.toString(),
            topics: this.topics.map((topic: ThorId): string =>
                topic.toString()
            ),
            data: this.data.toString(),
            obsolete: this.obsolete,
            meta: this.meta.toJSON()
        };
    }
}

export { SubscriptionEventResponse };
