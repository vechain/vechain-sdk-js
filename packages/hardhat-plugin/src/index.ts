import { HardhatVechainProvider } from '@vechain/vechain-sdk-provider';

import { extendEnvironment } from 'hardhat/config';
import { type HttpNetworkConfig } from 'hardhat/types';
import { lazyObject } from 'hardhat/plugins';

import './type-extensions';

/**
 * Extend the enviroment with provider to be able to use vechain functions
 */
extendEnvironment((hre) => {
    // 1 - Get parameters

    // 1.1 - Get network name
    const networkName = hre.network.name;

    // 1.2 - Get network config
    const networkConfig: HttpNetworkConfig = hre.config.networks[
        networkName
    ] as HttpNetworkConfig;

    // 1.3 - Get debug mode
    const isInDebugMode = networkConfig.debugMode ?? false;

    // 2 - Check if network is vechain

    if (!networkName.includes('vechain')) {
        console.log('Not a vechain network');
        return;
    }

    // 3 - Extend environment with the 'HardhatVechainProvider'

    // 3.1 - Create the provider
    const hardhatVechainProvider = new HardhatVechainProvider(
        networkConfig,
        isInDebugMode
    );

    // 3.2 - Extend environment
    hre.vechainProvider = lazyObject(() => hardhatVechainProvider);

    // 3.3 - Set provider for the network
    hre.network.provider = hardhatVechainProvider;
});
