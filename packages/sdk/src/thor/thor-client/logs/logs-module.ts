import { AbstractThorModule } from '../AbstractThorModule';
import { type TransferLogFilter } from '@thor/thor-client/model/logs/TransferLogFilter';
import { TransferLog } from '@thor/thor-client/model/logs/TransferLog';
import {
    QuerySmartContractEvents,
    QueryVETTransferEvents
} from '@thor/thorest';
import { EventLog } from '@thor/thor-client/model/logs/EventLog';
import { type EventLogFilter } from '@thor/thor-client/model/logs/EventLogFilter';
import { type AbiEvent, toEventSelector, decodeEventLog } from 'viem';
import { DecodedEventLog } from '@thor/thor-client/model/logs/DecodedEventLog';
import { IllegalArgumentError } from '@common/errors';
import { log } from '@common/logging';

/**
 * The `LogsClient` class provides methods to interact with log-related endpoints
 * of the VeChainThor blockchain. It allows filtering event and transfer logs.
 */
class LogsModule extends AbstractThorModule {
    /**
     * Filters event logs based on the provided criteria and decodes them using the provided ABI items.
     * The decoded data is added to the event logs as a new property.
     * @param filterOptions - An object specifying filtering criteria for event logs.
     * @param eventAbis - An array of ABI items to decode the event logs.
     */
    public async filterEventLogs(
        filterOptions: EventLogFilter,
        eventAbis: AbiEvent[]
    ): Promise<DecodedEventLog[]> {
        // get the raw event logs
        const eventLogs = await this.getRawEventLogs(filterOptions);
        if (eventLogs.length === 0) {
            log.warn({
                source: 'LogsModule.filterEventLogs',
                message: 'No event logs found.',
                context: { filterOptions }
            });
            return [];
        } else {
            log.debug({
                source: 'LogsModule.filterEventLogs',
                message: `Found ${eventLogs.length} event logs.`
            });
        }

        const result: DecodedEventLog[] = [];

        if (eventAbis !== undefined) {
            const uniqueEventAbis = this.removeDuplicatedAbis(eventAbis);

            eventLogs.forEach((eventLog) => {
                const eventAbi = uniqueEventAbis.get(
                    eventLog.topics[0].toString().toLowerCase()
                );
                if (eventAbi === undefined || eventAbi === null) {
                    log.error({
                        source: 'LogsModule.filterEventLogs',
                        message: 'Topic not found in the provided ABIs.',
                        context: { type: 'event', value: eventLog.topics[0] }
                    });
                    throw new IllegalArgumentError(
                        'LogsModule.filterEventLogs',
                        'Topic not found in the provided ABIs.',
                        { type: 'event', value: eventLog.topics[0] }
                    );
                }
                const topics = eventLog.topics.map(
                    (topic) => topic.toString() as `0x${string}`
                );
                const decodedData = decodeEventLog({
                    abi: [eventAbi],
                    data: eventLog.data.toString() as `0x${string}`,
                    topics: [topics[0], ...topics.slice(1)]
                });
                result.push(DecodedEventLog.of(eventLog, decodedData));
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
        filterOptions: EventLogFilter,
        eventAbis: AbiEvent[]
    ): Promise<DecodedEventLog[][]> {
        // get the raw event logs
        const eventLogs = await this.getRawEventLogs(filterOptions);
        if (eventLogs.length === 0) {
            log.warn({
                source: 'LogsModule.filterGroupedEventLogs',
                message: 'No event logs found.',
                context: { filterOptions }
            });
            return [];
        } else {
            log.debug({
                source: 'LogsModule.filterGroupedEventLogs',
                message: `Found ${eventLogs.length} event logs.`
            });
        }

        const result = new Map<string, DecodedEventLog[]>();

        if (eventAbis !== undefined) {
            const uniqueEventAbis = this.removeDuplicatedAbis(eventAbis);

            // Initialize the result map with empty arrays for each unique ABI item
            uniqueEventAbis.forEach((abi) =>
                result.set(toEventSelector(abi).toLowerCase(), [])
            );

            eventLogs.forEach((eventLog) => {
                const eventAbi = uniqueEventAbis.get(
                    eventLog.topics[0].toString().toLowerCase()
                );
                if (eventAbi === undefined || eventAbi === null) {
                    log.error({
                        source: 'LogsModule.filterGroupedEventLogs',
                        message: 'Topic not found in the provided ABIs.',
                        context: { type: 'event', value: eventLog.topics[0] }
                    });
                    throw new IllegalArgumentError(
                        'LogsModule.filterGroupedEventLogs',
                        'Topic not found in the provided ABIs.',
                        { type: 'event', value: eventLog.topics[0] }
                    );
                }
                const topics = eventLog.topics.map(
                    (topic) => topic.toString() as `0x${string}`
                );
                const decodedData = decodeEventLog({
                    abi: [eventAbi],
                    data: eventLog.data.toString() as `0x${string}`,
                    topics: [topics[0], ...topics.slice(1)]
                });
                const decodedEventLog = DecodedEventLog.of(
                    eventLog,
                    decodedData
                );
                result
                    .get(eventLog.topics[0].toString().toLowerCase())
                    ?.push(decodedEventLog);
            });
        }
        return Array.from(result.values());
    }

    /**
     * Filters event logs based on the provided criteria without decoding them.
     * @param filterOptions - An object specifying filtering criteria for event logs.
     * @private Returns a promise that resolves to an array of event logs.
     */
    private async getRawEventLogs(
        filterOptions: EventLogFilter
    ): Promise<EventLog[]> {
        const query = QuerySmartContractEvents.of(filterOptions);
        const resp = await query.askTo(this.httpClient);
        return resp.response.map((log) => EventLog.of(log));
    }

    /**
     * Filters event logs based on the provided criteria. Raw event logs are not decoded.
     *
     * @param filterOptions - An object specifying filtering criteria for event logs.
     * @returns A promise that resolves to filtered event logs.
     */
    public async filterRawEventLogs(
        filterOptions: EventLogFilter
    ): Promise<EventLog[]> {
        return await this.getRawEventLogs(filterOptions);
    }

    /**
     * Removes duplicated ABI items from the provided array.
     * ABI items are considered duplicated if they have the same signature hash.
     * @param eventAbis - An array of event ABI items.
     * @private Returns a map of unique ABI items by signature hash.
     */
    private removeDuplicatedAbis(eventAbis: AbiEvent[]): Map<string, AbiEvent> {
        const uniqueEventAbis = new Map<string, AbiEvent>();
        eventAbis.forEach((obj) => {
            const signatureHash = toEventSelector(obj).toLowerCase();
            if (!uniqueEventAbis.has(signatureHash)) {
                uniqueEventAbis.set(signatureHash, obj);
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
        filterOptions: TransferLogFilter
    ): Promise<TransferLog[]> {
        const query = QueryVETTransferEvents.of(filterOptions);
        const resp = await query.askTo(this.httpClient);
        return resp.response.map((log) => new TransferLog(log));
    }
}

export { LogsModule };
