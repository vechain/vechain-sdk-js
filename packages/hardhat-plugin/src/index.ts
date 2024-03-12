import { createWalletFromHardhatNetworkConfig } from './helpers';

import { extendEnvironment } from 'hardhat/config';
import { type HttpNetworkConfig } from 'hardhat/types';
import { HardhatPluginError, lazyObject } from 'hardhat/plugins';

import { HardhatVechainProvider } from '@vechain/sdk-provider';
import { VechainSDKLogger } from '@vechain/sdk-logging';

// Import needed to customize ethers functionality
import { vechain_sdk_core_ethers as ethers } from '@vechain/sdk-core';

// Import needed to extend the hardhat environment
import './type-extensions';

/**
 * // TEMPORARY COMMENT //
 * To improve. Needed for ethers customization
 */
// class CustomJSONRpcProvider extends ethers.JsonRpcApiProvider {
//     hardhatProvider: HardhatVechainProvider;
//
//     constructor(
//         netowrkChainId: number,
//         networkName: string,
//         hardhatProvider: HardhatVechainProvider
//     ) {
//         super({ name: networkName, chainId: netowrkChainId });
//         this.hardhatProvider = hardhatProvider;
//     }
//
//     async _send(
//         payload: JsonRpcPayload | JsonRpcPayload[]
//     ): Promise<Array<JsonRpcResult | JsonRpcError>> {
//         const requestPayloadArray = Array.isArray(payload)
//             ? payload
//             : [payload];
//         console.log('requestPayloadArray', requestPayloadArray);
//
//         const responses: Array<JsonRpcResult | JsonRpcError> =
//             requestPayloadArray.map((jsonRpcPayload: JsonRpcPayload) => {
//                 let response: JsonRpcResult | JsonRpcError = {
//                     id: 0,
//                     result: ''
//                 };
//
//                 this.hardhatProvider
//                     .send(
//                         jsonRpcPayload.method,
//                         jsonRpcPayload.params as unknown[]
//                     )
//                     .then((result) => {
//                         response = {
//                             id: jsonRpcPayload.id,
//                             result
//                         } as JsonRpcResult;
//                     })
//                     .catch((e) => {
//                         response = {
//                             id: jsonRpcPayload.id,
//                             error: {
//                                 code: getJSONRPCErrorCode(
//                                     JSONRPC.INTERNAL_ERROR
//                                 ),
//                                 message: stringifyData(e)
//                             }
//                         } satisfies JsonRpcError;
//                     });
//
//                 return response;
//             });
//
//         return await Promise.resolve(responses);
//     }
// }

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
    // @ts-expect-error - We are extending the environment with the vechain provider
    hre.ethers = {
        ...ethers
        // provider: new CustomJSONRpcProvider(
        //     0,
        //     networkName,
        //     hardhatVechainProvider
        // )

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
        // getSigner: async (address: string): Promise<SignerWithAddress> => {
        //     console.log('getSigner', address);
        //     return await getSinger(
        //         address,
        //         networkName,
        //         hardhatVechainProvider
        //     );
        // }
        // getSigners: async (): Promise<SignerWithAddress[]> => {
        //     const accounts: string[] = (await hardhatVechainProvider.send(
        //         'eth_getAccounts',
        //         []
        //     )) as string[];
        //     return accounts.map((address: string) => {
        //         getSinger(
        //             address,
        //             networkName,
        //             hardhatVechainProvider
        //         );
        //     });
        // }
        // getImpersonatedSigner: (address: string) => Promise<SignerWithAddress>;
        // deployContract: typeof deployContract;
    };
});
