import { Hex, HexUInt } from '@vcdm';
import { Transfer } from '@thor/model/Transfer';
import { type EventJSON, type TransferJSON } from '@thor/json';
import { Event } from '@thor/model';
import { IllegalArgumentError } from '@errors';
import { ExecuteCodeResponseJSON } from './ExecuteCodeResponseJSON';
import { ExecuteCodesResponseJSON } from './ExecuteCodesResponseJSON';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/core/src/thor/accounts/ExecuteCodesResponse.ts!';

/**
 * Execute Code Response
 *
 * Represents a single code execution response.
 *
 * [ExecuteCodesResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/ExecuteCodesResponse)
 */
class ExecuteCodeResponse {
    /**
     * The data of the response.
     */
    readonly data: Hex;

    /**
     * The events of the response.
     */
    readonly events: Event[];

    /**
     * The transfers of the response.
     */
    readonly transfers: Transfer[];

    /**
     * The gas used of the response.
     */
    readonly gasUsed: bigint;

    /**
     * The reverted of the response.
     */
    readonly reverted: boolean;

    /**
     * The VM error of the response.
     */
    readonly vmError: string;

    /**
     * Constructs a new instance of the class by parsing the provided JSON object.
     *
     * @param {ExecuteCodeResponseJSON} json - The JSON object containing execute code response data.
     * @throws {IllegalArgumentError} If the parsing of the JSON object fails.
     */
    constructor(json: ExecuteCodeResponseJSON) {
        try {
            this.data = HexUInt.of(json.data);
            this.events = json.events.map(
                (eventJSON: EventJSON): Event => new Event(eventJSON)
            );
            this.transfers = json.transfers.map(
                (transferJSON: TransferJSON): Transfer =>
                    new Transfer(transferJSON)
            );
            this.gasUsed = BigInt(json.gasUsed);
            this.reverted = json.reverted;
            this.vmError = json.vmError;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: ExecuteCodeResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current execute code response data into a JSON representation.
     *
     * @returns {ExecuteCodeResponseJSON} A JSON object containing the execute code response data.
     */
    toJSON(): ExecuteCodeResponseJSON {
        return {
            data: this.data.toString(),
            events: this.events.map(
                (event: Event): EventJSON => event.toJSON()
            ),
            transfers: this.transfers.map(
                (transfer: Transfer): TransferJSON => transfer.toJSON()
            ),
            gasUsed: Number(this.gasUsed),
            reverted: this.reverted,
            vmError: this.vmError
        } satisfies ExecuteCodeResponseJSON;
    }
}

/**
 * Execute Codes Response
 *
 * Represents a collection of execute code responses.
 */
class ExecuteCodesResponse extends Array<ExecuteCodeResponse> {
    /**
     * Constructs a new instance of the class by parsing the provided JSON array.
     *
     * @param {ExecuteCodesResponseJSON} json - The JSON array containing execute code response data.
     */
    constructor(json: ExecuteCodesResponseJSON) {
        super(
            ...json.map(
                (json: ExecuteCodeResponseJSON): ExecuteCodeResponse =>
                    new ExecuteCodeResponse(json)
            )
        );
    }
}

export { ExecuteCodeResponse, ExecuteCodesResponse };
