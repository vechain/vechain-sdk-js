import type {
    EventLogs,
    FilterCriteria,
    FilterEventLogsOptions
} from '../../logs';
import { type Contract } from './contract';
import { type Abi } from 'abitype';
import { type TransferFilterOptions } from './types';

/**
 * Represents a filter for events emitted by a smart contract. This class allows for the specification of criteria to filter
 * events and provides a method to fetch event logs based on those criteria.
 */
class ContractFilter<TAbi extends Abi> {
    /**
     * The smart contract instance to apply the filter on.
     */
    public contract: Contract<TAbi>;
    /**
     * A set of criteria used to filter events.
     */
    public criteriaSet: FilterCriteria[];

    /**
     * Constructs an instance of the `ContractFilter` class.
     *
     * @param contract - The smart contract instance to apply the filter on.
     * @param criteriaSet - A set of criteria used to filter events.
     */
    constructor(contract: Contract<TAbi>, criteriaSet: FilterCriteria[]) {
        this.contract = contract;
        this.criteriaSet = criteriaSet;
    }

    /**
     * Retrieves event logs based on the specified filter criteria, range, pagination options, and order.
     *
     * @returns An array of event logs that match the specified criteria.
     * @param param - The filter options to apply to the event logs.
     */
    public async get(param?: TransferFilterOptions): Promise<EventLogs[]> {
        const filterEventLogsOptions: FilterEventLogsOptions = {
            range: param?.range ?? {
                unit: 'block',
                from: 0,
                to: (await this.contract.thor.blocks.getBestBlockCompressed())
                    ?.number
            },
            criteriaSet: this.criteriaSet,
            options: param?.options,
            order: param?.order ?? 'asc'
        };
        return await this.contract.thor.logs.filterEventLogs(
            filterEventLogsOptions
        );
    }
}
export { ContractFilter };
