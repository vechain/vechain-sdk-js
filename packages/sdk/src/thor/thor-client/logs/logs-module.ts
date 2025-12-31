import { AbstractThorModule } from '../AbstractThorModule';
import { type TransferLogFilter } from '@thor/thor-client/model/logs/TransferLogFilter';
import { TransferLog } from '@thor/thor-client/model/logs/TransferLog';
import {
    QuerySmartContractEvents,
    QueryVETTransferEvents
} from '@thor/thorest';
import { EventLog } from '@thor/thor-client/model/logs/EventLog';
import { type EventLogFilter } from '@thor/thor-client/model/logs/EventLogFilter';
import { type AbiEvent, toEventSelector } from 'viem';
import { DecodedEventLog } from '@thor/thor-client/model/logs/DecodedEventLog';
import { IllegalArgumentError } from '@common/errors';
import { log } from '@common/logging';

/**
 * The `LogsClient` class provides methods to interact with log-related endpoints
 * of the VeChainThor blockchain. It allows filtering event and transfer logs.
 */
class LogsModule extends AbstractThorModule {
    /**
     * Gets the event ABI from the provided map of unique event ABIs.
     * @param unique - A map of unique event ABIs indexed by topic0.
     * @param topic0 - The topic0 of the event.
     * @returns The event ABI.
     */
    private getEventAbiFromMap(
        unique: Map<string, AbiEvent>,
        topic0: string
    ): AbiEvent {
        const abi = unique.get(topic0.toLowerCase());
        if (!abi) {
            log.error({
                source: 'LogsModule.getEventAbiFromMap',
                message: 'Topic not found in the provided ABIs.',
                context: { type: 'event', value: topic0 }
            });
            throw new IllegalArgumentError(
                'LogsModule.getEventAbiFromMap',
                'Topic not found in the provided ABIs.',
                { type: 'event', value: topic0 }
            );
        }
        return abi;
    }

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
        const eventLogs = await this.getRawEventLogs(filterOptions);
        if (eventLogs.length === 0) {
            log.warn({
                source: 'LogsModule.filterEventLogs',
                message: 'No event logs found.',
                context: { filterOptions }
            });
            return [];
        }
        const unique = this.removeDuplicatedAbis(eventAbis);
        return eventLogs.map((eventLog) =>
            eventLog.decode(
                this.getEventAbiFromMap(unique, eventLog.topics[0].toString())
            )
        );
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
        const eventLogs = await this.getRawEventLogs(filterOptions);
        if (eventLogs.length === 0) {
            log.warn({
                source: 'LogsModule.filterGroupedEventLogs',
                message: 'No event logs found.',
                context: { filterOptions }
            });
            return [];
        }
        const unique = this.removeDuplicatedAbis(eventAbis);
        const groups = new Map<string, DecodedEventLog[]>();
        for (const abi of unique.values()) {
            groups.set(toEventSelector(abi).toLowerCase(), []);
        }
        for (const eventLog of eventLogs) {
            const decoded = eventLog.decode(
                this.getEventAbiFromMap(unique, eventLog.topics[0].toString())
            );
            groups
                .get(eventLog.topics[0].toString().toLowerCase())
                ?.push(decoded);
        }
        return [...groups.values()];
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
        const eventLogs = resp.response.map((log) => EventLog.of(log));
        if (eventLogs.length === 0) {
            log.warn({
                source: 'LogsModule.getRawEventLogs',
                message: 'No event logs found.',
                context: { filterOptions }
            });
            return [];
        } else {
            log.debug({
                source: 'LogsModule.getRawEventLogs',
                message: `Found ${eventLogs.length} event logs.`
            });
        }
        return eventLogs;
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
