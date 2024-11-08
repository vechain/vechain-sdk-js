import { type HardhatVeChainProvider } from '@vechain/sdk-network';
import { type Contract } from 'ethers';
import { helpers } from './helpers';

/**
 * Contract adapter for the VeChain hardhat plugin
 *
 * @param contract - The contract to adapt to the VeChain network
 * @param hardhatVeChainProvider - The hardhatVeChain provider
 * @returns The adapted contract
 */
const contractAdapter = (
    contract: Contract,
    hardhatVeChainProvider: HardhatVeChainProvider
): Contract => {
    contract.getAddress = async function getAddress(): Promise<string> {
        return await helpers.getContractAddress(
            contract.deploymentTransaction()?.hash ?? '',
            hardhatVeChainProvider
        );
    };
    return contract;
};

export { contractAdapter };
