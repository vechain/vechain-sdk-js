import {
    FilterOptionsRequest,
    FilterRangeRequest,
    TransferCriteriaRequest,
    type LogSort
} from '@thor/logs';
import { type TransferLogFilterRequestJSON } from '@thor/json';
import { IllegalArgumentError } from '@errors';
import { type TransferLogFilter } from '@thor/thor-client/model/logs/TransferLogFilter';

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
    readonly range: FilterRangeRequest | null;

    /**
     * Include these parameters to receive filtered results in a paged format.
     */
    readonly options: FilterOptionsRequest | null;

    /**
     * Transfer criteria.
     */
    readonly criteriaSet: TransferCriteriaRequest[] | null;

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
    constructor(filter: TransferLogFilter) {
        try {
            this.range =
                filter.range != null
                    ? new FilterRangeRequest(filter.range)
                    : null;
            this.options =
                filter.options != null
                    ? new FilterOptionsRequest(filter.options)
                    : null;
            this.criteriaSet =
                filter.criteriaSet != null
                    ? filter.criteriaSet.map(
                          (criteria) => new TransferCriteriaRequest(criteria)
                      )
                    : null;
            this.order = filter.order;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: TransferLogFilterRequestJSON)`,
                'Unable to construct TransferLogFilterRequest from TransferLogFilter',
                { filter },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Creates a new TransferLogFilterRequest instance.
     *
     * @param filter - The TransferLogFilter instance to convert.
     * @return {TransferLogFilterRequest} The TransferLogFilterRequest instance.
     */
    static of(filter: TransferLogFilter): TransferLogFilterRequest {
        return new TransferLogFilterRequest(filter);
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
