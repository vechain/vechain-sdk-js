import { createWalletFromHardhatNetworkConfig } from './helpers';

import { extendEnvironment } from 'hardhat/config';
import { type HttpNetworkConfig } from 'hardhat/types';
import { HardhatPluginError, lazyObject } from 'hardhat/plugins';

// Custom provider for ethers
import {
    HardhatVechainProvider,
    JSONRPCEthersProvider
} from '@vechain/sdk-provider';
import { VechainSDKLogger } from '@vechain/sdk-logging';

// Import needed to customize ethers functionality
import { vechain_sdk_core_ethers as ethers } from '@vechain/sdk-core';

// Import needed to extend the hardhat environment
import './type-extensions';

// Custom signer
import {
    getImpersonatedSigner,
    getSigner,
    getSigners
} from '@nomiclabs/hardhat-ethers/internal/helpers';

/**
 * // TEMPORARY COMMENT //
 * To improve. Needed for ethers customization
 */
// const getSinger = async (
//     address: string,
//     networkName: string,
//     hardhatVechainProvider: HardhatVechainProvider
// ): Promise<SignerWithAddress> => {
//     const signer = await SignerWithAddress.create(
//         new ethers.JsonRpcSigner(
//             new CustomJSONRpcProvider(1, networkName, hardhatVechainProvider),
//             address
//         )
//     );
//     return signer;
// };

/**
 * // TEMPORARY COMMENT //
 * To improve. Needed for ethers customization
 */
// class WrappedEthersProvider extends ethers.JsonRpcApiProvider {
//     hardhatProvider: HardhatVechainProvider;
//
//     constructor(
//         url: string,
//         networkName: string,
//         networkChainId: number,
//         hardhatProvider: HardhatVechainProvider
//     ) {
//         super({ name: networkName, chainId: networkChainId });
//         this.hardhatProvider = hardhatProvider;
//     }
//
//     // async _send(method: string, params: unknown[]): Promise<unknown> {
//     //     return await this.hardhatProvider.send(method, params);
//     // }
// }

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
        (message: string, parent?: Error) =>
            new HardhatPluginError(
                '@vechain/sdk-hardhat-plugin',
                message,
                parent
            ),
        isInDebugMode
    );

    // 3.2 - Extend environment
    hre.vechainProvider = lazyObject(() => hardhatVechainProvider);

    // 3.3 - Set provider for the network
    hre.network.provider = hardhatVechainProvider;

    /**
     * // TEMPORARY COMMENT //
     * To improve. Needed for ethers customization
     */
    // 4 - Customise ethers functionality

    // 4.1 - Get chain id
    let chainIdFromProvider = 0;
    hardhatVechainProvider
        .send('eth_chainId', [])
        .then((chainId) => {
            console.log('Chain ID pluto', chainId);
            chainIdFromProvider = parseInt(chainId as string, 16);
        })
        .catch(() => {
            chainIdFromProvider = 0;
        });

    // @ts-expect-error Not everything is implemented
    hre.ethers = {
        // Ethers default constructs
        ...ethers,

        // JSON RPC provider for ethers (able to send multiple payloads (send in batch))
        provider: new JSONRPCEthersProvider(
            chainIdFromProvider,
            networkName,
            hardhatVechainProvider
        ),

        // Smart contracts
        // getContractFactory: typeof getContractFactory;
        // getContractFactoryFromArtifact: (
        //     artifact: Artifact,
        //     signerOrOptions?: ethers.Signer | FactoryOptions
        // ) => Promise<ethers.ContractFactory>;
        // getContractAt: (
        //     nameOrAbi: string | any[],
        //     address: string,
        //     signer?: ethers.Signer
        // ) => Promise<ethers.Contract>;
        // getContractAtFromArtifact: (
        //     artifact: Artifact,
        //     address: string,
        //     signer?: ethers.Signer
        // ) => Promise<ethers.Contract>;
        // deployContract: typeof deployContract;

        // Signer
        getSigner: async (address: string) => await getSigner(hre, address),
        getSigners: async () => await getSigners(hre),
        getImpersonatedSigner: async (address: string) =>
            await getImpersonatedSigner(hre, address)
    };
});
