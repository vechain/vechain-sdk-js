import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import { ProviderWrapper } from 'hardhat/plugins';
import { type RequestArguments, type HttpNetworkConfig } from 'hardhat/types';
import { VechainProvider } from '../vechain-provider';
import { createWalletFromHardhatNetworkConfig } from '../../utils';

/**
 * This class is a wrapper for the VechainProvider that is used by Hardhat.
 *
 * It exposes the interface that Hardhat expects, and uses the VechainProvider.
 */
class HardhatVechainProvider extends ProviderWrapper {
    /**
     * The network configuration.
     */
    networkConfig: HttpNetworkConfig;

    /**
     * Debug mode.
     */
    debug: boolean;

    /**
     * Constructor with the network configuration.
     *
     * @param networkConfig - The network configuration given into hardhat.
     * @param debug - Debug mode.
     */
    constructor(networkConfig: HttpNetworkConfig, debug: boolean = false) {
        // Initialize the provider with the network configuration.
        super(
            new VechainProvider(
                new ThorClient(
                    new HttpClient(
                        networkConfig.url ?? 'http://localhost:8669/'
                    )
                ),
                createWalletFromHardhatNetworkConfig(networkConfig)
            )
        );

        // Save the network configuration.
        this.networkConfig = networkConfig;

        // Save the debug mode.
        this.debug = debug;
    }

    /**
     * It sends the request through the VechainProvider.
     *
     * @param args - The request arguments.
     */
    async request(args: RequestArguments): Promise<unknown> {
        // Debug mode
        if (this.debug) {
            const accounts =
                this.getInternalVechainProvider().wallet?.getAddresses();

            console.log(
                `Sending request with VechainProvider:
                \n- method:\n\t${JSON.stringify(args.method)}
                \n- params:\n\t${JSON.stringify(args.params)}
                \n- accounts:\n\t${JSON.stringify(accounts)}\n\n`
            );
        }

        return await this._wrappedProvider.request({
            method: args.method,
            params: args.params as never
        });
    }

    /**
     * Get the internal VechainProvider.
     *
     * @returns The internal VechainProvider.
     */
    getInternalVechainProvider(): VechainProvider {
        return this._wrappedProvider as VechainProvider;
    }
}

export { HardhatVechainProvider };
