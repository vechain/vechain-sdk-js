import { Address, IllegalArgumentError } from '@vechain/sdk-core';
import { Event } from '@thor/model/Event';
import { XTransfer } from '@thor/model/XTransfer';
import { type XOutputJSON } from '@thor/model/XOutputJSON';
import { type EventJSON } from '@thor/model/EventJSON';
import { type XTransferJSON } from '@thor/model/XTransferJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/blocks/XOutput.ts!'; // todo: check once moved

/**
 * [Receipt.outputs](http://localhost:8669/doc/stoplight-ui/#/schemas/Receipt)
 */
class XOutput {
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
    readonly transfers: XTransfer[];

    /**
     * Constructs an instance of the class using the provided OutputJSON object.
     *
     * @param {XOutputJSON} json - The JSON object containing the required fields to initialize the instance.
     * @throws {IllegalArgumentError} Throws an error if the JSON object cannot be parsed or contains invalid values.
     */
    constructor(json: XOutputJSON) {
        try {
            this.contractAddress =
                json.contractAddress !== null
                    ? Address.of(json.contractAddress)
                    : undefined;
            this.events = json.events.map(
                (event: EventJSON): Event => new Event(event)
            );
            this.transfers = json.transfers.map(
                (transfer: XTransferJSON): XTransfer => new XTransfer(transfer)
            );
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: OutputJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of the class into a OutputJSON representation.
     *
     * @return {XOutputJSON} The JSON object representing the current instance.
     */
    toJSON(): XOutputJSON {
        return {
            contractAddress:
                this.contractAddress !== undefined
                    ? this.contractAddress.toString()
                    : null,
            events: this.events.map(
                (event: Event): EventJSON => event.toJSON()
            ),
            transfers: this.transfers.map(
                (transfer: XTransfer): XTransferJSON => transfer.toJSON()
            )
        } satisfies XOutputJSON;
    }
}

export { XOutput };
