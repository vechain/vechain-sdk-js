import { type Address } from '@common/vcdm';
import { Event, Transfer } from '@thor/thor-client/model';
import { type OutputResponse } from '@thor/thorest/common';

class TransactionReceiptOutput {
    /**
     * The address of the deployed contract, if the corresponding clause is a contract deployment clause.
     */
    readonly contractAddress?: Address;

    /**
     * An array of events emitted by the corresponding clause.
     */
    readonly events: Event[];

    /**
     * An array of transfers made by the corresponding clause.
     */
    readonly transfers: Transfer[];

    /**
     * Constructs an instance of the class using the provided parameters.
     *
     * @param {Address} contractAddress - The address of the deployed contract.
     * @param {Event[]} events - An array of events emitted by the transaction clause.
     * @param {Transfer[]} transfers - An array of transfers made by the corresponding clause.
     * @throws {IllegalArgumentError} If the JSON object cannot be parsed or contains invalid values.
     */
    constructor(
        contractAddress: Address | undefined,
        events: Event[],
        transfers: Transfer[]
    ) {
        this.contractAddress = contractAddress;
        this.events = events;
        this.transfers = transfers;
    }

    /**
     * Creates a new instance of the class from the thorest output response.
     *
     * @param {OutputResponse} output - The output response to create the instance from.
     * @returns {TransactionReceiptOutput} A new instance of the class.
     */
    static of(output: OutputResponse): TransactionReceiptOutput {
        return new TransactionReceiptOutput(
            output.contractAddress,
            output.events.map((event) => Event.of(event)),
            output.transfers.map((transfer) => Transfer.of(transfer))
        );
    }
}

export { TransactionReceiptOutput };
