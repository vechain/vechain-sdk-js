import { LogMeta } from '@thor/logs';
import {
    Address,
    HexUInt,
    IllegalArgumentError,
    ThorId
} from '@vechain/sdk-core';
import { type SubscriptionEventResponseJSON } from './SubscriptionEventResponseJSON';

const FQP =
    'packages/thorest/src/thor/subscriptions/SubscriptionEventResponse.ts!';

class SubscriptionEventResponse {
    readonly address: Address;
    readonly topics: ThorId[];
    readonly data: HexUInt;
    readonly obsolete: boolean;
    readonly meta: LogMeta;

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
