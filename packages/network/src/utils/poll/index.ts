// Synchronous Polling
import { SyncPoll } from './sync';

// Asynchronous Event Polling
import { EventPoll } from './event';

// Types
export * from './types.d';

const Poll = { SyncPoll, EventPoll };
export { Poll };
