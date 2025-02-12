import { LogMeta, type LogMetaJSON } from './LogMeta';
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
            // Weirdly enough response seems to be of type EventLogResponseJSON
            // instead of the expected EventLogResponse
            const res = new EventLogResponse(
                response as unknown as EventLogResponseJSON
            );
            return res.toJSON();
        });
    }
}

interface EventLogsResponseJSON extends Array<EventLogResponseJSON> {}

export {
    EventLogResponse,
    type EventLogResponseJSON,
    type EventLogsResponseJSON,
    EventLogsResponse
};
