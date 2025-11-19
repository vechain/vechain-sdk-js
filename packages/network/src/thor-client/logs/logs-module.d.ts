import { type EventLogs, type FilterEventLogsOptions, type FilterRawEventLogsOptions, type FilterTransferLogsOptions, type TransferLogs } from './types';
import { type BlocksModule } from '../blocks';
/**
 * The `LogsClient` class provides methods to interact with log-related endpoints
 * of the VeChainThor blockchain. It allows filtering event and transfer logs.
 */
declare class LogsModule {
    readonly blocksModule: BlocksModule;
    constructor(blocksModule: BlocksModule);
    /**
     * Filters event logs based on the provided criteria. Raw event logs are not decoded.
     *
     * @param filterOptions - An object specifying filtering criteria for event logs.
     * @returns A promise that resolves to filtered event logs.
     */
    filterRawEventLogs(filterOptions: FilterRawEventLogsOptions): Promise<EventLogs[]>;
    /**
     * Filters event logs based on the provided criteria and decodes them using the provided ABI items.
     * The decoded data is added to the event logs as a new property.
     * @param filterOptions - An object specifying filtering criteria for event logs.
     */
    filterEventLogs(filterOptions: FilterEventLogsOptions): Promise<EventLogs[]>;
    /**
     * Filters event logs based on the provided criteria and decodes them using the provided ABI items.
     * The decoded data is added to the event logs as a new property.
     * The result is an array of event logs grouped by the event topic hash.
     * @param filterOptions
     * @returns A promise that resolves to an array of event logs grouped by event.
     */
    filterGroupedEventLogs(filterOptions: FilterEventLogsOptions): Promise<EventLogs[][]>;
    /**
     * Filters event logs based on the provided criteria without decoding them.
     * @param filterOptions - An object specifying filtering criteria for event logs.
     * @private Returns a promise that resolves to filtered non decoded event logs.
     */
    private getRawEventLogs;
    /**
     * Removes duplicated ABI items from the provided array. ABI items are considered duplicated if they have the same topic hash.
     * @param eventAbis - An array of event ABI items.
     * @private Returns a map of unique ABI items.
     */
    private removeDuplicatedAbis;
    /**
     * Filters transfer logs based on the provided criteria.
     *
     * @param filterOptions - An object specifying filtering criteria for transfer logs.
     * @returns A promise that resolves to filtered transfer logs.
     */
    filterTransferLogs(filterOptions: FilterTransferLogsOptions): Promise<TransferLogs[]>;
}
export { LogsModule };
//# sourceMappingURL=logs-module.d.ts.map