import { EventEmitter } from 'events';
import {
    type EIP1193ProviderMessage,
    type EIP1193RequestArguments
} from '../eip1193';
import { assert, DATA } from '@vechain/vechain-sdk-errors';
import {
    type BlockDetail,
    type EventPoll,
    Poll,
    type ThorClient
} from '@vechain/vechain-sdk-network';
import { ethGetLogs, RPC_METHODS, RPCMethodsMap } from '../utils';
import { type Wallet } from '@vechain/vechain-sdk-wallet';
import {
    type FilterOptions,
    type SubscriptionEvent,
    type SubscriptionManager
} from './types';
import { POLLING_INTERVAL } from './constants';
import { vechain_sdk_core_ethers } from '@vechain/vechain-sdk-core';

/**
 * Our core provider class for vechain
 */
class VechainProvider extends EventEmitter implements EIP1193ProviderMessage {
    public readonly subscriptionManager: SubscriptionManager = {
        logSubscriptions: new Map(),
        currentBlockNumber: 0
    };

    /**
     * Poll instance for subscriptions
     * @private
     */
    private pollInstance?: EventPoll<SubscriptionEvent[]>;

    /**
     * Constructor for VechainProvider
     *
     * @param thorClient - ThorClient instance.
     * @param wallet - Wallet instance. It is optional because the majority of the methods do not require a wallet.
     */
    constructor(
        readonly thorClient: ThorClient,
        readonly wallet?: Wallet
    ) {
        super();
        this.startSubscriptionsPolling();
    }

    /**
     * Destroys the provider by closing the thorClient
     * This is due to the fact that thorClient might be initialized with a polling interval to
     * keep the head block updated.
     */
    public destroy(): void {
        this.thorClient.destroy();
        if (this.pollInstance !== undefined) {
            this.pollInstance.stopListen();
        }
    }

    public async request(args: EIP1193RequestArguments): Promise<unknown> {
        // Check if the method is supported
        assert(
            Object.values(RPC_METHODS)
                .map((key) => key.toString())
                .includes(args.method),
            DATA.INVALID_DATA_TYPE,
            'Invalid RPC method given as input.',
            { method: args.method }
        );

        // Get the method from the RPCMethodsMap and call it
        return await RPCMethodsMap(this.thorClient, this, this.wallet)[
            args.method
        ](args.params as unknown[]);
    }

    private startSubscriptionsPolling(): void {
        this.pollInstance = Poll.createEventPoll(async () => {
            const data: SubscriptionEvent[] = [];

            const nextBlock = await this.nextBlock();

            if (
                nextBlock !== null &&
                this.subscriptionManager.newHeadsSubscription !== undefined
            ) {
                data.push({
                    method: 'eth_subscription',
                    params: {
                        subscription:
                            this.subscriptionManager.newHeadsSubscription
                                .subscriptionId,
                        result: nextBlock
                    }
                });
            }

            if (this.subscriptionManager.logSubscriptions.size > 0) {
                const logs = await this.getLogsRPC();
                data.push(...logs);
            }

            return data;
        }, POLLING_INTERVAL).onData(
            (subscriptionEvents: SubscriptionEvent[]) => {
                subscriptionEvents.forEach((event) => {
                    this.emit('message', event);
                });
            }
        );

        this.pollInstance.startListen();
    }

    /**
     * Fetches logs for all active log subscriptions managed by `subscriptionManager`.
     * This method iterates over each log subscription, constructs filter options based on the
     * subscription details, and then queries for logs using these filter options.
     *
     * Each log query is performed asynchronously, and the method waits for all queries to complete
     * before returning. The result for each subscription is encapsulated in a `SubscriptionEvent`
     * object, which includes the subscription ID and the fetched logs.
     *
     * This function is intended to be called when there's a need to update or fetch the latest
     * logs for all active subscriptions, typically in response to a new block being mined or
     * at regular intervals to keep subscription data up to date.
     *
     * @returns {Promise<SubscriptionEvent[]>} A promise that resolves to an array of `SubscriptionEvent`
     * objects, each containing the subscription ID and the corresponding logs fetched for that
     * subscription. The promise resolves to an empty array if there are no active log subscriptions.
     */
    private async getLogsRPC(): Promise<SubscriptionEvent[]> {
        // Convert the logSubscriptions Map to an array of promises, each promise corresponds to a log fetch operation
        const promises = Array.from(
            this.subscriptionManager.logSubscriptions.entries()
        ).map(async ([subscriptionId, subscriptionDetails]) => {
            const currentBlock = vechain_sdk_core_ethers.toQuantity(
                this.subscriptionManager.currentBlockNumber
            );
            // Construct filter options for the Ethereum logs query based on the subscription details
            const filterOptions: FilterOptions = {
                address: subscriptionDetails.options?.address, // Contract address to filter the logs by
                fromBlock: currentBlock,
                toBlock: currentBlock,
                topics: subscriptionDetails.options?.topics // Topics to filter the logs by
            };

            // Fetch logs based on the filter options and construct a SubscriptionEvent object
            return {
                method: 'eth_subscription',
                params: {
                    subscription: subscriptionId, // Subscription ID
                    result: await ethGetLogs(this.thorClient, [filterOptions]) // The actual log data fetched from Ethereum node
                }
            };
        });

        // Wait for all log fetch operations to complete and return an array of SubscriptionEvent objects
        const subscriptionEvents = await Promise.all(promises);
        // Filter out empty results
        return subscriptionEvents.filter(
            (event) => event.params.result.length > 0
        );
    }

    /**
     * Retrieves the details of the next block in the blockchain, if available.
     * Increments the current block number tracked by `subscriptionManager` and returns the details of the newly fetched block.
     *
     * Only attempts to fetch the next block if there are active log subscriptions
     * or if a new heads subscription exists. If the next block is successfully fetched,
     * the current block number is incremented, and the block details are returned.
     * Returns `null` if there are no subscriptions or the next block cannot be fetched.
     *
     * @returns {Promise<BlockDetail | null>} A promise that resolves to the details of the next block
     * as a `BlockDetail` object if the block exists and can be fetched; otherwise, `null`.
     */
    private async nextBlock(): Promise<BlockDetail | null> {
        // Initialize result to null, indicating no block found initially
        let result: BlockDetail | null = null;

        // Proceed only if there are active log subscriptions or a new heads subscription is present
        if (
            this.subscriptionManager.logSubscriptions.size > 0 ||
            this.subscriptionManager.newHeadsSubscription !== undefined
        ) {
            // Fetch the block details for the current block number
            const block = await this.thorClient.blocks.getBlock(
                this.subscriptionManager.currentBlockNumber
            );

            // If the block is successfully fetched (not undefined or null), update the result and increment the block number
            if (block !== undefined && block !== null) {
                this.subscriptionManager.currentBlockNumber++; // Move to the next block number
                result = block; // Set the fetched block as the result
            }
        }

        // Return the fetched block details or null if no block was fetched
        return result;
    }
}

export { VechainProvider };
