import { type vechain_sdk_core_ethers } from '@vechain/sdk-core';
import { type HardhatVechainProvider } from '@vechain/sdk-provider';
import { helpers } from './helpers';

export const contractAdapter = (
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
