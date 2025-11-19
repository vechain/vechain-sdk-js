import { type EventCriteria, type EventLogs } from '../../../../thor-client';
import { type LogsRPC } from './types';
/**
 * Output formatter for Event logs.
 * It converts the Event logs into the RPC standard.
 *
 * @param eventLogs - The Event logs to be formatted.
 */
declare const formatToLogsRPC: (eventLogs: EventLogs[]) => LogsRPC[];
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
declare const getCriteriaSetForInput: (criteria: {
    address?: string | string[];
    topics?: string[] | string[][];
}) => EventCriteria[];
export { formatToLogsRPC, getCriteriaSetForInput };
//# sourceMappingURL=formatter.d.ts.map