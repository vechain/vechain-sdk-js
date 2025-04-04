import { Event, type EventJSON } from './Event';
import { Transfer, type TransferJSON } from './Transfer';
import { Address } from '@vechain/sdk-core';
import { type ReceiptOutputJSON } from './ReceiptOutputJSON';

/**
 * [`Receipt.outputs` array property](http://localhost:8669/doc/stoplight-ui/#/schemas/Receipt)
 */
class ReceiptOutput {
    /**
     * The address of the deployed contract, if the corresponding clause is a contract deployment clause.
     */
    readonly contractAddress: Address;

    /**
     * [Event](http://localhost:8669/doc/stoplight-ui/#/schemas/Event) array.
     */
    readonly events: Event[];

    /**
     * [Transfer](http://localhost:8669/doc/stoplight-ui/#/schemas/SubscriptionBeatResponse) array.
     */
    readonly transfers: Transfer[];

    /**
     * Constructs an instance of the class using the provided JSON object.
     *
     * @param {ReceiptOutputJSON} json - The JSON object containing the data to initialize the instance.
     */
    constructor(json: ReceiptOutputJSON) {
        this.contractAddress = Address.of(json.contractAddress);
        this.events = json.events.map(
            (eventJSON): Event => new Event(eventJSON)
        );
        this.transfers = json.transfers.map(
            (transferJSON): Transfer => new Transfer(transferJSON)
        );
    }

    /**
     * Converts the Receipt object into a JSON representation.
     *
     * @return {ReceiptOutputJSON} A JSON object representing the receipt, including the contract address, events, and transfers.
     */
    toJSON(): ReceiptOutputJSON {
        return {
            contractAddress: this.contractAddress.toString(),
            events: this.events.map((event): EventJSON => event.toJSON()),
            transfers: this.transfers.map(
                (transfer): TransferJSON => transfer.toJSON()
            )
        } satisfies ReceiptOutputJSON;
    }
}

export { ReceiptOutput };
