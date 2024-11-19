import { type ABIEvent, Hex } from '@vechain/sdk-core';
import { InvalidAbiItem } from '@vechain/sdk-errors';
import { thorest } from '../../utils/thorest/thorest';
import {
    type EventLogs,
    type FilterEventLogsOptions,
    type FilterRawEventLogsOptions,
    type FilterTransferLogsOptions,
    type TransferLogs
} from './types';
import { HttpMethod } from '../../http';
import { type BlocksModule } from '../blocks';

/**
 * The `LogsClient` class provides methods to interact with log-related endpoints
 * of the VeChainThor blockchain. It allows filtering event and transfer logs.
 */
class LogsModule {
    readonly blocksModule: BlocksModule;

    constructor(blocksModule: BlocksModule) {
        this.blocksModule = blocksModule;
    }

    /**
     * Filters event logs based on the provided criteria. Raw event logs are not decoded.
     *
     * @param filterOptions - An object specifying filtering criteria for event logs.
     * @returns A promise that resolves to filtered event logs.
     */
    public async filterRawEventLogs(
        filterOptions: FilterRawEventLogsOptions
    ): Promise<EventLogs[]> {
        return (await this.blocksModule.httpClient.http(
            HttpMethod.POST,
            thorest.logs.post.EVENT_LOGS(),
            {
                query: {},
                body: filterOptions,
                headers: {}
            }
        )) as EventLogs[];
    }

    /**
     * Filters event logs based on the provided criteria and decodes them using the provided ABI items.
     * The decoded data is added to the event logs as a new property.
     * @param filterOptions - An object specifying filtering criteria for event logs.
     */
    public async filterEventLogs(
        filterOptions: FilterEventLogsOptions
    ): Promise<EventLogs[]> {
        // Extract raw event logs and ABI items from filter options
        const eventAbis = filterOptions.criteriaSet?.map((c) => c.eventAbi);

        const eventLogs = await this.getRawEventLogs(filterOptions);

        const result: EventLogs[] = [];

        if (eventAbis !== undefined) {
            const uniqueEventAbis = this.removeDuplicatedAbis(eventAbis);

            eventLogs.forEach((log) => {
                const eventAbi = uniqueEventAbis.get(log.topics[0]);
                if (eventAbi === undefined || eventAbi === null) {
                    throw new InvalidAbiItem(
                        'LogsModule.filterEventLogs',
                        'Topic not found in the provided ABIs.',
                        { type: 'event', value: log.topics[0] }
                    );
                }
                log.decodedData = eventAbi.decodeEventLogAsArray({
                    data: Hex.of(log.data),
                    topics: log.topics.map((topic) => Hex.of(topic))
                });
                result.push(log);
            });
        }

        return result;
    }

    /**
     * Filters event logs based on the provided criteria and decodes them using the provided ABI items.
     * The decoded data is added to the event logs as a new property.
     * The result is an array of event logs grouped by the event topic hash.
     * @param filterOptions
     * @returns A promise that resolves to an array of event logs grouped by event.
     */
    public async filterGroupedEventLogs(
        filterOptions: FilterEventLogsOptions
    ): Promise<EventLogs[][]> {
        // Extract raw event logs and ABI items from filter options
        const eventAbis = filterOptions.criteriaSet?.map((c) => c.eventAbi);

        const eventLogs = await this.getRawEventLogs(filterOptions);

        const result = new Map<string, EventLogs[]>();

        if (eventAbis !== undefined) {
            const uniqueEventAbis = this.removeDuplicatedAbis(eventAbis);

            // Initialize the result map with empty arrays for each unique ABI item
            uniqueEventAbis.forEach((f) => result.set(f.signatureHash, []));

            eventLogs.forEach((log) => {
                const eventAbi = uniqueEventAbis.get(log.topics[0]);
                if (eventAbi === undefined || eventAbi === null) {
                    throw new InvalidAbiItem(
                        'LogsModule.filterGroupedEventLogs',
                        'Topic not found in the provided ABIs.',
                        { type: 'event', value: log.topics[0] }
                    );
                }

                log.decodedData = eventAbi.decodeEventLogAsArray({
                    data: Hex.of(log.data),
                    topics: log.topics.map((topic) => Hex.of(topic))
                });
                result.get(log.topics[0])?.push(log);
            });
        }

        return Array.from(result.values());
    }

    /**
     * Filters event logs based on the provided criteria without decoding them.
     * @param filterOptions - An object specifying filtering criteria for event logs.
     * @private Returns a promise that resolves to filtered non decoded event logs.
     */
    private async getRawEventLogs(
        filterOptions: FilterEventLogsOptions
    ): Promise<EventLogs[]> {
        const criteriaSet = filterOptions.criteriaSet?.map((c) => c.criteria);
        // Create new filter options with the criteria set
        const filterRawEventLogsOptions: FilterRawEventLogsOptions = {
            range: filterOptions.range ?? {
                unit: 'block',
                from: 0,
                to: (await this.blocksModule.getBestBlockCompressed())?.number
            },
            criteriaSet,
            options: filterOptions.options,
            order: filterOptions.order ?? 'asc'
        };

        // Filter event logs based on the provided criteria
        return await this.filterRawEventLogs(filterRawEventLogsOptions);
    }

    /**
     * Removes duplicated ABI items from the provided array. ABI items are considered duplicated if they have the same topic hash.
     * @param eventAbis - An array of event ABI items.
     * @private Returns a map of unique ABI items.
     */
    private removeDuplicatedAbis(eventAbis: ABIEvent[]): Map<string, ABIEvent> {
        const uniqueEventAbis = new Map<string, ABIEvent>();

        eventAbis.forEach((obj) => {
            if (!uniqueEventAbis.has(obj.signatureHash)) {
                uniqueEventAbis.set(obj.signatureHash, obj);
            }
        });

        return uniqueEventAbis;
    }

    /**
     * Filters transfer logs based on the provided criteria.
     *
     * @param filterOptions - An object specifying filtering criteria for transfer logs.
     * @returns A promise that resolves to filtered transfer logs.
     */
    public async filterTransferLogs(
        filterOptions: FilterTransferLogsOptions
    ): Promise<TransferLogs[]> {
        return (await this.blocksModule.httpClient.http(
            HttpMethod.POST,
            thorest.logs.post.TRANSFER_LOGS(),
            {
                query: {},
                body: filterOptions,
                headers: {}
            }
        )) as TransferLogs[];
    }
}

export { LogsModule };
