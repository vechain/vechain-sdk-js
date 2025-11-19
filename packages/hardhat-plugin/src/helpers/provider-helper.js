"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWalletFromHardhatNetworkConfig = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const sdk_network_1 = require("@vechain/sdk-network");
/*
 * Create a wallet from the hardhat network configuration.
 *
 * @param networkConfig - The hardhat network configuration.
 * @returns The wallet.
 * @throws {JSONRPCInternalError}
 */
const createWalletFromHardhatNetworkConfig = (networkConfig) => {
    // Get the accounts from the configuration
    const accountFromConfig = networkConfig.accounts;
    // Empty wallet
    if (accountFromConfig === undefined)
        return new sdk_network_1.ProviderInternalBaseWallet([], {});
    // Some configuration
    else {
        // Remote (not supported)
        if (accountFromConfig === 'remote')
            throw new sdk_errors_1.JSONRPCInternalError('createWalletFromHardhatNetworkConfig()', 'Remote accounts are not supported in hardhat network configuration.', { accountFromConfig, networkConfig });
        // Base ProviderInternalWallet - From an array of private keys
        if (Array.isArray(accountFromConfig)) {
            return new sdk_network_1.ProviderInternalBaseWallet(accountFromConfig.map((privateKey) => {
                // Convert the private key to a buffer
                const privateKeyBuffer = sdk_core_1.HexUInt.of(privateKey.startsWith('0x')
                    ? privateKey.slice(2)
                    : privateKey).bytes;
                // Derive the public key and address from the private key
                return {
                    privateKey: privateKeyBuffer,
                    publicKey: sdk_core_1.Secp256k1.derivePublicKey(privateKeyBuffer),
                    address: sdk_core_1.Address.ofPrivateKey(privateKeyBuffer).toString()
                };
            }), {
                gasPayer: (0, sdk_network_1.DelegationHandler)(networkConfig.gasPayer).gasPayerOrUndefined()
            });
        }
        // HD ProviderInternalWallet - From a mnemonic and hd wallet options
        else {
            return new sdk_network_1.ProviderInternalHDWallet(accountFromConfig.mnemonic.split(' '), accountFromConfig.count, accountFromConfig.initialIndex, accountFromConfig.path, {
                gasPayer: (0, sdk_network_1.DelegationHandler)(networkConfig.gasPayer).gasPayerOrUndefined()
            });
        }
    }
};
exports.createWalletFromHardhatNetworkConfig = createWalletFromHardhatNetworkConfig;
