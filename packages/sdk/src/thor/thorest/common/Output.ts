import { Address } from '@common/vcdm';
import { EventResponse } from '@thor/thorest/common/EventResponse';
import { TransferResponse } from '@thor/thorest/common/TransferResponse';
import {
    type OutputJSON,
    type EventJSON,
    type TransferJSON
} from '@thor/thorest/json';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/sdk/src/thor/thorest/model/Output.ts!';

/**
 * [Receipt.outputs](http://localhost:8669/doc/stoplight-ui/#/schemas/Receipt)
 */
class OutputResponse {
    /**
     * The address of the deployed contract, if the corresponding clause is a contract deployment clause.
     */
    readonly contractAddress?: Address;

    /**
     * An array of events emitted by the corresponding clause.
     */
    readonly events: EventResponse[];

    /**
     * An array of transfers made by the corresponding clause.
     */
    readonly transfers: TransferResponse[];

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
                (event: EventJSON): EventResponse => new EventResponse(event)
            );
            this.transfers = json.transfers.map(
                (transfer: TransferJSON): TransferResponse =>
                    new TransferResponse(transfer)
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
                (event: EventResponse): EventJSON => event.toJSON()
            ),
            transfers: this.transfers.map(
                (transfer: TransferResponse): TransferJSON => transfer.toJSON()
            )
        } satisfies OutputJSON;
    }
}

export { OutputResponse };
