import { type HardhatUserConfig } from 'hardhat/config';
import { type HttpNetworkConfig } from 'hardhat/types';
import '@nomicfoundation/hardhat-ethers';
import '@vechain/sdk-hardhat-plugin';

const config: HardhatUserConfig = {
    solidity: '0.8.20'
};

module.exports = {
    solidity: {
        version: '0.8.20',
        evmVersion: 'paris',
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        vechain_solo: {
            // Solo
            url: 'http://localhost:8669',
            accounts: {
                mnemonic:
                    'denial kitchen pet squirrel other broom bar gas better priority spoil cross',
                path: "m/44'/818'/0'/0",
                count: 3,
                initialIndex: 0,
                passphrase: 'vechainthor'
            },
            gas: 'auto',
            gasPrice: 'auto',
            gasMultiplier: 1,
            timeout: 20000,
            httpHeaders: {}
        } satisfies HttpNetworkConfig
    }
};

export default config;
