import { HexInt } from '@vechain/sdk-core';
import { type EventCriteria, type EventLogs } from '../../../../thor-client';
import { type LogsRPC } from './types';

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
            address: eventLog.address,
            blockHash: eventLog.meta.blockID,
            blockNumber: HexInt.of(eventLog.meta.blockNumber).toString(),
            data: eventLog.data,
            logIndex: '0x0',
            // Always false for now
            removed: false,
            topics: eventLog.topics,
            transactionHash: eventLog.meta.txID,
            transactionIndex: '0x0'

            // @NOTE: logIndex and transactionIndex are not implemented yet. This for performance reasons.
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
        } satisfies LogsRPC;
    });
};

/**
 * Convert the criteria topics into an array of topics.
 *
 * This because the criteria topics are not an array of topics in VeChain,
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
 * Function to generate a set of event criteria based on input criteria.
 * The function takes an object with optional address and topics properties,
 * and returns an array of EventCriteria objects.
 *
 * @param {Object} criteria - The input criteria object.
 * @param {string|string[]} [criteria.address] - A single address string or an array of address strings.
 * @param {string[]|string[][]} [criteria.topics] - A single array of topics or an array of arrays of topics.
 * @returns {EventCriteria[]} An array of EventCriteria objects.
 */
const getCriteriaSetForInput = (criteria: {
    address?: string | string[];
    topics?: string[] | string[][];
}): EventCriteria[] => {
    // String to an array of addresses and topics
    let criteriaAddress: string[] | undefined[] = [];

    // Convert in any case to an array of addresses
    if (criteria.address !== undefined) {
        criteriaAddress =
            typeof criteria.address === 'string'
                ? [criteria.address]
                : criteria.address;
    } else {
        criteriaAddress = [undefined];
    }

    const eventsCriteriaToFlat: EventCriteria[][] = criteriaAddress.map(
        (addr) => {
            return getTopicsPerAddress(addr, criteria.topics ?? []);
        }
    );

    // Flat the array
    return eventsCriteriaToFlat.flat();
};

/**
 * Function to generate a set of event criteria based on input topics and address.
 * The function takes an address and an array of topics and returns an array of EventCriteria objects.
 *
 * @param {string} address - The address to filter.
 * @param {string[]|string[][]} topics - A single array of topics or an array of arrays of topics.
 * @returns {EventCriteria[]} An array of EventCriteria objects.
 */
const getTopicsPerAddress = (
    address: string | undefined,
    topics: string[] | string[][]
): EventCriteria[] => {
    const notArrayTopics: string[] = [];
    const arrayTopics: string[][] = [];

    topics.forEach((topic) => {
        if (!Array.isArray(topic)) {
            notArrayTopics.push(topic);
        }
        if (Array.isArray(topic)) {
            arrayTopics.push(topic);
        }
    });

    const criteriaSet: EventCriteria[] = [];

    if (notArrayTopics.length > 0) {
        criteriaSet.push(_scatterArrayTopic(notArrayTopics, address));
    }

    arrayTopics.forEach((topics) => {
        topics.forEach((topic) => {
            criteriaSet.push({
                address,
                topic0: topic,
                topic1: undefined,
                topic2: undefined,
                topic3: undefined,
                topic4: undefined
            });
        });
    });

    // If no topics are provided, we add an empty criteria set
    if (criteriaSet.length === 0) {
        criteriaSet.push({
            address,
            topic0: undefined,
            topic1: undefined,
            topic2: undefined,
            topic3: undefined,
            topic4: undefined
        });
    }

    return criteriaSet;
};

export { formatToLogsRPC, getCriteriaSetForInput };
