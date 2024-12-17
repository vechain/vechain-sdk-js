import { Address, ThorId } from '@vechain/sdk-core';

class EventCriteria {
    readonly address: Address | null;
    readonly topic0: ThorId | null;
    readonly topic1: ThorId | null;
    readonly topic2: ThorId | null;
    readonly topic3: ThorId | null;
    readonly topic4: ThorId | null;

    constructor(json: EventCriteriaJSON) {
        this.address = json.address === null ? null : Address.of(json.address);
        this.topic0 = json.topic0 === null ? null : ThorId.of(json.topic0);
        this.topic1 = json.topic1 === null ? null : ThorId.of(json.topic1);
        this.topic2 = json.topic2 === null ? null : ThorId.of(json.topic2);
        this.topic3 = json.topic3 === null ? null : ThorId.of(json.topic3);
        this.topic4 = json.topic4 === null ? null : ThorId.of(json.topic4);
    }

    toJSON(): EventCriteriaJSON {
        return {
            address: this.address === null ? null : this.address.toString(),
            topic0: this.topic0 === null ? null : this.topic0.toString(),
            topic1: this.topic1 === null ? null : this.topic1.toString(),
            topic2: this.topic2 === null ? null : this.topic2.toString(),
            topic3: this.topic3 === null ? null : this.topic3.toString(),
            topic4: this.topic4 === null ? null : this.topic4.toString()
        } satisfies EventCriteriaJSON;
    }
}

interface EventCriteriaJSON {
    address: string | null;
    topic0: string | null;
    topic1: string | null;
    topic2: string | null;
    topic3: string | null;
    topic4: string | null;
}

export { EventCriteria, type EventCriteriaJSON };
