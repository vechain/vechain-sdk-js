import { LogMeta, type LogMetaJSON } from '../logs';
import { Address, HexUInt, LogId } from '@vechain/sdk-core/src';

class SubscriptionEventResponse {
    readonly address: Address;
    readonly topics: LogId[];
    readonly data: HexUInt;
    readonly obsolete: boolean;
    readonly meta: LogMeta;

    constructor(json: SubscriptionEventResponseJSON) {
        this.address = Address.of(json.address);
        this.topics = json.topics.map(
            (topic: string): LogId => LogId.of(topic)
        );
        this.data = HexUInt.of(json.data);
        this.obsolete = json.obsolete;
        this.meta = new LogMeta(json.meta);
    }

    toJSON(): SubscriptionEventResponseJSON {
        return {
            address: this.address.toString(),
            topics: this.topics.map((topic: LogId): string => topic.toString()),
            data: this.data.toString(),
            obsolete: this.obsolete,
            meta: this.meta.toJSON()
        };
    }
}

interface SubscriptionEventResponseJSON {
    address: string;
    topics: string[];
    data: string;
    obsolete: boolean;
    meta: LogMetaJSON;
}

export { SubscriptionEventResponse, type SubscriptionEventResponseJSON };
