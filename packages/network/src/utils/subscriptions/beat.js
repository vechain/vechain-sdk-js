"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBeatSubscriptionUrl = exports.getLegacyBeatSubscriptionUrl = void 0;
const thorest_1 = require("../thorest");
/**
 * Returns the URL for subscribing to new beats through a websocket connection.
 * @note This subscribes to the legacy beats.
 * [Legacy Beat source code](https://github.com/vechain/thor/blob/abf1da466b554dcc9c1ad30cb8e75a860b046bf5/api/subscriptions/beat_reader.go#L29)
 *
 * @param baseURL - The URL of the node to request the subscription from.
 * @param options - (optional) other optional parameters for the request.
 *                  `blockID` - The block id to start from, defaults to the best block.
 *
 * @returns The websocket subscription URL.
 */
const getLegacyBeatSubscriptionUrl = (baseURL, options) => {
    return thorest_1.thorest.subscriptions.get.BEAT_LEGACY(baseURL, options?.blockID);
};
exports.getLegacyBeatSubscriptionUrl = getLegacyBeatSubscriptionUrl;
/**
 * Returns the URL for subscribing to new beats through a websocket connection.
 * @note this subscribes to the updated version of the beats. The new version uses a dynamic size bloom filter.
 *
 * @param baseURL - The URL of the node to request the subscription from.
 * @param options - (optional) other optional parameters for the request.
 *                 `blockID` - The block id to start from, defaults to the best block.
 *
 * @returns The websocket subscription URL.
 */
const getBeatSubscriptionUrl = (baseURL, options) => {
    return thorest_1.thorest.subscriptions.get.BEAT(baseURL, options?.blockID);
};
exports.getBeatSubscriptionUrl = getBeatSubscriptionUrl;
