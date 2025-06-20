import { HexInt } from '@vechain/sdk-core';
import {
    JSONRPCMethodNotFound,
    JSONRPCMethodNotImplemented
} from '@vechain/sdk-errors';
import { EventEmitter } from 'events';
import { type VeChainSigner } from '../../../signer';
import {
    type CompressedBlockDetail,
    type ThorClient
} from '../../../thor-client';
import { type EventPoll, Poll, vnsUtils } from '../../../utils';
import {
    type EIP1193ProviderMessage,
    type EIP1193RequestArguments
} from '../../eip1193';
import { type ProviderInternalWallet } from '../../helpers';
import {
    ethGetLogs,
    POLLING_INTERVAL,
    RPC_METHODS,
    RPCMethodsMap
} from '../../utils';
import {
    type FilterOptions,
    type SubscriptionEvent,
    type SubscriptionManager
} from './types';

/**
 * Our core provider class for VeChain
 */
class VeChainProvider extends EventEmitter implements EIP1193ProviderMessage {
    public readonly subscriptionManager: SubscriptionManager = {
        logSubscriptions: new Map(),
        currentBlockNumber: -1
    };

    /**
     * Poll instance for subscriptions
     *
     * @private
     */
    private pollInstance?: EventPoll<SubscriptionEvent[]>;

    /**
     * Constructor for VeChainProvider
     *
     * @param thorClient - ThorClient instance.
     * @param wallet - ProviderInternalWallet instance. It is optional because the majority of the methods do not require a wallet.
     * @param enableDelegation - Enable fee delegation or not.
     * @throws {JSONRPCInvalidParams}
     *
     */
    constructor(
        readonly thorClient: ThorClient,
        readonly wallet?: ProviderInternalWallet,
        readonly enableDelegation: boolean = false
    ) {
        super();
    }

    /**
     * Destroys the provider by closing the thorClient and stopping the provider poll instance if present.
     * This is because thorClient and the provider might be initialized with a polling interval.
     */
    public destroy(): void {
        this.thorClient.destroy();
        if (this.pollInstance !== undefined) {
            this.pollInstance.stopListen();
            this.pollInstance = undefined;
        }
    }

    /**
     * This method is used to send a request to the provider.
     * Basically, it is a wrapper around the RPCMethodsMap.
     *
     * @param args - Method and parameters to be used for the request.
     * @returns The result of the request.
     * @throws {JSONRPCMethodNotFound}
     */
    public async request(args: EIP1193RequestArguments): Promise<unknown> {
        // Check if the method is supported
        if (
            !Object.values(RPC_METHODS)
                .map((key) => key.toString())
                .includes(args.method)
        ) {
            const error = new JSONRPCMethodNotFound(
                'VeChainProvider.request()',
                'Method not found',
                { code: -32601, message: 'Method not found' }
            );

            // Override the error message with our custom formatted message
            throw error;
        }

        const methodsMap = RPCMethodsMap(this.thorClient, this);

        // If method is in enum but not in map, throw "not implemented"
        if (!(args.method in methodsMap)) {
            throw new JSONRPCMethodNotImplemented(
                args.method,
                'Method not implemented',
                {
                    code: -32004,
                    message: 'Method not supported'
                }
            );
        }

        // Get the method from the RPCMethodsMap and call it
        return await methodsMap[args.method](args.params as unknown[]);
    }

    /**
     * Initializes and starts the polling mechanism for subscription events.
     * This method sets up an event poll that periodically checks for new events related to active
     * subscriptions, such as 'newHeads' or log subscriptions. When new data is available, it emits
     * these events to listeners.
     *
     * This method leverages the `Poll.createEventPoll` utility to create the polling mechanism,
     * which is then started by invoking `startListen` on the poll instance.
     */
    public startSubscriptionsPolling(): boolean {
        let result = false;
        if (this.pollInstance === undefined) {
            this.pollInstance = Poll.createEventPoll(async () => {
                const allEvents: SubscriptionEvent[] = [];

                const currentBlock = await this.getCurrentBlock();

                if (currentBlock !== null) {
                    // Initialize currentBlockNumber if it's -1 (first time)
                    if (this.subscriptionManager.currentBlockNumber === -1) {
                        this.subscriptionManager.currentBlockNumber =
                            currentBlock.number;
                    }

                    // Process all blocks from currentBlockNumber up to and including currentBlock.number
                    for (
                        let blockNumber =
                            this.subscriptionManager.currentBlockNumber;
                        blockNumber <= currentBlock.number;
                        blockNumber++
                    ) {
                        const blockEvents: SubscriptionEvent[] = [];

                        // Emit newHeads event if subscribed
                        if (
                            this.subscriptionManager.newHeadsSubscription !==
                            undefined
                        ) {
                            blockEvents.push({
                                method: 'eth_subscription',
                                params: {
                                    subscription:
                                        this.subscriptionManager
                                            .newHeadsSubscription
                                            .subscriptionId,
                                    result: currentBlock
                                }
                            });
                        }

                        // Get logs for all log subscriptions
                        if (
                            this.subscriptionManager.logSubscriptions.size > 0
                        ) {
                            const logs = await this.getLogsRPC(blockNumber);
                            blockEvents.push(...logs);
                        }

                        // Update currentBlockNumber to the next block we should look for
                        // This ensures we don't process the same block multiple times
                        this.subscriptionManager.currentBlockNumber =
                            blockNumber + 1;

                        // Add all events from this block to the total collection
                        allEvents.push(...blockEvents);
                    }
                }
                return allEvents;
            }, POLLING_INTERVAL).onData(
                (subscriptionEvents: SubscriptionEvent[]) => {
                    subscriptionEvents.forEach((event) => {
                        this.emit('message', event);
                    });
                }
            );

            this.pollInstance.startListen();
            result = true;
        }
        return result;
    }

