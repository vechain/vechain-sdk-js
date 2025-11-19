"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractFilter = void 0;
/**
 * Represents a filter for events emitted by a smart contract. This class allows for the specification of criteria to filter
 * events and provides a method to fetch event logs based on those criteria.
 */
class ContractFilter {
    /**
     * The smart contract instance to apply the filter on.
     */
    contract;
    /**
     * A set of criteria used to filter events.
     */
    criteriaSet;
    /**
     * Constructs an instance of the `ContractFilter` class.
     *
     * @param contract - The smart contract instance to apply the filter on.
     * @param criteriaSet - A set of criteria used to filter events.
     */
    constructor(contract, criteriaSet) {
        this.contract = contract;
        this.criteriaSet = criteriaSet;
    }
    /**
     * Retrieves event logs based on the specified filter criteria, range, pagination options, and order.
     *
     * @returns An array of event logs that match the specified criteria.
     * @param param - The filter options to apply to the event logs.
     */
    async get(param) {
        const filterEventLogsOptions = {
            range: param?.range ?? {
                unit: 'block',
                from: 0,
                to: (await this.contract.contractsModule.transactionsModule.blocksModule.getBestBlockCompressed())?.number
            },
            criteriaSet: this.criteriaSet,
            options: param?.options,
            order: param?.order ?? 'asc'
        };
        return await this.contract.contractsModule.transactionsModule.logsModule.filterEventLogs(filterEventLogsOptions);
    }
}
exports.ContractFilter = ContractFilter;
