import { EventEmitter } from 'events';
import {
    type EIP1193ProviderMessage,
    type EIP1193RequestArguments
} from '../eip1193';
import { assert, DATA } from '@vechainfoundation/vechain-sdk-errors';
import { type ThorClient } from '@vechainfoundation/vechain-sdk-network';
import { RPC_METHODS, RPCMethodsMap } from '../utils';

/**
 * Our core provider class for vechain
 */
class VechainProvider extends EventEmitter implements EIP1193ProviderMessage {
    /**
     * Constructor for VechainProvider
     * @param thorClient - ThorClient instance
     */
    constructor(readonly thorClient: ThorClient) {
        super();
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
        return await RPCMethodsMap(this.thorClient)[args.method](
            args.params as unknown[]
        );
    }

    // TODO When we implement the thor client head block polling
    /* public destroy(): void {
        this.thorClient.destroy();
    } */
}

export { VechainProvider };
