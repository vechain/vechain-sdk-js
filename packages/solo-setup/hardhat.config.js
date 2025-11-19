"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-ethers");
require("@vechain/sdk-hardhat-plugin");
const config = {
    solidity: '0.8.20'
};
module.exports = {
    solidity: {
        version: '0.8.20',
        evmVersion: 'shanghai',
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
            url: 'http://127.0.0.1:8669',
            accounts: {
                mnemonic: 'denial kitchen pet squirrel other broom bar gas better priority spoil cross',
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
        }
    }
};
exports.default = config;
