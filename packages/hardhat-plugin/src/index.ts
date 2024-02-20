import { extendProvider } from 'hardhat/config';
import { HardhatVechainProvider } from '@vechain/vechain-sdk-provider';
import './type-extensions';
import { type HttpNetworkConfig } from 'hardhat/types';

/**
 * Extend the provider to be able to use vechain functions
 */
extendProvider(async (_provider, config, network) => {
    // Get config for the network
    const networkConfig: HttpNetworkConfig = config.networks[
        network
    ] as HttpNetworkConfig;

    // Understand if in debug mode or not.
    const isInDebugMode = networkConfig.debug ?? false;

    // Initialize the provider
    const newProvider = new HardhatVechainProvider(
        networkConfig,
        isInDebugMode
    );

    // Log the provider
    if (isInDebugMode) {
        console.log(
            `Extending VechainHardhatProvider with:
        \n\n- network: \n\t${network}
        \n\n- config: \n\t${JSON.stringify(config.networks[network])}
        \n\n- accounts (Hardhat): \n\t${JSON.stringify(config.networks[network].accounts)}
        \n\n- accounts (Provider): \n\t${JSON.stringify(newProvider.getInternalVechainProvider().wallet?.getAddresses())}\n\n`
        );
    }

    // Return the new provider
    return await Promise.resolve(newProvider);
});
