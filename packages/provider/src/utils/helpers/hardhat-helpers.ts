import type { NetworkConfig } from 'hardhat/types';
import { BaseWallet, type Wallet } from '@vechain/vechain-sdk-wallet';

/**
 * Create a wallet from the hardhat network configuration.
 *
 * @param networkConfig - The hardhat network configuration.
 * @returns The wallet.
 */
const createWalletFromHardhatNetworkConfig = (
    networkConfig: NetworkConfig
): Wallet => {
    console.log('networkConfig:', networkConfig);
    const wallet = new BaseWallet([], {});
    return wallet;
};

export { createWalletFromHardhatNetworkConfig };
