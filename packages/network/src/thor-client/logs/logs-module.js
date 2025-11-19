"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsModule = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const thorest_1 = require("../../utils/thorest/thorest");
const http_1 = require("../../http");
/**
 * The `LogsClient` class provides methods to interact with log-related endpoints
 * of the VeChainThor blockchain. It allows filtering event and transfer logs.
 */
class LogsModule {
    blocksModule;
    constructor(blocksModule) {
        this.blocksModule = blocksModule;
    }
    /**
     * Filters event logs based on the provided criteria. Raw event logs are not decoded.
     *
     * @param filterOptions - An object specifying filtering criteria for event logs.
     * @returns A promise that resolves to filtered event logs.
     */
    async filterRawEventLogs(filterOptions) {
        return (await this.blocksModule.httpClient.http(http_1.HttpMethod.POST, thorest_1.thorest.logs.post.EVENT_LOGS(), {
            query: {},
            body: filterOptions,
            headers: {}
        }));
    }
    /**
     * Filters event logs based on the provided criteria and decodes them using the provided ABI items.
     * The decoded data is added to the event logs as a new property.
     * @param filterOptions - An object specifying filtering criteria for event logs.
     */
    async filterEventLogs(filterOptions) {
        // Extract raw event logs and ABI items from filter options
        const eventAbis = filterOptions.criteriaSet?.map((c) => c.eventAbi);
        const eventLogs = await this.getRawEventLogs(filterOptions);
        const result = [];
        if (eventAbis !== undefined) {
            const uniqueEventAbis = this.removeDuplicatedAbis(eventAbis);
            eventLogs.forEach((log) => {
                const eventAbi = uniqueEventAbis.get(log.topics[0]);
                if (eventAbi === undefined || eventAbi === null) {
                    throw new sdk_errors_1.InvalidAbiItem('LogsModule.filterEventLogs', 'Topic not found in the provided ABIs.', { type: 'event', value: log.topics[0] });
                }
                log.decodedData = eventAbi.decodeEventLogAsArray({
                    data: sdk_core_1.Hex.of(log.data),
                    topics: log.topics.map((topic) => sdk_core_1.Hex.of(topic))
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
    async filterGroupedEventLogs(filterOptions) {
        // Extract raw event logs and ABI items from filter options
        const eventAbis = filterOptions.criteriaSet?.map((c) => c.eventAbi);
        const eventLogs = await this.getRawEventLogs(filterOptions);
        const result = new Map();
        if (eventAbis !== undefined) {
            const uniqueEventAbis = this.removeDuplicatedAbis(eventAbis);
            // Initialize the result map with empty arrays for each unique ABI item
            uniqueEventAbis.forEach((f) => result.set(f.signatureHash, []));
            eventLogs.forEach((log) => {
                const eventAbi = uniqueEventAbis.get(log.topics[0]);
                if (eventAbi === undefined || eventAbi === null) {
                    throw new sdk_errors_1.InvalidAbiItem('LogsModule.filterGroupedEventLogs', 'Topic not found in the provided ABIs.', { type: 'event', value: log.topics[0] });
                }
                log.decodedData = eventAbi.decodeEventLogAsArray({
                    data: sdk_core_1.Hex.of(log.data),
                    topics: log.topics.map((topic) => sdk_core_1.Hex.of(topic))
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
    async getRawEventLogs(filterOptions) {
        const criteriaSet = filterOptions.criteriaSet?.map((c) => c.criteria);
        // Create new filter options with the criteria set
        const filterRawEventLogsOptions = {
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
    removeDuplicatedAbis(eventAbis) {
        const uniqueEventAbis = new Map();
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
    async filterTransferLogs(filterOptions) {
        return (await this.blocksModule.httpClient.http(http_1.HttpMethod.POST, thorest_1.thorest.logs.post.TRANSFER_LOGS(), {
            query: {},
            body: filterOptions,
            headers: {}
        }));
    }
}
exports.LogsModule = LogsModule;
