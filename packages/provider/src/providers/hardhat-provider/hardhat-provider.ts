import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import { ProviderWrapper } from 'hardhat/plugins';
import {
    type NetworkConfig,
    type RequestArguments,
    type HttpNetworkConfig
} from 'hardhat/types';
import { VechainProvider } from '../vechain-provider/vechain-provider';
import { createWalletFromHardhatNetworkConfig } from '../../utils';

/**
 * This class is a wrapper for the VechainProvider that is used by Hardhat.
 *
 * It exposes the interface that Hardhat expects, and uses the VechainProvider.
 */
class HardhatVechainProvider extends ProviderWrapper {
    /**
     * Constructor with the network configuration.
     *
     * @param networkConfig - The network configuration given into hardhat.
     */
    constructor(networkConfig: NetworkConfig) {
        super(
            new VechainProvider(
                new ThorClient(
                    new HttpClient(
                        (networkConfig as HttpNetworkConfig).url !== undefined
                            ? (networkConfig as HttpNetworkConfig).url
                            : // Solo URL by default
                              'http://localhost:8669/'
                    )
                ),
                createWalletFromHardhatNetworkConfig(networkConfig)
            )
        );
    }

    /**
     * It sends the request through the VechainProvider.
     *
     * @param args - The request arguments.
     */
    async request(args: RequestArguments): Promise<unknown> {
        return await this._wrappedProvider.request({
            method: args.method,
            params: args.params as never
        });
    }
}

export { HardhatVechainProvider };
