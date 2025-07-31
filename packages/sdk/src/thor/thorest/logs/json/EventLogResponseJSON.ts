import type { LogMetaJSON } from '@thor/thorest/json';

/**
 * [EventLogFilterRequest](http://localhost:8669/doc/stoplight-ui/#/schemas/EventLogResponse) element.
 */
interface EventLogResponseJSON {
    address: string;
    topics: string[];
    data: string;
    meta: LogMetaJSON;
}

export { type EventLogResponseJSON };
