import { getBeatSubscriptionUrl, getLegacyBeatSubscriptionUrl } from './beat';
import { getBlockSubscriptionUrl } from './block';
import { getEventSubscriptionUrl } from './event';
import { getNewTransactionsSubscriptionUrl } from './transaction';
import { getVETtransfersSubscriptionUrl } from './transfer';

export * from './types.d';

/**
 * Subscriptions utilities.
 * Contains functions for obtaining URLs for subscribing to events through a websocket connection.
 */
export const subscriptions = {
    getEventSubscriptionUrl,
    getBlockSubscriptionUrl,
    getNewTransactionsSubscriptionUrl,
    getVETtransfersSubscriptionUrl,
    getLegacyBeatSubscriptionUrl,
    getBeatSubscriptionUrl
};
