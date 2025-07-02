import { Address } from '@vcdm';
import { Event } from '@thor/model/Event';
import { Transfer } from '@thor/model/Transfer';
import { type OutputJSON, type EventJSON, type TransferJSON } from '@/json';
import { IllegalArgumentError } from '@errors';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/model/Output.ts!';

/**
 * [Receipt.outputs](http://localhost:8669/doc/stoplight-ui/#/schemas/Receipt)
 */
class Output {
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
     * Constructs an instance of the class using the provided OutputJSON object.
     *
     * @param {OutputJSON} json - The JSON object containing the required fields to initialize the instance.
     * @throws {IllegalArgumentError} If the JSON object cannot be parsed or contains invalid values.
     */
    constructor(json: OutputJSON) {
        try {
            this.contractAddress =
                json.contractAddress !== null
                    ? Address.of(json.contractAddress)
                    : undefined;
            this.events = json.events.map(
                (event: EventJSON): Event => new Event(event)
            );
            this.transfers = json.transfers.map(
                (transfer: TransferJSON): Transfer => new Transfer(transfer)
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
     * Converts the current instance of the class into a JSON representation.
     *
     * @return {OutputJSON} The JSON object representing the current instance.
     */
    toJSON(): OutputJSON {
        return {
            contractAddress:
                this.contractAddress !== undefined
                    ? this.contractAddress.toString()
                    : null,
            events: this.events.map(
                (event: Event): EventJSON => event.toJSON()
            ),
            transfers: this.transfers.map(
                (transfer: Transfer): TransferJSON => transfer.toJSON()
            )
        } satisfies OutputJSON;
    }
}

export { Output };
