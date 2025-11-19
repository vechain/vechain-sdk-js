"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const config_1 = require("hardhat/config");
const plugins_1 = require("hardhat/plugins");
const helpers_2 = require("@nomicfoundation/hardhat-ethers/internal/helpers");
// Custom provider for ethers
const sdk_network_1 = require("@vechain/sdk-network");
const sdk_logging_1 = require("@vechain/sdk-logging");
// Import needed to customize ethers functionality
const ethers_1 = require("ethers");
// Import needed to extend the hardhat environment
require("./type-extensions");
const hardhat_ethers_provider_1 = require("@nomicfoundation/hardhat-ethers/internal/hardhat-ethers-provider");
const sdk_ethers_adapter_1 = require("@vechain/sdk-ethers-adapter");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Extend the environment with provider to be able to use VeChain functions
 */
(0, config_1.extendEnvironment)((hre) => {
    // 1 - Get parameters
    // 1.1 - Get network name
    const networkName = hre.network.name;
    // 1.2 - Get network config
    const networkConfig = hre.config.networks[networkName];
    // 1.3 - Get debug mode
    const debug = networkConfig.debug !== undefined && networkConfig.debug;
    // 1.4 - Get fee delegation mode enabled or not
    const enableDelegation = networkConfig.enableDelegation !== undefined &&
        networkConfig.enableDelegation;
    // 1.5 - Get the custom RPC Configuration
    const rpcConfiguration = networkConfig.rpcConfiguration;
    const ethGetTransactionCountMustReturn0 = rpcConfiguration?.ethGetTransactionCountMustReturn0 ?? false;
    // 2 - Check if network is vechain
    if (!networkName.includes('vechain')) {
        (0, sdk_logging_1.VeChainSDKLogger)('warning').log({
            title: 'You are operating on a non-vechain network',
            messages: [
                'Ensure your hardhat config file has a network that:',
                '\t1. Is a VeChain valid network (set url and optionally gasPayer parameter)',
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
    const hardhatVeChainProvider = new sdk_network_1.HardhatVeChainProvider((0, helpers_1.createWalletFromHardhatNetworkConfig)(networkConfig), networkConfig.url, (message, parent) => new plugins_1.HardhatPluginError('@vechain/sdk-hardhat-plugin', message, parent), debug, enableDelegation, {
        ethGetTransactionCountMustReturn0
    });
    // 3.2 - Extend environment
    hre.VeChainProvider = (0, plugins_1.lazyObject)(() => hardhatVeChainProvider);
    // 3.3 - Set provider for the network
    hre.network.provider = hardhatVeChainProvider;
    hre.ethers = (0, plugins_1.lazyObject)(() => {
        // 4 - Customise ethers functionality
        const vechainNewHardhatProvider = new hardhat_ethers_provider_1.HardhatEthersProvider(hardhatVeChainProvider, hre.network.name);
        return {
            ...ethers_1.ethers,
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            deployContract: async (...args) => {
                const deployContractBound = helpers_2.deployContract.bind(null, hre);
                // @ts-expect-error args types depend on the function signature
                return await deployContractBound(...args).then((contract) => (0, sdk_ethers_adapter_1.contractAdapter)(contract, hardhatVeChainProvider));
            },
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            getContractFactory: async (...args) => {
                const contractFactoryBound = helpers_2.getContractFactory.bind(null, hre);
                // @ts-expect-error args types depend on the function signature
                return await contractFactoryBound(...args).then((factory) => (0, sdk_ethers_adapter_1.factoryAdapter)(factory, hardhatVeChainProvider));
            },
            getContractFactoryFromArtifact: async (artifact, signerOrOptions) => {
                // Define the get contract factory from artifact instance with the correct types
                const getContractFactoryFromArtifactInstance = (helpers_2.getContractFactoryFromArtifact);
                // Bind the get contract factory from artifact instance with the hardhat instance
                const contractFactoryFromArtifactBound = getContractFactoryFromArtifactInstance.bind(null, hre);
                // Return the factory adapter
                return await contractFactoryFromArtifactBound(artifact, signerOrOptions).then((factory) => (0, sdk_ethers_adapter_1.factoryAdapter)(factory, hardhatVeChainProvider));
            },
            getImpersonatedSigner: (_address) => {
                throw new sdk_errors_1.VechainSDKError('getImpersonatedSigner()', 'Method not implemented.', { functionName: 'getImpersonatedSigner' });
            },
            getContractAtFromArtifact: helpers_2.getContractAtFromArtifact.bind(null, hre),
            getContractAt: helpers_2.getContractAt.bind(null, hre),
            // Signer
            getSigner: async (address) => await (0, helpers_2.getSigner)(hre, address), // eslint-disable-line @typescript-eslint/explicit-function-return-type
            getSigners: async () => await (0, helpers_2.getSigners)(hre), // eslint-disable-line @typescript-eslint/explicit-function-return-type
            provider: vechainNewHardhatProvider
        };
    });
});
