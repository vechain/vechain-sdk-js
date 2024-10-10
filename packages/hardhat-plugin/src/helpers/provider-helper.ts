import { Address, HexUInt, Secp256k1 } from '@vechain/sdk-core';
import { JSONRPCInternalError } from '@vechain/sdk-errors';
import {
    DelegationHandler,
    ProviderInternalBaseWallet,
    ProviderInternalHDWallet,
    type ProviderInternalWallet
} from '@vechain/sdk-network';
import {
    type HardhatNetworkAccountsConfig,
    type HttpNetworkAccountsConfig,
    type HttpNetworkConfig,
    type NetworkConfig
} from 'hardhat/types';

/*
 * Create a wallet from the hardhat network configuration.
 *
 * @param networkConfig - The hardhat network configuration.
 * @returns The wallet.
 * @throws {JSONRPCInternalError}
 */
const createWalletFromHardhatNetworkConfig = (
    networkConfig: NetworkConfig
): ProviderInternalWallet => {
    // Get the accounts from the configuration
    const accountFromConfig:
        | HardhatNetworkAccountsConfig
        | HttpNetworkAccountsConfig = networkConfig.accounts;

    // Empty wallet
    if (accountFromConfig === undefined)
        return new ProviderInternalBaseWallet([], {});
    // Some configuration
    else {
        // Remote (not supported)
        if (accountFromConfig === 'remote')
            throw new JSONRPCInternalError(
                'createWalletFromHardhatNetworkConfig()',
                'Remote accounts are not supported in hardhat network configuration.',
                { accountFromConfig, networkConfig }
            );

        // Base ProviderInternalWallet - From an array of private keys
        if (Array.isArray(accountFromConfig)) {
            return new ProviderInternalBaseWallet(
                (accountFromConfig as string[]).map((privateKey: string) => {
                    // Convert the private key to a buffer
                    const privateKeyBuffer = HexUInt.of(
                        privateKey.startsWith('0x')
                            ? privateKey.slice(2)
                            : privateKey
                    ).bytes;

                    // Derive the public key and address from the private key
                    return {
                        privateKey: privateKeyBuffer,
                        publicKey: Secp256k1.derivePublicKey(privateKeyBuffer),
                        address:
                            Address.ofPrivateKey(privateKeyBuffer).toString()
                    };
                }),
                {
                    delegator: DelegationHandler(
                        (networkConfig as HttpNetworkConfig).delegator
                    ).delegatorOrUndefined()
                }
            );
        }
        // HD ProviderInternalWallet - From a mnemonic and hd wallet options
        else {
            return new ProviderInternalHDWallet(
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
