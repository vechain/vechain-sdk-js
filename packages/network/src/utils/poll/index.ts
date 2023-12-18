// Synchronous Polling
import { SyncPoll } from './sync';

// Asynchronous Event Polling
import { createEventPoll, EventPoll } from './event';

// Types
export * from './types.d';

const Poll = { SyncPoll, EventPoll, createEventPoll };
export { Poll, EventPoll };
