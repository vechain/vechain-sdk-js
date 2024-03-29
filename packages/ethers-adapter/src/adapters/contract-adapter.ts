import { type vechain_sdk_core_ethers } from '@vechain/sdk-core';
import { type HardhatVechainProvider } from '@vechain/sdk-provider';

export const contractAdapter = (
    contract: vechain_sdk_core_ethers.Contract,
    hardhatVechainProvider: HardhatVechainProvider
): vechain_sdk_core_ethers.Contract => {
    contract.getAddress = async function getAddress(): Promise<string> {
        const address = (
            await hardhatVechainProvider.thorClient.transactions.waitForTransaction(
                contract.deploymentTransaction()?.hash ?? ''
            )
        )?.outputs[0].contractAddress;
        return address ?? '';
    };
    return contract;
};
