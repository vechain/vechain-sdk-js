import { LogMeta, type LogMetaJSON } from '@thor/logs';
import { Address, HexUInt, Units, VET } from '@vechain/sdk-core';

class SubscriptionTransferResponse {
    readonly sender: Address;
    readonly recipient: Address;
    readonly amount: VET;
    readonly obsolete: boolean;
    readonly meta: LogMeta;

    constructor(json: SubscriptionTransferJSON) {
        this.sender = Address.of(json.sender);
        this.recipient = Address.of(json.recipient);
        this.amount = VET.of(HexUInt.of(json.amount).bi, Units.wei);
        this.obsolete = json.obsolete;
        this.meta = new LogMeta(json.meta);
    }

    toJSON(): SubscriptionTransferJSON {
        return {
            sender: this.sender.toString(),
            recipient: this.recipient.toString(),
            amount: HexUInt.of(this.amount.wei).toString(),
            obsolete: this.obsolete,
            meta: this.meta.toJSON()
        } satisfies SubscriptionTransferJSON;
    }
}

interface SubscriptionTransferJSON {
    sender: string;
    recipient: string;
    amount: string;
    obsolete: boolean;
    meta: LogMetaJSON;
}

export { SubscriptionTransferResponse, type SubscriptionTransferJSON };
