import { EventEmitter } from 'events';
import { type VeChainSigner } from '../../../signer';
import { type ThorClient } from '../../../thor-client';
import { type EventPoll } from '../../../utils';
import { type EIP1193ProviderMessage, type EIP1193RequestArguments } from '../../eip1193';
import { type ProviderInternalWallet } from '../../helpers';
import { type SubscriptionEvent, type SubscriptionManager } from './types';
/**
 * Our core provider class for VeChain
 */
declare class VeChainProvider extends EventEmitter implements EIP1193ProviderMessage {
    readonly thorClient: ThorClient;
    readonly wallet?: ProviderInternalWallet | undefined;
    readonly enableDelegation: boolean;
    readonly subscriptionManager: SubscriptionManager;
    /**
     * Poll instance for subscriptions
     *
     * @private
     */
    private pollInstance?;
    /**
     * Constructor for VeChainProvider
     *
     * @param thorClient - ThorClient instance.
     * @param wallet - ProviderInternalWallet instance. It is optional because the majority of the methods do not require a wallet.
     * @param enableDelegation - Enable fee delegation or not.
     * @throws {JSONRPCInvalidParams}
     *
     */
    constructor(thorClient: ThorClient, wallet?: ProviderInternalWallet | undefined, enableDelegation?: boolean);
    /**
     * Destroys the provider by closing the thorClient and stopping the provider poll instance if present.
     * This is because thorClient and the provider might be initialized with a polling interval.
     */
    destroy(): void;
    /**
     * This method is used to send a request to the provider.
     * Basically, it is a wrapper around the RPCMethodsMap.
     *
     * @param args - Method and parameters to be used for the request.
     * @returns The result of the request.
     * @throws {JSONRPCMethodNotFound}
     */
    request(args: EIP1193RequestArguments): Promise<unknown>;
    /**
     * Initializes and starts the polling mechanism for subscription events.
     * This method sets up an event poll that periodically checks for new events related to active
     * subscriptions, such as 'newHeads' or log subscriptions. When new data is available, it emits
     * these events to listeners.
     *
     * This method leverages the `Poll.createEventPoll` utility to create the polling mechanism,
     * which is then started by invoking `startListen` on the poll instance.
     */
    startSubscriptionsPolling(): boolean;
    /**
     * Stops the polling mechanism for subscription events.
     * This method stops the polling mechanism for subscription events, if it is active.
     *
     * @returns {boolean} A boolean indicating whether the polling mechanism was stopped.
     */
    stopSubscriptionsPolling(): boolean;
    /**
     * Checks if there are active subscriptions.
     * This method checks if there are any active log subscriptions or a new heads subscription.
     *
     * @returns {boolean} A boolean indicating whether there are active subscriptions.
     */
    isThereActiveSubscriptions(): boolean;
    /**
     * Returns the poll instance for subscriptions.
     */
    getPollInstance(): EventPoll<SubscriptionEvent[]> | undefined;
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
    private getLogsRPC;
    /**
     * Fetches the current block details from the VeChain node.
     *
     * @private
     */
    private getCurrentBlock;
    /**
     * Get a signer into the internal wallet provider
     * for the given address.
     *
     * @param addressOrIndex - Address of index of the account.
     * @returns The signer for the given address.
     */
    getSigner(addressOrIndex?: string | number): Promise<VeChainSigner | null>;
    /**
     * Use vet.domains to resolve name to address
     * @param vnsName - The name to resolve
     * @returns the address for a name or null
     */
    resolveName(vnsName: string): Promise<null | string>;
    /**
     * Use vet.domains to look up a verified primary name for an address
     * @param address - The address to lookup
     * @returns the primary name for an address or null
     */
    lookupAddress(address: string): Promise<null | string>;
}
export { VeChainProvider };
//# sourceMappingURL=vechain-provider.d.ts.map