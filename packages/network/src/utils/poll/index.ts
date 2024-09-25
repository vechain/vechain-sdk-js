// Synchronous Polling
import { SyncPoll } from './sync';

// Asynchronous Event Polling
import { createEventPoll, type EventPoll } from './event';

// Types
export type * from './types.d';

const Poll = { SyncPoll, createEventPoll };
export { Poll, type EventPoll };
