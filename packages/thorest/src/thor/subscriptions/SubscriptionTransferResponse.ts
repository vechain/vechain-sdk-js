import { LogMeta } from '@thor/logs';
import { Address, HexUInt, IllegalArgumentError } from '@vechain/sdk-core';
import { type SubscriptionTransferResponseJSON } from './SubscriptionTransferResponseJSON';

const FQP =
    'packages/thorest/src/thor/subscriptions/SubscriptionTransferResponse.ts!';

class SubscriptionTransferResponse {
    readonly sender: Address;
    readonly recipient: Address;
    readonly amount: bigint;
    readonly obsolete: boolean;
    readonly meta: LogMeta;

    constructor(json: SubscriptionTransferResponseJSON) {
        try {
            this.sender = Address.of(json.sender);
            this.recipient = Address.of(json.recipient);
            this.amount = HexUInt.of(json.amount).bi;
            this.obsolete = json.obsolete;
            this.meta = new LogMeta(json.meta);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: SubscriptionTransferResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    toJSON(): SubscriptionTransferResponseJSON {
        return {
            sender: this.sender.toString(),
            recipient: this.recipient.toString(),
            amount: HexUInt.of(this.amount).toString(),
            obsolete: this.obsolete,
            meta: this.meta.toJSON()
        } satisfies SubscriptionTransferResponseJSON;
    }
}

export { SubscriptionTransferResponse };
