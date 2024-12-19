import { Address, VET } from '@vechain/sdk-core';

class Transfer {
    readonly sender: Address;
    readonly recipient: Address;
    readonly amount: VET;

    constructor(json: TransferJSON) {
        this.sender = Address.of(json.sender);
        this.recipient = Address.of(json.recipient);
        this.amount = VET.of(json.amount);
    }

    toJSON(): TransferJSON {
        return {
            sender: this.sender.toString(),
            recipient: this.recipient.toString(),
            amount: this.amount.toString()
        } satisfies TransferJSON;
    }
}

interface TransferJSON {
    sender: string;
    recipient: string;
    amount: string;
}

export { Transfer, type TransferJSON };
