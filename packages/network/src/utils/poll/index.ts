// Synchronous Polling
import { sleep, SyncPoll } from './sync';

// Asynchronous Event Polling
import { createEventPoll, EventPoll } from './event';

// Types
export * from './types.d';

const Poll = { SyncPoll, sleep, EventPoll, createEventPoll };
export { Poll, EventPoll };
