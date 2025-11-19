"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptions = void 0;
const beat_1 = require("./beat");
const block_1 = require("./block");
const event_1 = require("./event");
const transaction_1 = require("./transaction");
const transfer_1 = require("./transfer");
/**
 * Subscriptions utilities.
 * Contains functions for obtaining URLs for subscribing to events through a websocket connection.
 */
exports.subscriptions = {
    getEventSubscriptionUrl: event_1.getEventSubscriptionUrl,
    getBlockSubscriptionUrl: block_1.getBlockSubscriptionUrl,
    getNewTransactionsSubscriptionUrl: transaction_1.getNewTransactionsSubscriptionUrl,
    getVETtransfersSubscriptionUrl: transfer_1.getVETtransfersSubscriptionUrl,
    getLegacyBeatSubscriptionUrl: beat_1.getLegacyBeatSubscriptionUrl,
    getBeatSubscriptionUrl: beat_1.getBeatSubscriptionUrl
};
