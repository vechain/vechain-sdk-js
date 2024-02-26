/**
 * Simple project without vechain network defined
 */

// We load the plugin here.
import { type HardhatUserConfig } from 'hardhat/types';

import '../../../src/index';

/**
 * Hardhat configuration
 */
const config: HardhatUserConfig = {
    solidity: '0.8.17',
    networks: {}
};

export default config;
