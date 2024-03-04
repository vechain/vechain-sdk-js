import { HardhatVechainProvider } from '@vechain/vechain-sdk-provider';
import { createWalletFromHardhatNetworkConfig } from './helpers';

import { extendEnvironment } from 'hardhat/config';
import { type HttpNetworkConfig } from 'hardhat/types';
import { lazyObject } from 'hardhat/plugins';

import './type-extensions';
import { VechainSDKLogger } from '@vechain/vechain-sdk-logging';

/**
 * Extend the environment with provider to be able to use vechain functions
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
        VechainSDKLogger('warning').log({
            title: 'You are operating on a non-vechain network',
            messages: [
                'Ensure your hardhat config file has a network that:',
                '\t1. Is a vechain valid network (set url and optionally delegator parameter)',
                '\t2. Has the name of the network containing "vechain" (e.g. "vechain_mainnet", "vechain_testnet", "vechain_solo", ...)',
                '',
                'This is required to use the vechain provider and its functions. Note that this is only a warning and you can hardhat without a vechain network.',
                "BUT it's possible that some functionalities will not be available."
            ]
        });
    }

    // 3 - Extend environment with the 'HardhatVechainProvider'

    // 3.1 - Create the provider
    const hardhatVechainProvider = new HardhatVechainProvider(
        createWalletFromHardhatNetworkConfig(networkConfig),
        networkConfig.url,
        isInDebugMode
    );

    // 3.2 - Extend environment
    hre.vechainProvider = lazyObject(() => hardhatVechainProvider);

    // 3.3 - Set provider for the network
    hre.network.provider = hardhatVechainProvider;
});
