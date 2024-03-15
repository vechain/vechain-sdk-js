import {
    type EventCriteria,
    type EventLogs,
    type FilterEventLogsOptions,
    type Range,
    type PaginationOptions,
    type EventDisplayOrder
} from '../../logs';
import { type Contract } from './contract';

/**
 * Represents a filter for events emitted by a smart contract. This class allows for the specification of criteria to filter
 * events and provides a method to fetch event logs based on those criteria.
 */
class ContractFilter {
    /**
     * The smart contract instance to apply the filter on.
     */
    public contract: Contract;
    /**
     * A set of criteria used to filter events.
     */
    public criteriaSet: EventCriteria[];

    /**
     * Constructs an instance of the `ContractFilter` class.
     *
     * @param contract - The smart contract instance to apply the filter on.
     * @param criteriaSet - A set of criteria used to filter events.
     */
    constructor(contract: Contract, criteriaSet: EventCriteria[]) {
        this.contract = contract;
        this.criteriaSet = criteriaSet;
    }

    /**
     * Retrieves event logs based on the specified filter criteria, range, pagination options, and order.
     *
     * @param range - The block range to fetch the events from. Defaults to the entire blockchain history if not provided.
     * @param options - Pagination options for fetching the events.
     * @param order - The order in which to display the events. Defaults to ascending ('asc') if not provided.
     * @returns A promise that resolves to an array of event logs matching the filter criteria.
     */
    public async get(
        range?: Range,
        options?: PaginationOptions,
        order?: EventDisplayOrder
    ): Promise<EventLogs[]> {
        const filterEventLogsOptions: FilterEventLogsOptions = {
            range: range ?? {
                unit: 'block',
                from: 0,
                to: (await this.contract.thor.blocks.getBestBlockCompressed())
                    ?.number
            },
            criteriaSet: this.criteriaSet,
            options,
            order: order ?? 'asc'
        };
        return await this.contract.thor.logs.filterEventLogs(
            filterEventLogsOptions
        );
    }
}
export { ContractFilter };
