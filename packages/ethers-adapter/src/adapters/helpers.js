"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpers = void 0;
/**
 * Get the contract address from a transaction id
 * @param txId - The contract deployment transaction id
 * @param hardhatVeChainProvider - The hardhatVeChain provider
 * @returns The contract address
 */
const getContractAddress = async (txId, hardhatVeChainProvider) => {
    const tx = await hardhatVeChainProvider.thorClient.transactions.waitForTransaction(txId);
    return tx?.outputs[0].contractAddress ?? '';
};
exports.helpers = {
    getContractAddress
};
