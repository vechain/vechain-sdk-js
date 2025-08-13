import { type EventLogResponseJSON } from '@thor/json';
import { LogMeta } from '@thor/thor-client/model/logs/LogMeta';
import { Address, HexUInt, HexUInt32, type Hex } from '@vcdm';
import { IllegalArgumentError } from '@errors';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/sdk/src/thor/logs/EventLogsResponse.ts!';

/**
 * [EventLogFilterRequest](http://localhost:8669/doc/stoplight-ui/#/schemas/EventLogFilterRequest) element.
 */
class EventLogResponse {
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
     * Constructs an instance of the class with the event log response represented as a JSON object.
     *
     * @param {EventLogResponseJSON} json - The JSON object containing filter criteria.
     * Each property in the JSON object is parsed and converted to its respective type.
     * @throws {IllegalArgumentError} Thrown when the provided JSON object contains invalid or unparsable data.
     */
    constructor(json: EventLogResponseJSON) {
        try {
            this.address = Address.of(json.address);
            this.topics = json.topics.map(
                (topic: string): HexUInt32 => HexUInt32.of(topic)
            );
            this.data = HexUInt.of(json.data);
            this.meta = new LogMeta(json.meta);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: EventLogResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current EventLogResponse instance into a JSON representation.
     *
     * @return {EventLogResponseJSON} The JSON object representing the current EventLogResponse instance.
     */
    toJSON(): EventLogResponseJSON {
        return {
            address: this.address.toString(),
            topics: this.topics.map((topic: HexUInt32): string =>
                topic.toString()
            ),
            data: this.data.toString(),
            meta: this.meta.toJSON()
        } satisfies EventLogResponseJSON;
    }
}

export { EventLogResponse };
