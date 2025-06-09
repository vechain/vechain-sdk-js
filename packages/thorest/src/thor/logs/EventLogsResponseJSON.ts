import type { EventLogResponseJSON } from '@thor';

/**
 * [EventLogFilterRequest](http://localhost:8669/doc/stoplight-ui/#/schemas/EventLogFilterRequest)
 */
interface EventLogsResponseJSON extends Array<EventLogResponseJSON> {}

export { type EventLogsResponseJSON };
