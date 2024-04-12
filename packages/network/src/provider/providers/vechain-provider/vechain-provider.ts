import { EventEmitter } from 'events';
import {
    type EIP1193ProviderMessage,
    type EIP1193RequestArguments
} from '../../eip1193';
import { assert, DATA } from '@vechain/sdk-errors';
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
import {
    clauseBuilder,
    Hex0x,
    Quantity,
    secp256k1,
    type TransactionBody,
    type TransactionClause
} from '@vechain/sdk-core';
import type { TransactionObjectInput } from '../../utils/rpc-mapper/methods-map/methods/eth_sendTransaction/types';
import { type EventPoll, Poll } from '../../../utils';
import {
    type CompressedBlockDetail,
    DelegationHandler,
    type SignTransactionOptions,
    type ThorClient
} from '../../../thor-client';
import { type ProviderInternalWallet } from '../../helpers';

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
     *
     * @private
     */
    private pollInstance?: EventPoll<SubscriptionEvent[]>;

    /**
     * Constructor for VechainProvider
     *
     * @param thorClient - ThorClient instance.
     * @param wallet - ProviderInternalWallet instance. It is optional because the majority of the methods do not require a wallet.
     */
    constructor(
        readonly thorClient: ThorClient,
        readonly wallet?: ProviderInternalWallet
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
     */
    public async request(args: EIP1193RequestArguments): Promise<unknown> {
        // Check if the method is supported
        assert(
            'request',
            Object.values(RPC_METHODS)
                .map((key) => key.toString())
                .includes(args.method),
            DATA.INVALID_DATA_TYPE,
            'Invalid RPC method given as input.',
            { method: args.method }
        );

        // Get the method from the RPCMethodsMap and call it
        return await RPCMethodsMap(this.thorClient, this)[args.method](
            args.params as unknown[]
        );
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
                const data: SubscriptionEvent[] = [];

                const currentBlock = await this.getCurrentBlock();

                if (currentBlock !== null) {
                    if (
                        this.subscriptionManager.newHeadsSubscription !==
                        undefined
                    ) {
                        data.push({
                            method: 'eth_subscription',
                            params: {
                                subscription:
                                    this.subscriptionManager
                                        .newHeadsSubscription.subscriptionId,
                                result: currentBlock
                            }
                        });
                    }
                    if (this.subscriptionManager.logSubscriptions.size > 0) {
                        const logs = await this.getLogsRPC();
                        data.push(...logs);
                    }

                    this.subscriptionManager.currentBlockNumber++;
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
     * @returns {Promise<SubscriptionEvent[]>} A promise that resolves to an array of `SubscriptionEvent`
     * objects, each containing the subscription ID and the corresponding logs fetched for that
     * subscription. The promise resolves to an empty array if there are no active log subscriptions.
     */
    private async getLogsRPC(): Promise<SubscriptionEvent[]> {
        // Convert the logSubscriptions Map to an array of promises, each promise corresponds to a log fetch operation
        const promises = Array.from(
            this.subscriptionManager.logSubscriptions.entries()
        ).map(async ([subscriptionId, subscriptionDetails]) => {
            const currentBlock = Quantity.of(
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
     * Fetches the current block details from the vechain node.
     *
     * @private
     */
    private async getCurrentBlock(): Promise<CompressedBlockDetail | null> {
        // Initialize the result to null, indicating no block found initially
        let result: CompressedBlockDetail | null = null;

        // Proceed only if there are active log subscriptions or a new heads subscription is present
        if (this.isThereActiveSubscriptions()) {
            // Fetch the block details for the current block number
            const block = await this.thorClient.blocks.getBlockCompressed(
                this.subscriptionManager.currentBlockNumber
            );

            // If the block is successfully fetched (not undefined or null), update the result and increment the block number
            if (block !== undefined && block !== null) {
                result = block; // Set the fetched block as the result
            }
        }

        // Return the fetched block details or null if no block was fetched
        return result;
    }

    /**
     * Signs a transaction using the wallet.
     */
    public async sign(transaction: TransactionObjectInput): Promise<string> {
        // 1 - Initiate the transaction clauses
        const transactionClauses: TransactionClause[] =
            transaction.to !== undefined
                ? // Normal transaction
                  [
                      {
                          to: transaction.to,
                          data: transaction.data ?? '0x',
                          value: transaction.value ?? '0x0'
                      } satisfies TransactionClause
                  ]
                : // If 'to' address is not provided, it will be assumed that the transaction is a contract creation transaction.
                  [clauseBuilder.deployContract(transaction.data ?? '0x')];

        // 2 - Estimate gas
        const gasResult = await this.thorClient.gas.estimateGas(
            transactionClauses,
            transaction.from
        );

        // 3 - Init the wallet to use (we already know wallet is defined, thanks to the input validation)
        const walletTouse: ProviderInternalWallet = this
            .wallet as ProviderInternalWallet;

        const delegatorIntoWallet: SignTransactionOptions | null =
            await walletTouse.getDelegator();

        // 4 - Create transaction body
        const transactionBody =
            await this.thorClient.transactions.buildTransactionBody(
                transactionClauses,
                gasResult.totalGas,
                {
                    isDelegated:
                        DelegationHandler(delegatorIntoWallet).isDelegated()
                }
            );

        // 5 - Generate nonce.
        // @NOTE: To be compliant with the standard and to avoid nonce overflow, we generate a random nonce of 6 bytes

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { nonce, ...transactionBodyWithoutNonce } = transactionBody;
        const newNonce = Hex0x.of(secp256k1.randomBytes(6));

        const finalTransactionBody: TransactionBody = {
            nonce: newNonce,
            ...transactionBodyWithoutNonce
        };

        // 6 - Sign the transaction

        const signedTransaction = DelegationHandler(
            delegatorIntoWallet
        ).isDelegated()
            ? await walletTouse.signTransactionWithDelegator(
                  transaction.from,
                  finalTransactionBody,
                  this.thorClient
              )
            : await walletTouse.signTransaction(
                  transaction.from,
                  finalTransactionBody
              );

        return Hex0x.of(signedTransaction.encoded);
    }
}

export { VechainProvider };
