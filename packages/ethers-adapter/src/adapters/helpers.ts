import type { HardhatVeChainProvider } from '@vechain/sdk-network';

/**
 * Get the contract address from a transaction id
 * @param txId - The contract deployment transaction id
 * @param hardhatVeChainProvider - The hardhatVeChain provider
 * @returns The contract address
 */
const getContractAddress = async (
    txId: string,
    hardhatVeChainProvider: HardhatVeChainProvider
): Promise<string> => {
    const tx =
        await hardhatVeChainProvider.thorClient.transactions.waitForTransaction(
            txId
        );
    return tx?.outputs[0].contractAddress ?? '';
};

export const helpers = {
    getContractAddress
};
