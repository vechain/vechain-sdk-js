import { Address, LogId } from '@vechain/sdk-core/src';

class EventCriteria {
    readonly address?: Address;
    readonly topic0?: LogId;
    readonly topic1?: LogId;
    readonly topic2?: LogId;
    readonly topic3?: LogId;
    readonly topic4?: LogId;

    constructor(json: EventCriteriaJSON) {
        this.address =
            json.address === undefined ? undefined : Address.of(json.address);
        this.topic0 =
            json.topic0 === undefined ? undefined : LogId.of(json.topic0);
        this.topic1 =
            json.topic1 === undefined ? undefined : LogId.of(json.topic1);
        this.topic2 =
            json.topic2 === undefined ? undefined : LogId.of(json.topic2);
        this.topic3 =
            json.topic3 === undefined ? undefined : LogId.of(json.topic3);
        this.topic4 =
            json.topic4 === undefined ? undefined : LogId.of(json.topic4);
    }

    toJSON(): EventCriteriaJSON {
        return {
            address: this.address?.toString(),
            topic0: this.topic0?.toString(),
            topic1: this.topic1?.toString(),
            topic2: this.topic2?.toString(),
            topic3: this.topic3?.toString(),
            topic4: this.topic4?.toString()
        } satisfies EventCriteriaJSON;
    }
}

interface EventCriteriaJSON {
    address?: string;
    topic0?: string;
    topic1?: string;
    topic2?: string;
    topic3?: string;
    topic4?: string;
}

export { EventCriteria, type EventCriteriaJSON };
