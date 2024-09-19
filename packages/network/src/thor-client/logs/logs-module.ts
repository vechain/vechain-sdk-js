import { Hex, type ABIEvent } from '@vechain/sdk-core';
import { type Result } from 'ethers';
import { thorest } from '../../utils';
import { type ThorClient } from '../thor-client';
import {
    type EventLogs,
    type FilterEventLogsOptions,
    type FilterRawEventLogsOptions,
    type FilterTransferLogsOptions,
    type TransferLogs
} from './types';
import { InvalidAbiFragment } from '@vechain/sdk-errors';

/**
 * The `LogsClient` class provides methods to interact with log-related endpoints
 * of the VeChainThor blockchain. It allows filtering event and transfer logs.
 */
class LogsModule {
    /**
     * Initializes a new instance of the `Thor` class.
     * @param thor - The Thor instance used to interact with the VeChain blockchain API.
     */
    constructor(readonly thor: ThorClient) {}

    /**
     * Filters event logs based on the provided criteria. Raw event logs are not decoded.
     *
     * @param filterOptions - An object specifying filtering criteria for event logs.
     * @returns A promise that resolves to filtered event logs.
     */
    public async filterRawEventLogs(
        filterOptions: FilterRawEventLogsOptions
    ): Promise<EventLogs[]> {
        return (await this.thor.httpClient.http(
            'POST',
            thorest.logs.post.EVENT_LOGS(),
            {
                query: {},
                body: filterOptions,
                headers: {}
            }
        )) as EventLogs[];
    }

    /**
     * Filters event logs based on the provided criteria and decodes them using the provided fragments.
     * The decoded data is added to the event logs as a new property.
     * @param filterOptions - An object specifying filtering criteria for event logs.
     */
    public async filterEventLogs(
        filterOptions: FilterEventLogsOptions
    ): Promise<EventLogs[]> {
        // Extract raw event logs and fragments from filter options
        const eventAbis = filterOptions.criteriaSet?.map((c) => c.eventAbi);

        const eventLogs = await this.getRawEventLogs(filterOptions);

        const result: EventLogs[] = [];

        if (eventAbis !== undefined) {
            const uniqueEventAbis = this.removeDuplicatedAbis(eventAbis);

            eventLogs.forEach((log) => {
                const eventAbi = uniqueEventAbis.get(log.topics[0]);
                if (eventAbi === undefined || eventAbi === null) {
                    throw new InvalidAbiFragment(
                        'LogsModule.filterEventLogs',
                        'Topic not found in the provided ABIs.',
                        { type: 'event', fragment: log.topics[0] }
                    );
                }

                // TODO: Replace by abi.Event implementation of decodeEventLog?
                const rawDecodedData = eventAbi.decodeEventLog({
                    data: Hex.of(log.data),
                    topics: log.topics.map((topic) => Hex.of(topic))
                });

                if (rawDecodedData?.args === undefined) {
                    log.decodedData = [] as unknown as Result;
                } else if (rawDecodedData.args instanceof Object) {
                    log.decodedData = Object.values(
                        rawDecodedData.args
                    ) as Result;
                } else {
                    log.decodedData = rawDecodedData as unknown as Result;
                }
                result.push(log);
            });
        }

        return result;
    }

    /**
     * Filters event logs based on the provided criteria and decodes them using the provided fragments.
     * The decoded data is added to the event logs as a new property.
     * The result is an array of event logs grouped by the event topic hash.
     * @param filterOptions
     * @returns A promise that resolves to an array of event logs grouped by event.
     */
    public async filterGroupedEventLogs(
        filterOptions: FilterEventLogsOptions
    ): Promise<EventLogs[][]> {
        // Extract raw event logs and fragments from filter options
        const eventAbis = filterOptions.criteriaSet?.map((c) => c.eventAbi);

        const eventLogs = await this.getRawEventLogs(filterOptions);

        const result = new Map<string, EventLogs[]>();

        if (eventAbis !== undefined) {
            const uniqueEventAbis = this.removeDuplicatedAbis(eventAbis);

            // Initialize the result map with empty arrays for each unique fragment
            uniqueEventAbis.forEach((f) => result.set(f.signatureHash, []));

            eventLogs.forEach((log) => {
                const eventAbi = uniqueEventAbis.get(log.topics[0]);
                if (eventAbi === undefined || eventAbi === null) {
                    throw new InvalidAbiFragment(
                        'LogsModule.filterGroupedEventLogs',
                        'Topic not found in the provided ABIs.',
                        { type: 'event', fragment: log.topics[0] }
                    );
                }
                // TODO: Replace by abi.Event implementation of decodeEventLog?
                const rawDecodedData = eventAbi.decodeEventLog({
                    data: Hex.of(log.data),
                    topics: log.topics.map((topic) => Hex.of(topic))
                });

                if (rawDecodedData?.args === undefined) {
                    log.decodedData = [] as unknown as Result;
                } else if (rawDecodedData.args instanceof Object) {
                    log.decodedData = Object.values(
                        rawDecodedData.args
                    ) as Result;
                } else {
                    log.decodedData = rawDecodedData as unknown as Result;
                }
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
                to: (await this.thor.blocks.getBestBlockCompressed())?.number
            },
            criteriaSet,
            options: filterOptions.options,
            order: filterOptions.order ?? 'asc'
        };

        // Filter event logs based on the provided criteria
        return await this.filterRawEventLogs(filterRawEventLogsOptions);
    }

    /**
     * Removes duplicated fragments from the provided array. Fragments are considered duplicated if they have the same topic hash.
     * @param fragments - An array of event fragments.
     * @private Returns a map of unique fragments.
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
        return (await this.thor.httpClient.http(
            'POST',
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
