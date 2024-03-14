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
 * A class representing a filter for events emitted by a smart contract.
 */
class ContractFilter {
    public contract: Contract;
    public criteriaSet: EventCriteria[];

    constructor(contract: Contract, criteriaSet: EventCriteria[]) {
        this.contract = contract;
        this.criteriaSet = criteriaSet;
    }

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
