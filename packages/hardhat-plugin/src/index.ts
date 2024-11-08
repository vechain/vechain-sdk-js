import { createWalletFromHardhatNetworkConfig } from './helpers';

import { extendEnvironment } from 'hardhat/config';
import { type Artifact, type HttpNetworkConfig } from 'hardhat/types';
import { HardhatPluginError, lazyObject } from 'hardhat/plugins';

import {
    deployContract,
    getContractAt,
    getContractAtFromArtifact,
    getContractFactory,
    getContractFactoryFromArtifact,
    getSigner,
    getSigners
} from '@nomicfoundation/hardhat-ethers/internal/helpers';

// Custom provider for ethers
import { HardhatVeChainProvider } from '@vechain/sdk-network';
import { VeChainSDKLogger } from '@vechain/sdk-logging';

// Import needed to customize ethers functionality
import { ethers } from 'ethers';

// Import needed to extend the hardhat environment
import './type-extensions';

import { HardhatEthersProvider } from '@nomicfoundation/hardhat-ethers/internal/hardhat-ethers-provider';
import { contractAdapter, factoryAdapter } from '@vechain/sdk-ethers-adapter';
import { type FactoryOptions } from '@nomicfoundation/hardhat-ethers/src/types';
import { VechainSDKError } from '@vechain/sdk-errors';

/**
 * Extend the environment with provider to be able to use VeChain functions
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
    const debug = networkConfig.debug !== undefined && networkConfig.debug;

    // 1.4 - Get fee delegation mode enabled or not
    const enableDelegation =
        networkConfig.enableDelegation !== undefined &&
        networkConfig.enableDelegation;

    // 1.5 - Get the custom RPC Configuration
    const rpcConfiguration = networkConfig.rpcConfiguration;
    const ethGetTransactionCountMustReturn0 =
        rpcConfiguration?.ethGetTransactionCountMustReturn0 !== undefined
            ? rpcConfiguration?.ethGetTransactionCountMustReturn0
            : false;

    // 2 - Check if network is vechain

    if (!networkName.includes('vechain')) {
        VeChainSDKLogger('warning').log({
            title: 'You are operating on a non-vechain network',
            messages: [
                'Ensure your hardhat config file has a network that:',
                '\t1. Is a VeChain valid network (set url and optionally delegator parameter)',
                '\t2. Has the name of the network containing "vechain" (e.g. "vechain_mainnet", "vechain_testnet", "vechain_solo", ...)',
                '',
                'This is required to use the VeChain provider and its functions.',
                'Note that this is only a warning and you can use hardhat without a VeChain network.',
                "BUT it's possible that some functionalities will not be available."
            ]
        });

        // @NOTE: This is a warning. If vechain network is not found, we will return to not break the hardhat execution
        return;
    }

    // 3 - Extend environment with the 'HardhatVeChainProvider'

    console.log('networkConfig', networkConfig.rpcConfiguration);
    // 3.1 - Create the provider
    const hardhatVeChainProvider = new HardhatVeChainProvider(
        createWalletFromHardhatNetworkConfig(networkConfig),
        networkConfig.url,
        (message: string, parent?: Error) =>
            new HardhatPluginError(
                '@vechain/sdk-hardhat-plugin',
                message,
                parent
            ),
        debug,
        enableDelegation,
        {
            ethGetTransactionCountMustReturn0
        }
    );

    // 3.2 - Extend environment
    hre.VeChainProvider = lazyObject(() => hardhatVeChainProvider);

    // 3.3 - Set provider for the network
    hre.network.provider = hardhatVeChainProvider;

    hre.ethers = lazyObject(() => {
        // 4 - Customise ethers functionality

        const vechainNewHardhatProvider = new HardhatEthersProvider(
            hardhatVeChainProvider,
            hre.network.name
        );

        return {
            ...ethers,
            deployContract: async (...args: unknown[]) => {
                const deployContractBound = deployContract.bind(null, hre);
                // @ts-expect-error args types depend on the function signature
                return await deployContractBound(...args).then((contract) =>
                    contractAdapter(contract, hardhatVeChainProvider)
                );
            },

            getContractFactory: async (...args: unknown[]) => {
                const contractFactoryBound = getContractFactory.bind(null, hre);
                // @ts-expect-error args types depend on the function signature
                return await contractFactoryBound(...args).then((factory) =>
                    factoryAdapter(factory, hardhatVeChainProvider)
                );
            },

            getContractFactoryFromArtifact: async <A extends unknown[], I>(
                artifact: Artifact,
                signerOrOptions?: ethers.Signer | FactoryOptions
            ): Promise<ethers.ContractFactory<A, I>> => {
                // Define the get contract factory from artifact instance with the correct types
                const getContractFactoryFromArtifactInstance =
                    getContractFactoryFromArtifact<A, I>;

                // Bind the get contract factory from artifact instance with the hardhat instance
                const contractFactoryFromArtifactBound =
                    getContractFactoryFromArtifactInstance.bind(null, hre);

                // Return the factory adapter
                return await contractFactoryFromArtifactBound(
                    artifact,
                    signerOrOptions
                ).then((factory) =>
                    factoryAdapter(factory, hardhatVeChainProvider)
                );
            },

            getImpersonatedSigner: (_address: string) => {
                throw new VechainSDKError(
                    'getImpersonatedSigner()',
                    'Method not implemented.',
                    { functionName: 'getImpersonatedSigner' }
                );
            },

            getContractAtFromArtifact: getContractAtFromArtifact.bind(
                null,
                hre
            ),
            getContractAt: getContractAt.bind(null, hre),

            // Signer
            getSigner: async (address: string) => await getSigner(hre, address),
            getSigners: async () => await getSigners(hre),
            provider: vechainNewHardhatProvider
        };
    });
});
