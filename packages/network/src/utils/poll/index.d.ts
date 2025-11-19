import { SyncPoll } from './sync';
import { createEventPoll, type EventPoll } from './event';
export type * from './types.d';
declare const Poll: {
    SyncPoll: typeof SyncPoll;
    createEventPoll: typeof createEventPoll;
};
export { Poll, type EventPoll };
//# sourceMappingURL=index.d.ts.map