import { thorest } from '../thorest';

/**
 * Returns the URL for subscribing to new transactions in the mempool through a websocket connection.
 *
 * @param baseURL - The URL of the node to request the subscription from.
 * @returns The websocket subscription URL.
 */
const getNewTransactionsSubscriptionUrl = (baseURL: string): string => {
    return thorest.subscriptions.get.NEW_TRANSACTIONS(baseURL);
};

export { getNewTransactionsSubscriptionUrl };
