import {
    type EventCriteria,
    type EventLogs
} from '@vechain/vechain-sdk-network';
import { type LogsRPC } from './types';
import { vechain_sdk_core_ethers } from '@vechain/vechain-sdk-core';

/**
 * Output formatter for Event logs.
 * It converts the Event logs into the RPC standard.
 *
 * @param eventLogs - The Event logs to be formatted.
 */
const formatToLogsRPC = (eventLogs: EventLogs[]): LogsRPC[] => {
    // Final RPC event logs formatted
    return eventLogs.map((eventLog: EventLogs) => {
        return {
            transactionHash: eventLog.meta.txID,
            blockHash: eventLog.meta.blockID,
            blockNumber: vechain_sdk_core_ethers.toQuantity(
                eventLog.meta.blockNumber
            ),
            address: eventLog.address,
            data: eventLog.data,
            topics: eventLog.topics,

            // Always false for now
            removed: false,

            // @NOTE: These two fields are not implemented yet. This for performance reasons.
            //
            /**
             * @NOTE: These two fields are not implemented yet.
             * This for performance reasons.
             * We can implement them later if needed.
             *
             * To have these two fields, we need to query a block for each entry into the logs.
             * After from the block, we can get the transaction index and the log index.
             * This is a performance issue because we have to query a block for each entry into the logs.
             */
            logIndex: '0x0',
            transactionIndex: '0x0'
        } satisfies LogsRPC;
    });
};

/**
 * Convert the criteria topics into an array of topics.
 *
 * This because the criteria topics are not an array of topics in vechain,
 * but they are directly enumerated (topic0, topic1, topic2, topic3, topic4).
 *
 * RPC standard requires an array of topics instead.
 *
 * @param criteriaTopicsArray - The criteria topics array.
 * @param address - The address to filter.
 */
const _scatterArrayTopic = (
    criteriaTopicsArray: string[],
    address?: string
): EventCriteria => {
    return {
        address,
        topic0: criteriaTopicsArray[0] ?? undefined,
        topic1: criteriaTopicsArray[1] ?? undefined,
        topic2: criteriaTopicsArray[2] ?? undefined,
        topic3: criteriaTopicsArray[3] ?? undefined,
        topic4: criteriaTopicsArray[4] ?? undefined
    };
};

/**
 * Get the criteria set for the input.
 *
 * Basically with vechain swagger we have:
 *
 * {
 *     address = string | undefined;
 *     topic1: string | undefined;
 *     ...
 *     topic4: string | undefined;
 * }
 *
 * With RPC we can have an array of address:
 *
 * {
 *     **address = string | string[] | undefined;**
 *     topic1: string | undefined;
 * ...
 *     topic4: string | undefined;
 * }.
 *
 * To have a complete research space, we can filter by address and topics, and only by address.
 *
 * @param criteria - The criteria input.
 */
const getCriteriaSetForInput = (criteria: {
    address?: string | string[];
    topics?: string[];
}): EventCriteria[] => {
    // String to an array of addresses and topics
    let criteriaAddress: string[] = [];
    let criteriaTopics: string[] = [];

    // Convert in any case to an array of addresses
    if (criteria.address !== undefined)
        criteriaAddress =
            typeof criteria.address === 'string'
                ? [criteria.address]
                : criteria.address;

    // Convert in any case to an array of topics
    if (criteria.topics !== undefined) criteriaTopics = criteria.topics;

    // Filtering considering the address and topics. For each address, we have to consider the topics
    return criteriaAddress.length > 0
        ? criteriaAddress.map((addr: string) => {
              return _scatterArrayTopic(criteriaTopics, addr);
          })
        : [_scatterArrayTopic(criteriaTopics)];
};

export { formatToLogsRPC, getCriteriaSetForInput };
