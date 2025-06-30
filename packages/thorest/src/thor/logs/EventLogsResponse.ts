import {
    EventLogResponse,
    type EventLogResponseJSON,
    type EventLogsResponseJSON
} from '@thor';
import { IllegalArgumentError } from '@vechain/sdk-core';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/thorest/src/thor/logs/EventLogsResponse.ts!';

/**
 * [EventLogFilterRequest](http://localhost:8669/doc/stoplight-ui/#/schemas/EventLogFilterRequest) element.
 */
class EventLogsResponse extends Array<EventLogResponse> {
    /**
     * Creates a new TransferLogsResponse instance.
     * Special constructor pattern required for Array inheritance.
     * Array constructor is first called with a length parameter,
     * so we need this pattern to properly handle array data instead.
     *
     * @param json - The JSON array containing transfer log data
     * @returns A new EventLogsResponse instance containing EventLogResponse objects
     */
    constructor(json: EventLogsResponseJSON) {
        super();
        try {
            return Object.setPrototypeOf(
                Array.from(
                    json ?? [],
                    (
                        eventLogResponseJSON: EventLogResponseJSON
                    ): EventLogResponse => {
                        return new EventLogResponse(eventLogResponseJSON);
                    }
                ),
                EventLogsResponse.prototype
            ) as EventLogsResponse;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: EventLogsResponseJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the EventLogsResponse instance to a JSON array
     * @returns {EventLogsResponseJSON} An array of event logs in JSON format
     */
    toJSON(): EventLogsResponseJSON {
        return this.map((response): EventLogResponseJSON => {
            return response.toJSON();
        });
    }
}

export { EventLogsResponse };
