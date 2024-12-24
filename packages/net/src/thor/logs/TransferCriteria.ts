import { Address } from '@vechain/sdk-core';

class TransferCriteria {
    txOrigin?: Address;
    sender?: Address;
    recipient?: Address;

    constructor(json: TransferCriteriaJSON) {
        this.txOrigin =
            json.txOrigin === undefined ? undefined : Address.of(json.txOrigin);
        this.sender =
            json.sender === undefined ? undefined : Address.of(json.sender);
        this.recipient =
            json.recipient === undefined
                ? undefined
                : Address.of(json.recipient);
    }

    toJSON(): TransferCriteriaJSON {
        return {
            txOrigin: this.txOrigin?.toString(),
            sender: this.sender?.toString(),
            recipient: this.recipient?.toString()
        } satisfies TransferCriteriaJSON;
    }
}

interface TransferCriteriaJSON {
    txOrigin?: string;
    sender?: string;
    recipient?: string;
}

export { TransferCriteria, type TransferCriteriaJSON };
