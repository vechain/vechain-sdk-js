export type * from './types.d';
/**
 * Subscriptions utilities.
 * Contains functions for obtaining URLs for subscribing to events through a websocket connection.
 */
export declare const subscriptions: {
    getEventSubscriptionUrl: (baseURL: string, event: import("./types.d").EventLike, indexedValues?: unknown[], options?: import("./types.d").EventSubscriptionOptions) => string;
    getBlockSubscriptionUrl: (baseURL: string, options?: import("./types.d").BlockSubscriptionOptions) => string;
    getNewTransactionsSubscriptionUrl: (baseURL: string) => string;
    getVETtransfersSubscriptionUrl: (baseURL: string, options?: import("./types.d").VETtransfersSubscriptionOptions) => string;
    getLegacyBeatSubscriptionUrl: (baseURL: string, options?: import("./types.d").BlockSubscriptionOptions) => string;
    getBeatSubscriptionUrl: (baseURL: string, options?: import("./types.d").BlockSubscriptionOptions) => string;
};
//# sourceMappingURL=index.d.ts.map