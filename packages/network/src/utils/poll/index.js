"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poll = void 0;
// Synchronous Polling
const sync_1 = require("./sync");
// Asynchronous Event Polling
const event_1 = require("./event");
const Poll = { SyncPoll: sync_1.SyncPoll, createEventPoll: event_1.createEventPoll };
exports.Poll = Poll;
