import { type EventLog } from './EventLog';

/**
 * The data of a decoded event log.
 */
interface DecodedEventLogData {
    eventName: string;
    args: Record<string, unknown>;
}

/**
 * A decoded event log.
 */
class DecodedEventLog {
    /**
     * The event log.
     */
    readonly eventLog: EventLog;

    /**
     * The decoded data of the event log.
     */
    readonly decodedData?: DecodedEventLogData;

    /**
     * Creates a new DecodedEventLog instance.
     */
    constructor(eventLog: EventLog, decodedData: DecodedEventLogData) {
        this.eventLog = eventLog;
        this.decodedData = decodedData;
    }

    /**
     * Creates a new DecodedEventLog instance from an event log and decoded data.
     * @param eventLog - The event log.
     * @param decodedData - The decoded data of the event log.
     * @returns A new DecodedEventLog instance.
     */
    static of(
        eventLog: EventLog,
        decodedData: DecodedEventLogData
    ): DecodedEventLog {
        return new DecodedEventLog(eventLog, decodedData);
    }
}

export { DecodedEventLog, type DecodedEventLogData };
