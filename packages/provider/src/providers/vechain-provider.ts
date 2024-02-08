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
import { type LogsRPC } from '../utils/formatter/logs';

/**
 * Our core provider class for vechain
 */
class VechainProvider extends EventEmitter implements EIP1193ProviderMessage {
    public readonly subscriptionManager: SubscriptionManager = {
        logSubscriptions: new Map(),
        currentBlockNumber: 0
    };

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
                data.push({ type: 'newBlock', data: nextBlock });
            }

            if (this.subscriptionManager.logSubscriptions.size > 0) {
                const logs = await this.getLogsRPC();
                logs.forEach((log) => {
                    data.push({ type: 'logs', data: log });
                });
            }

            return data;
        }, POLLING_INTERVAL);

        this.pollInstance.onData((data: SubscriptionEvent[]) => {
            if (data.length === 0) {
                return;
            }

            this.emit('message', data);
        });

        this.pollInstance.startListen();
    }

    private async getLogsRPC(): Promise<LogsRPC[][]> {
        const promises = Array.from(
            this.subscriptionManager.logSubscriptions.values()
        ).map(async (subscription) => {
            const filterOptions: FilterOptions = {
                address: subscription?.options?.address,
                fromBlock:
                    this.subscriptionManager.currentBlockNumber.toString(),
                toBlock: this.subscriptionManager.currentBlockNumber.toString(),
                topics: subscription?.options?.topics
            };

            return await ethGetLogs(this.thorClient, [filterOptions]);
        });

        return await Promise.all(promises);
    }

    private async nextBlock(): Promise<BlockDetail | null> {
        let result: BlockDetail | null = null;
        if (
            this.subscriptionManager.logSubscriptions.size > 0 ||
            this.subscriptionManager.newHeadsSubscription !== undefined
        ) {
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
