import { LogMeta, type LogMetaJSON } from '@thor/logs';
import { Address, HexUInt, ThorId } from '@vechain/sdk-core';

class EventLogResponse {
    readonly address: Address;
    readonly topics: ThorId[];
    readonly data: HexUInt;
    readonly meta: LogMeta;

    constructor(json: EventLogResponseJSON) {
        this.address = Address.of(json.address);
        this.topics = json.topics.map(
            (topic: string): ThorId => ThorId.of(topic)
        );
        this.data = HexUInt.of(json.data);
        this.meta = new LogMeta(json.meta);
    }

    toJSON(): EventLogResponseJSON {
        return {
            address: this.address.toString(),
            topics: this.topics.map((topic: ThorId): string =>
                topic.toString()
            ),
            data: this.data.toString(),
            meta: this.meta.toJSON()
        } satisfies EventLogResponseJSON;
    }
}

interface EventLogResponseJSON {
    address: string;
    topics: string[];
    data: string;
    meta: LogMetaJSON;
}

class EventLogsResponse extends Array<EventLogResponse> {
    /**
     * Creates a new TransferLogsResponse instance.
     * Special constructor pattern required for Array inheritance.
     * Array constructor is first called with a length parameter,
     * so we need this pattern to properly handle array data instead.
     *
     * @param json - The JSON array containing transfer log data
     * @returns A new EventLogsResponse instance containing EventLogResponse objects
     */
    constructor(json: EventLogsResponseJSON) {
        super();
        return Object.setPrototypeOf(
            Array.from(json ?? [], (peerStat) => {
                return new EventLogResponse(peerStat);
            }),
            EventLogsResponse.prototype
        ) as EventLogsResponse;
    }

    /**
     * Converts the EventLogsResponse instance to a JSON array
     * @returns {EventLogsResponseJSON} An array of event logs in JSON format
     */
    toJSON(): EventLogsResponseJSON {
        return this.map((response): EventLogResponseJSON => {
            return response.toJSON();
        });
    }
}

interface EventLogsResponseJSON extends Array<EventLogResponseJSON> {}

export {
    EventLogResponse,
    type EventLogResponseJSON,
    EventLogsResponse,
    type EventLogsResponseJSON
};
