import { Address, HexUInt, ThorId } from '@vechain/sdk-core';

class Event {
    readonly address: Address;
    readonly topics: ThorId[];
    readonly data: HexUInt;

    constructor(json: EventJSON) {
        this.address = Address.of(json.address);
        this.topics = json.topics.map(
            (topic: string): ThorId => ThorId.of(topic)
        );
        this.data = HexUInt.of(json.data);
    }

    toJSON(): EventJSON {
        return {
            address: this.address.toString(),
            topics: this.topics.map((topic: ThorId): string =>
                topic.toString()
            ),
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
