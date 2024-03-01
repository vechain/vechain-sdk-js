import { BaseWallet, HDWallet, type Wallet } from '@vechain/vechain-sdk-wallet';
import { buildError, JSONRPC } from '@vechain/vechain-sdk-errors';
import { addressUtils, secp256k1 } from '@vechain/vechain-sdk-core';
import {
    type HardhatNetworkAccountsConfig,
    type HttpNetworkAccountsConfig,
    type HttpNetworkConfig,
    type NetworkConfig
} from 'hardhat/types';
import { DelegationHandler } from '@vechain/vechain-sdk-network';

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

    // Empty wallet
    if (accountFromConfig === undefined) return new BaseWallet([], {});
    // Some configuration
    else {
        // Remote (not supported)
        if (accountFromConfig === 'remote')
            throw buildError(
                'createWalletFromHardhatNetworkConfig',
                JSONRPC.INTERNAL_ERROR,
                'Remote accounts are not supported in hardhat network configuration'
            );

        // Base Wallet - From an array of private keys
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
                {
                    delegator: DelegationHandler(
                        (networkConfig as HttpNetworkConfig).delegator
                    ).delegatorOrUndefined()
                }
            );
        }
        // HD Wallet - From a mnemonic and hd wallet options
        else {
            return new HDWallet(
                accountFromConfig.mnemonic.split(' '),
                accountFromConfig.count,
                accountFromConfig.initialIndex,
                accountFromConfig.path,
                {
                    delegator: DelegationHandler(
                        (networkConfig as HttpNetworkConfig).delegator
                    ).delegatorOrUndefined()
                }
            );
        }
    }
};

export { createWalletFromHardhatNetworkConfig };
