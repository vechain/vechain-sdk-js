import {
    FilterOptions,
    FilterRange,
    type LogSort,
    TransferCriteria
} from '@thor/logs';
import { type TransferLogFilterRequestJSON } from '@thor/thorest/json';
import { IllegalArgumentError } from '@errors';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/sdk/src/thor/logs/TransferLogFilterRequest.ts!';

/**
 * [TransferLogFilterRequest](http://localhost:8669/doc/stoplight-ui/#/schemas/TransferLogFilterRequest)
 */
class TransferLogFilterRequest {
    /**
     * Defines the range for filtering. Setting values to null indicates the entire range.
     */
    readonly range: FilterRange | null;

    /**
     * Include these parameters to receive filtered results in a paged format.
     */
    readonly options: FilterOptions | null;

    /**
     * Transfer criteria.
     */
    readonly criteriaSet: TransferCriteria[] | null;

    /**
     * Specifies the order of the results. Use asc for ascending order, and desc for descending order.
     */
    readonly order: LogSort | null;

    /**
     * Constructs an instance of the request for the logs of transfers as a JSON object.
     *
     * @param {TransferLogFilterRequestJSON} json - The JSON object containing filter options.
     * Each property in the JSON object is parsed and converted to its respective type.
     * @throws {IllegalArgumentError} Thrown when the provided JSON object contains invalid or unparsable data.
     */
    constructor(json: TransferLogFilterRequestJSON) {
        try {
            this.range =
                json.range === undefined ? null : new FilterRange(json.range);
            this.options =
                json.options === undefined
                    ? null
                    : new FilterOptions(json.options);
            this.criteriaSet =
                json.criteriaSet === undefined
                    ? null
                    : json.criteriaSet.map(
                          (criteriaJSON) => new TransferCriteria(criteriaJSON)
                      );
            this.order =
                json.order === undefined ? null : (json.order as LogSort);
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: TransferLogFilterRequestJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current TransferLogFilterRequestJSON instance into a JSON representation.
     *
     * @return {TransferLogFilterRequestJSON} The JSON object representing the current FilterOptions instance.
     */
    toJSON(): TransferLogFilterRequestJSON {
        return {
            range: this.range === null ? undefined : this.range.toJSON(),
            options: this.options === null ? undefined : this.options.toJSON(),
            criteriaSet:
                this.criteriaSet === null
                    ? undefined
                    : this.criteriaSet.map((criteria) => criteria.toJSON()),
            order: this.order ?? undefined
        } satisfies TransferLogFilterRequestJSON;
    }
}

export { TransferLogFilterRequest };
