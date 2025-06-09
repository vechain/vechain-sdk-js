import type { LogMetaJSON } from '@thor';

/**
 * [EventLogFilterRequest](http://localhost:8669/doc/stoplight-ui/#/schemas/EventLogFilterRequest) element.
 */
interface EventLogResponseJSON {
    address: string;
    topics: string[];
    data: string;
    meta: LogMetaJSON;
}

export { type EventLogResponseJSON };
