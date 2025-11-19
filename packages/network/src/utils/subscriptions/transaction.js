"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewTransactionsSubscriptionUrl = void 0;
const thorest_1 = require("../thorest");
/**
 * Returns the URL for subscribing to new transactions through a websocket connection.
 *
 * @param baseURL - The URL of the node to request the subscription from.
 * @returns The websocket subscription URL.
 */
const getNewTransactionsSubscriptionUrl = (baseURL) => {
    return thorest_1.thorest.subscriptions.get.NEW_TRANSACTIONS(baseURL);
};
exports.getNewTransactionsSubscriptionUrl = getNewTransactionsSubscriptionUrl;
