import { EventEmitter } from 'events';
import {
    type EIP1193ProviderMessage,
    type EIP1193RequestArguments
} from '../eip1193';
import { assert, DATA } from '@vechain/vechain-sdk-errors';
import {
    type BlockDetail,
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

/**
 * Our core provider class for vechain
 */
class VechainProvider extends EventEmitter implements EIP1193ProviderMessage {
    public readonly subscriptionManager: SubscriptionManager = {
        subscriptions: new Map(),
        currentBlockNumber: 0
    };

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
        Poll.createEventPoll(async () => {
            const data: SubscriptionEvent[] = [];

            const nextBlock = await this.nextBlock();

            if (
                nextBlock !== null &&
                this.subscriptionManager.subscriptions.has('newHeads')
            ) {
                data.push({ type: 'newBlock', data: nextBlock });
            }

            if (this.subscriptionManager.subscriptions.has('logs')) {
                const logSubscription =
                    this.subscriptionManager.subscriptions.get('logs');

                const filterOptions: FilterOptions = {
                    address: logSubscription?.address,
                    fromBlock:
                        this.subscriptionManager.currentBlockNumber.toString(),
                    toBlock:
                        this.subscriptionManager.currentBlockNumber.toString(),
                    topics: logSubscription?.topics
                };
                const logs = await ethGetLogs(this.thorClient, [filterOptions]);
                data.push({ type: 'logs', data: logs });
            }

            return data;
        }, POLLING_INTERVAL)
            .onData((data: SubscriptionEvent[]) => {
                if (data.length === 0) {
                    return;
                }

                this.emit('message', data);
            })
            .startListen();
    }

    private async nextBlock(): Promise<BlockDetail | null> {
        let result: BlockDetail | null = null;
        if (this.subscriptionManager.subscriptions.size > 0) {
            const block = await this.thorClient.blocks.getBlock(
                this.subscriptionManager.currentBlockNumber
            );
            if (block !== undefined && block !== null) {
                this.subscriptionManager.currentBlockNumber++;
                result = block;
            }
        }
        return result;
    }
}

export { VechainProvider };
