import { type HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@vechain/vechain-sdk-hardhat-plugin';

const config: HardhatUserConfig = {
    solidity: '0.8.17',
    networks: {
        vechain: {
            url: 'https://sync-testnet.vechain.org/'
        }
    }
};

export default config;
