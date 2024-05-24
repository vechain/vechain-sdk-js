import { type vechain_sdk_core_ethers } from '@vechain/sdk-core';
import { type HardhatVeChainProvider } from '@vechain/sdk-network';
import { helpers } from './helpers';

/**
 * Contract adapter for the VeChain hardhat plugin
 *
 * @param contract - The contract to adapt to the VeChain network
 * @param hardhatVeChainProvider - The hardhatVeChain provider
 * @returns The adapted contract
 */
const contractAdapter = (
    contract: vechain_sdk_core_ethers.Contract,
    hardhatVeChainProvider: HardhatVeChainProvider
): vechain_sdk_core_ethers.Contract => {
    contract.getAddress = async function getAddress(): Promise<string> {
        return await helpers.getContractAddress(
            contract.deploymentTransaction()?.hash ?? '',
            hardhatVeChainProvider
        );
    };
    return contract;
};

export { contractAdapter };
