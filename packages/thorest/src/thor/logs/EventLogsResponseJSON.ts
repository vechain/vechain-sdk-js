-import type { EventLogResponseJSON } from '@thor';
+import type { EventLogResponseJSON } from '@thor/logs/EventLogResponseJSON';

/**
 * [EventLogFilterRequest](http://localhost:8669/doc/stoplight-ui/#/schemas/EventLogFilterRequest)
 */
interface EventLogsResponseJSON extends Array<EventLogResponseJSON> {}

export { type EventLogsResponseJSON };
