/**
 * Represents the parameters for a subscription.
 * This interface includes all necessary details for managing a subscription.
 */
interface SubscriptionParams {
    /**
     * The unique identifier for the subscription.
     * This string uniquely identifies the subscription instance.
     */
    readonly subscription: string;

    /**
     * The result associated with the subscription.
     * This can be of any type and contains the data or outcome that the subscription yields.
     */
    readonly result: unknown;
}

/**
 * Describes an event related to a subscription.
 * This interface encapsulates the method invoked and the parameters associated with the subscription event.
 */
interface SubscriptionEvent {
    /**
     * The name of the method associated with the subscription event.
     */
    readonly method: string;

    /**
     * The parameters associated with the subscription event.
     * This includes all necessary details such as the subscription identifier and the result.
     */
    readonly params: SubscriptionParams;
}

/**
 * Defines the options used to filter events in a subscription. These options can specify which events to include based on various blockchain parameters.
 */
interface FilterOptions {
    /**
     * The contract address or addresses to filter for events.
     */
    address?: string | string[];

    /**
     * The starting block number (inclusive) from which to begin filtering events.
     */
    fromBlock?: string;

    /**
     * The ending block number (inclusive) at which to stop filtering events.
     */
    toBlock?: string;

    /**
     * An array of topic identifiers to filter events. Each event must match all specified topics to be included.
     */
    topics?: string[];

    /**
     * The hash of a specific block. If defined, only events from this block are included.
     */
    blockhash?: string;
}

/**
 * Represents a subscription to a specific type of data or event within a system.
 * This could be used for subscribing to updates or changes in the data.
 */
interface Subscription {
    /**
     * The type of subscription, indicating what kind of data or events this subscription pertains to.
     */
    type: string;

    /**
     * Optional configuration options for the subscription that can filter or modify the data received.
     */
    options?: FilterOptions;
}

interface NewHeadsSubscription {
    readonly subscriptionId: string;
    readonly subscription: Subscription;
}

/**
 * Manages multiple subscriptions within a system, keeping track of active subscriptions and the current block number.
 */
interface SubscriptionManager {
    /**
     * A map of subscription identifiers to Subscription objects, keeping track of all log-related subscriptions.
     */
    logSubscriptions: Map<string, Subscription>;

    /**
     * An optional collection of subscriptions specifically for new block headers, indexed by a unique identifier.
     */
    newHeadsSubscription?: NewHeadsSubscription;

    /**
     * The most recent block number that has been processed or observed by the manager, serving as a point of reference for new events.
     */
    currentBlockNumber: number;
}

export { type SubscriptionEvent, type SubscriptionManager, type FilterOptions };
