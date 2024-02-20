import type {
    HardhatNetworkAccountsConfig,
    HttpNetworkAccountsConfig,
    NetworkConfig
} from 'hardhat/types';
import { BaseWallet, type Wallet } from '@vechain/vechain-sdk-wallet';
import { buildError, JSONRPC } from '@vechain/vechain-sdk-errors';
import { addressUtils, HDNode, secp256k1 } from '@vechain/vechain-sdk-core';

/**
 * Create a wallet from the hardhat network configuration.
 *
 * @param networkConfig - The hardhat network configuration.
 * @returns The wallet.
 */
const createWalletFromHardhatNetworkConfig = (
    networkConfig: NetworkConfig
): Wallet => {
    const accountFromConfig:
        | HardhatNetworkAccountsConfig
        | HttpNetworkAccountsConfig = networkConfig.accounts;

    // Empty wallet
    if (accountFromConfig === undefined) return new BaseWallet([], {});
    // Some configuration
    else {
        // 1 - HttpNetworkAccountsConfig instance

        // Remote (not supported)
        if (accountFromConfig === 'remote')
            throw buildError(
                JSONRPC.INTERNAL_ERROR,
                'Remote accounts are not supported in hardhat network configuration'
            );

        // Array of private keys
        if (Array.isArray(accountFromConfig)) {
            return new BaseWallet(
                (accountFromConfig as string[]).map((privateKey: string) => {
                    // Convert the private key to a buffer
                    const privateKeyBuffer = Buffer.from(privateKey, 'hex');

                    // Derive the public key and address from the private key
                    return {
                        privateKey: privateKeyBuffer,
                        publicKey: secp256k1.derivePublicKey(privateKeyBuffer),
                        address: addressUtils.fromPrivateKey(privateKeyBuffer)
                    };
                }),
                {}
            );
        }
        // HD Wallet
        else {
            const hdnode = HDNode.fromMnemonic(
                accountFromConfig.mnemonic.split(' '),
                accountFromConfig.path
            );

            return new BaseWallet(
                [...Array(accountFromConfig.count).keys()].map(
                    (path: number) => {
                        // Convert the private key to a buffer
                        const privateKeyBuffer = hdnode.derive(
                            path + accountFromConfig.initialIndex
                        ).privateKey as Buffer;

                        // Derive the public key and address from the private key
                        return {
                            privateKey: privateKeyBuffer,
                            publicKey:
                                secp256k1.derivePublicKey(privateKeyBuffer),
                            address:
                                addressUtils.fromPrivateKey(privateKeyBuffer)
                        };
                    }
                ),
                {}
            );
        }
    }
};

export { createWalletFromHardhatNetworkConfig };
