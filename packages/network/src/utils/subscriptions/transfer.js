"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVETtransfersSubscriptionUrl = void 0;
const thorest_1 = require("../thorest");
/**
 * Returns the URL for subscribing to new VET transfers through a websocket connection.
 *
 * @param baseURL - The URL of the node to request the subscription from.
 * @param options - (optional) other optional parameters for the request.
 *                  `blockID` - The block id to start from, defaults to the best block.
 *                  `signerAddress` - The address of the signer of the transaction to filter transfers by.
 *                  `sender` - The sender address to filter transfers by.
 *                  `recipient` - The recipient address to filter transfers by.
 *
 * @returns The websocket subscription URL.
 */
const getVETtransfersSubscriptionUrl = (baseURL, options) => {
    return thorest_1.thorest.subscriptions.get.VET_TRANSFER(baseURL, {
        position: options?.blockID,
        signerAddress: options?.signerAddress,
        sender: options?.sender,
        receiver: options?.recipient
    });
};
exports.getVETtransfersSubscriptionUrl = getVETtransfersSubscriptionUrl;
