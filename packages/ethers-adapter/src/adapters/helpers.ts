import type { HardhatVechainProvider } from '@vechain/sdk-provider';

/**
 * Get the contract address from a transaction id
 * @param txId - The contract deployment transaction id
 * @param hardhatVechainProvider - The hardhat vechain provider
 */
const getContractAddress = async (
    txId: string,
    hardhatVechainProvider: HardhatVechainProvider
): Promise<string> => {
    const tx =
        await hardhatVechainProvider.thorClient.transactions.waitForTransaction(
            txId
        );
    return tx?.outputs[0].contractAddress ?? '';
};

export const helpers = {
    getContractAddress
};
