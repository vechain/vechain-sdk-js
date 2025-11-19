import '@nomicfoundation/hardhat-toolbox';
import '@vechain/sdk-hardhat-plugin';
import { type HardhatUserConfig } from 'hardhat/config';
/**
 * Main hardhat configuration
 *
 * Here we have custom VeChain networks: 'vechain_mainnet', 'vechain_testnet' and 'vechain_solo'
 *
 * They have custom parameters:
 * - debug: whether to enable debug mode
 * - gasPayer: the gasPayer to use
 * - enableDelegation: whether to enable fee delegation
 */
declare const config: HardhatUserConfig;
export default config;
//# sourceMappingURL=hardhat.config.d.ts.map