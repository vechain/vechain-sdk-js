import { Address, HexUInt, LogId } from '@vechain/sdk-core/src';

class Event {
    readonly address: Address;
    readonly topics: LogId[];
    readonly data: HexUInt;

    constructor(json: EventJSON) {
        this.address = Address.of(json.address);
        this.topics = json.topics.map(
            (topic: string): LogId => LogId.of(topic)
        );
        this.data = HexUInt.of(json.data);
    }

    toJSON(): EventJSON {
        return {
            address: this.address.toString(),
            topics: this.topics.map((topic: LogId): string => topic.toString()),
            data: this.data.toString()
        } satisfies EventJSON;
    }
}

interface EventJSON {
    address: string;
    topics: string[];
    data: string;
}

export { Event, type EventJSON };
