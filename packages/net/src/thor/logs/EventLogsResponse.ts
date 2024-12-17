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

interface EventLogsResponseJSON extends Array<EventLogsResponseJSON> {}

class EventLogsResponse extends Array<EventLogResponse> {}

export { EventLogResponse, type EventLogsResponseJSON, EventLogsResponse };
