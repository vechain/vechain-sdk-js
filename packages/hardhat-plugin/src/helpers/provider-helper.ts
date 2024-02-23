import { BaseWallet, type Wallet } from '@vechain/vechain-sdk-wallet';
import { buildError, JSONRPC } from '@vechain/vechain-sdk-errors';
import { addressUtils, HDNode, secp256k1 } from '@vechain/vechain-sdk-core';
import {
    type HardhatNetworkAccountsConfig,
    type HttpNetworkAccountsConfig,
    type HttpNetworkConfig,
    type NetworkConfig
} from 'hardhat/types';

/**
 * Create a wallet from the hardhat network configuration.
 *
 * @param networkConfig - The hardhat network configuration.
 * @returns The wallet.
 */
const createWalletFromHardhatNetworkConfig = (
    networkConfig: NetworkConfig
): Wallet => {
    // Get the accounts from the configuration
    const accountFromConfig:
        | HardhatNetworkAccountsConfig
        | HttpNetworkAccountsConfig = networkConfig.accounts;

    // Get the delegator from the configuration
    const delegatorFromConfig = (networkConfig as HttpNetworkConfig).delegator;

    // Empty wallet
    if (accountFromConfig === undefined) return new BaseWallet([], {});
    // Some configuration
    else {
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
                    const privateKeyBuffer = Buffer.from(
                        privateKey.startsWith('0x')
                            ? privateKey.slice(2)
                            : privateKey,
                        'hex'
                    );

                    // Derive the public key and address from the private key
                    return {
                        privateKey: privateKeyBuffer,
                        publicKey: secp256k1.derivePublicKey(privateKeyBuffer),
                        address: addressUtils.fromPrivateKey(privateKeyBuffer)
                    };
                }),
                { delegator: delegatorFromConfig }
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
                { delegator: delegatorFromConfig }
            );
        }
    }
};

export { createWalletFromHardhatNetworkConfig };
