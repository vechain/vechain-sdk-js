import { EventEmitter } from 'events';
import {
    type EIP1193ProviderMessage,
    type EIP1193RequestArguments
} from '../eip1193';
import { assert, DATA } from '@vechain/vechain-sdk-errors';
import { Poll, type ThorClient } from '@vechain/vechain-sdk-network';
import { RPC_METHODS, RPCMethodsMap } from '../utils';
import { type Wallet } from '@vechain/vechain-sdk-wallet';
import { subscriptionService } from '../utils/service/subscriptionService';

/**
 * Our core provider class for vechain
 */
class VechainProvider extends EventEmitter implements EIP1193ProviderMessage {
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
        return await RPCMethodsMap(this.thorClient, this.wallet)[args.method](
            args.params as unknown[]
        );
    }

    private startSubscriptionsPolling(): void {
        Poll.createEventPoll(async () => {
            if (subscriptionService.subscriptions.includes('newHeads')) {
                const block = await this.thorClient.blocks.getBlock(
                    subscriptionService.currentBlockNumber
                );
                if (block !== undefined && block !== null) {
                    subscriptionService.currentBlockNumber++;
                    return block;
                }
            } else {
                return null;
            }
        }, 100)
            .onData((newBlockData: unknown) => {
                if (newBlockData === null || newBlockData === undefined) {
                    return;
                }

                this.emit('message', {
                    type: 'New block',
                    data: {
                        block: newBlockData
                    }
                });
            })
            .startListen();
    }
}

export { VechainProvider };