    /**
     * Stops the polling mechanism for subscription events.
     * This method stops the polling mechanism for subscription events, if it is active.
     *
     * @returns {boolean} A boolean indicating whether the polling mechanism was stopped.
     */
    public stopSubscriptionsPolling(): boolean {
        let result = false;
        if (this.pollInstance !== undefined) {
            this.pollInstance.stopListen();
            this.pollInstance = undefined;
            result = true;
        }
        return result;
    }

    /**
     * Checks if there are active subscriptions.
     * This method checks if there are any active log subscriptions or a new heads subscription.
     *
     * @returns {boolean} A boolean indicating whether there are active subscriptions.
     */
    public isThereActiveSubscriptions(): boolean {
        return (
            this.subscriptionManager.logSubscriptions.size > 0 ||
            this.subscriptionManager.newHeadsSubscription !== undefined
        );
    }

    /**
     * Returns the poll instance for subscriptions.
     */
    public getPollInstance(): EventPoll<SubscriptionEvent[]> | undefined {
        return this.pollInstance;
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
     * @param currentBlockNumber - The current block number to fetch logs for
     * @returns {Promise<SubscriptionEvent[]>} A promise that resolves to an array of `SubscriptionEvent`
     * objects, each containing the subscription ID and the corresponding logs fetched for that
     * subscription. The promise resolves to an empty array if there are no active log subscriptions.
     */
    private async getLogsRPC(
        currentBlockNumber?: number
    ): Promise<SubscriptionEvent[]> {
        // Use the provided block number or fall back to the subscription manager's current block number
        const blockNumber =
            currentBlockNumber ?? this.subscriptionManager.currentBlockNumber;

        // Convert the logSubscriptions Map to an array of promises, each promise corresponds to a log fetch operation
        const promises = Array.from(
            this.subscriptionManager.logSubscriptions.entries()
        ).map(async ([subscriptionId, subscriptionDetails]) => {
            const currentBlock = HexInt.of(blockNumber);

            const filterOptions: FilterOptions = {
                address: subscriptionDetails.options?.address,
                fromBlock: currentBlock.toString(),
                toBlock: currentBlock.toString(),
                topics: subscriptionDetails.options?.topics
            };

            const logs = await ethGetLogs(this.thorClient, [filterOptions]);

            return {
                method: 'eth_subscription',
                params: {
                    subscription: subscriptionId,
                    result: logs
                }
            };
        });

        const subscriptionEvents = await Promise.all(promises);

        // Filter out empty results
        return subscriptionEvents.filter(
            (event) => event.params.result.length > 0
        );
    }

    /**
     * Fetches the current block details from the VeChain node.
     *
     * @private
     */
    private async getCurrentBlock(): Promise<CompressedBlockDetail | null> {
        // Initialize the result to null, indicating no block found initially
        let result: CompressedBlockDetail | null = null;

        try {
            // Get the best (latest) block available instead of trying to fetch a specific block number
            const bestBlock =
                await this.thorClient.blocks.getBestBlockCompressed();

            // If we have a valid block and either:
            // 1. We're in initial state (currentBlockNumber === -1), or
            // 2. We have a newer block than what we've already processed
            if (
                bestBlock !== undefined &&
                bestBlock !== null &&
                (this.subscriptionManager.currentBlockNumber === -1 ||
                    bestBlock.number >=
                        this.subscriptionManager.currentBlockNumber)
            ) {
                result = bestBlock; // Set the fetched block as the result
            }
        } catch (error) {
            // Log the error but don't let it crash the polling
            console.warn(
                'VeChainProvider: Failed to get current block, will retry on next poll:',
                error
            );
        }

        return result;
    }

    /**
     * Get a signer into the internal wallet provider
     * for the given address.
     *
     * @param addressOrIndex - Address of index of the account.
     * @returns The signer for the given address.
     */
    async getSigner(
        addressOrIndex?: string | number
    ): Promise<VeChainSigner | null> {
        if (this.wallet === undefined) {
            return null;
        }
        return await this.wallet?.getSigner(this, addressOrIndex);
    }

    /**
     * Use vet.domains to resolve name to address
     * @param vnsName - The name to resolve
     * @returns the address for a name or null
     */
    async resolveName(vnsName: string): Promise<null | string> {
        return await vnsUtils.resolveName(this.thorClient, vnsName);
    }

    /**
     * Use vet.domains to look up a verified primary name for an address
     * @param address - The address to lookup
     * @returns the primary name for an address or null
     */
    async lookupAddress(address: string): Promise<null | string> {
        return await vnsUtils.lookupAddress(this.thorClient, address);
    }
}

export { VeChainProvider };
