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
    const rpcEventLogs: LogsRPC[] = eventLogs.map((eventLog: EventLogs) => {
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

            // Not implemented yet.
            // @NOTE: It is implementable, BUT it is not implemented yet for performance reasons.
            // This is because we have to get block details log entry.
            logIndex: '0x0',
            transactionIndex: '0x0'
        } satisfies LogsRPC;
    });
    return rpcEventLogs;
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
    const finalEventLog: EventCriteria[] =
        criteriaAddress.length > 0
            ? criteriaAddress.map((addr: string) => {
                  return {
                      address: addr,
                      topic0: criteriaTopics[0] ?? undefined,
                      topic1: criteriaTopics[1] ?? undefined,
                      topic2: criteriaTopics[2] ?? undefined,
                      topic3: criteriaTopics[3] ?? undefined,
                      topic4: criteriaTopics[4] ?? undefined
                  };
              })
            : [
                  {
                      topic0: criteriaTopics[0] ?? undefined,
                      topic1: criteriaTopics[1] ?? undefined,
                      topic2: criteriaTopics[2] ?? undefined,
                      topic3: criteriaTopics[3] ?? undefined,
                      topic4: criteriaTopics[4] ?? undefined
                  }
              ];

    // Filtering by only topics
    return finalEventLog;
};

export { formatToLogsRPC, getCriteriaSetForInput };
