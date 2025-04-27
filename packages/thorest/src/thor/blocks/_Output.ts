import { Address, IllegalArgumentError } from '../../../../core/src';
import { _Event } from './_Event';
import { _Transfer } from './_Transfer';
import { type _OutputJSON } from './_OutputJSON';
import { type _EventJSON } from './_EventJSON';
import { type _TransferJSON } from './_TransferJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/blocks/_Output.ts'; // todo: check once moved

/**
 * [Receipt.outputs](http://localhost:8669/doc/stoplight-ui/#/schemas/Receipt)
 */
class _Output {
    /**
     * The address of the deployed contract, if the corresponding clause is a contract deployment clause.
     */
    readonly contractAddress?: Address;

    /**
     * An array of events emitted by the corresponding clause.
     */
    readonly events: _Event[];

    /**
     * An array of transfers made by the corresponding clause.
     */
    readonly transfers: _Transfer[];

    /**
     * Constructs an instance of the class using the provided _OutputJSON object.
     *
     * @param {_outputJSON} json - The JSON object containing the required fields to initialize the instance.
     * @throws {IllegalArgumentError} Throws an error if the JSON object cannot be parsed or contains invalid values.
     */
    constructor(json: _OutputJSON) {
        try {
            this.contractAddress =
                json.contractAddress !== null
                    ? Address.of(json.contractAddress)
                    : undefined;
            this.events = json.events.map(
                (event: _EventJSON): _Event => new _Event(event)
            );
            this.transfers = json.transfers.map(
                (transfer: _TransferJSON): _Transfer => new _Transfer(transfer)
            );
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: _OutputJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current instance of the class into a _OutputJSON representation.
     *
     * @return {_OutputJSON} The JSON object representing the current instance.
     */
    toJSON(): _OutputJSON {
        return {
            contractAddress:
                this.contractAddress !== undefined
                    ? this.contractAddress.toString()
                    : null,
            events: this.events.map(
                (event: _Event): _EventJSON => event.toJSON()
            ),
            transfers: this.transfers.map(
                (transfer: _Transfer): _TransferJSON => transfer.toJSON()
            )
        } satisfies _OutputJSON;
    }
}

export { _Output };
