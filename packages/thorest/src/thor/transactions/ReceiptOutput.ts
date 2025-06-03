import { Transfer, type TransferJSON } from './Transfer';
import { Address } from '@vechain/sdk-core';
import { XEvent, type XEventJSON } from '@thor/model';

class ReceiptOutput {
    readonly contractAddress: Address;
    readonly events: XEvent[];
    readonly transfers: Transfer[];

    constructor(json: ReceiptOutputJSON) {
        this.contractAddress = Address.of(json.contractAddress);
        this.events = json.events.map(
            (eventJSON): XEvent => new XEvent(eventJSON)
        );
        this.transfers = json.transfers.map(
            (transferJSON): Transfer => new Transfer(transferJSON)
        );
    }

    toJSON(): ReceiptOutputJSON {
        return {
            contractAddress: this.contractAddress.toString(),
            events: this.events.map((event): XEventJSON => event.toJSON()),
            transfers: this.transfers.map(
                (transfer): TransferJSON => transfer.toJSON()
            )
        } satisfies ReceiptOutputJSON;
    }
}

interface ReceiptOutputJSON {
    contractAddress: string;
    events: XEventJSON[];
    transfers: TransferJSON[];
}

export { ReceiptOutput, type ReceiptOutputJSON };
