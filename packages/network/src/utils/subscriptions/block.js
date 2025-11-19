"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockSubscriptionUrl = void 0;
const thorest_1 = require("../thorest");
/**
 * Returns the URL for subscribing to new blocks through a websocket connection.
 *
 * @param baseURL - The URL of the node to request the subscription from.
 * @param options - (optional) other optional parameters for the request.
 *                 `blockID` - The block id to start from, defaults to the best block.
 *
 * @returns The websocket subscription URL.
 */
const getBlockSubscriptionUrl = (baseURL, options) => {
    return thorest_1.thorest.subscriptions.get.BLOCK(baseURL, options?.blockID);
};
exports.getBlockSubscriptionUrl = getBlockSubscriptionUrl;
