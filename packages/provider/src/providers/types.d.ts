import { type vechain_sdk_core_ethers } from '@vechain/vechain-sdk-core';

/**
 * Represents an event that occurs within a subscription context, containing the event's type and associated data.
 */
interface SubscriptionEvent {
    /**
     * The type of the event, typically used to distinguish between different kinds of events within a subscription service.
     */
    readonly type: string;

    /**
     * The data associated with the event, which can be of any type. The structure of this data depends on the event type.
     */
    readonly data: unknown;
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
 * Manages subscriptions to blockchain events, keeping track of active subscriptions and the current block number.
 */
interface SubscriptionManager {
    /**
     * A collection of active subscriptions, identified by a unique string key, with each subscription potentially having its own filtering options.
     */
    subscriptions: Map<string, FilterOptions | undefined>;

    /**
     * The current block number that the subscription manager is aware of. This is used to track the latest block number in the blockchain context.
     */
    currentBlockNumber: number;
}

/**
 * An `EventEmitterable` interface is akin to an EventEmitter,
 * but with asynchronous access to its methods.
 *
 * It follows the observer pattern, facilitating event-driven programming.
 *
 * ----- TEMPORARY COMMENT -----
 * These methods will be implemented by the abstract provider.
 * Each subscribe type will be handled by a dedicated subscriber class (e.g, PollingBlockSubscriber, PollingEventSubscriber (polls an event for its logs), etc.)
 *
 * See hardhat-ethers-plugin and ethers implementations for more details.
 *
 * https://github.com/ethers-io/ethers.js/blob/6ee1a5f8bb38ec31fa84c00aae7f091e1d3d6837/src.ts/utils/events.ts#L21
 * -----------------------------
 */
type EventEmitterable<T> = vechain_sdk_core_ethers.EventEmitterable<T>;

/**
 *  ----- TEMPORARY COMMENT -----
 * ContractRunner is an ethers interface which is used by ether's Provider.
 * We can change the naming if needed.
 * -----------------------------
 */
interface ContractRunner {
    /**
     * Required to estimate gas.
     *
     * ----- TEMPORARY COMMENT -----
     * estimateGas will call `estimateGas` method which will be defined by the driver.
     * estimateGas will use Transaction.intrinsicGas() + the explainer functionality of driver-no-vendor.
     *
     * @param tx - TransactionRequest can be refactored to our `TransactionBody` (core/src/transaction/types.d.ts)
     *             and then internally we perform all operations needed (e.g., creation of `Transaction` object and calculation of estimateGas)
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    estimateGas?: (tx: TransactionRequest) => Promise<bigint>;

    /**
     * Required for pure, view or static calls to contracts
     *
     * ----- TEMPORARY COMMENT -----
     * call can be implemented by using call() of account-visitor.ts or compat.ts
     * This depends on driver-no-vendor that uses httpPost and creates a query for Simple net's `query` NetParam
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    call?: (tx: TransactionRequest) => Promise<string>;

    /**
     *  Required to support ENS names
     *
     * ----- TEMPORARY COMMENT -----
     * resolveName will not be used in first release.
     * Maybe we can consider it in the future when VNS is supported.
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    resolveName?: (name: string) => Promise<null | string>;

    /**
     *  Required for state mutating calls
     *
     * ----- TEMPORARY COMMENT -----
     * sendTransaction will call `sendTransaction` method which will be implemented in driver.
     * Internally we will get the raw tx needed to `sendTransaction`.
     *
     * @param tx - TransactionRequest can be refactored to our `Transaction` (core/src/transaction/types.d.ts)
     *             in this case we need to create a `Transaction` object that is signed.
     *
     * TO_MODIFY - typesafety
     * -----------------------------
     */
    sendTransaction?: (tx: TransactionRequest) => Promise<TransactionResponse>;
}

export {
    type EventEmitterable,
    type SubscriptionEvent,
    type SubscriptionManager,
    type FilterOptions
};
