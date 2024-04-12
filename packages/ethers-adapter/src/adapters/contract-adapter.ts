import { type vechain_sdk_core_ethers } from '@vechain/sdk-core';
import { type HardhatVechainProvider } from '@vechain/sdk-network';
import { helpers } from './helpers';

/**
 * Contract adapter for the vechain hardhat plugin
 *
 * @param contract - The contract to adapt to the vechain network
 * @param hardhatVechainProvider - The hardhat vechain provider
 * @returns The adapted contract
 */
const contractAdapter = (
    contract: vechain_sdk_core_ethers.Contract,
    hardhatVechainProvider: HardhatVechainProvider
): vechain_sdk_core_ethers.Contract => {
    contract.getAddress = async function getAddress(): Promise<string> {
        return await helpers.getContractAddress(
            contract.deploymentTransaction()?.hash ?? '',
            hardhatVechainProvider
        );
    };
    return contract;
};

export { contractAdapter };
