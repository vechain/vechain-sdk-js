import { type VETtransfersSubscriptionOptions } from './types';
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
declare const getVETtransfersSubscriptionUrl: (baseURL: string, options?: VETtransfersSubscriptionOptions) => string;
export { getVETtransfersSubscriptionUrl };
//# sourceMappingURL=transfer.d.ts.map