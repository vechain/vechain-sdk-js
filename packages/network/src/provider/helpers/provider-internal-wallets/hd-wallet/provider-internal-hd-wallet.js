"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderInternalHDWallet = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const base_wallet_1 = require("../base-wallet");
class ProviderInternalHDWallet extends base_wallet_1.ProviderInternalBaseWallet {
    /**
     * Mnemonic of the wallet.
     */
    mnemonic;
    /**
     * Derivation path of the wallet.
     */
    derivationPath;
    /**
     * Number of accounts to generate.
     */
    count;
    /**
     * Initial index of the accounts to generate.
     */
    initialIndex;
    /**
     * Create a new HD wallet.
     *
     * @param mnemonic - Mnemonic of the wallet as an array of words.
     * @param count - Number of accounts to generate.
     * @param initialIndex - Initial index of the accounts to generate.
     * @param derivationPath - Derivation path of the wallet.
     * @param options - Options for signing a transaction with gasPayer.
     */
    constructor(mnemonic, count = 1, initialIndex = 0, derivationPath = sdk_core_1.HDKey.VET_DERIVATION_PATH, options) {
        // Initialize the base wallet with the generated accounts
        super([...Array(count).keys()].map((path) => {
            // Convert the private key to a buffer
            const privateKeyBuffer = sdk_core_1.HDKey.fromMnemonic(mnemonic, derivationPath).deriveChild(path + initialIndex).privateKey;
            // Derive the public key and address from the private key
            return {
                privateKey: privateKeyBuffer,
                publicKey: sdk_core_1.Secp256k1.derivePublicKey(privateKeyBuffer),
                address: sdk_core_1.Address.ofPrivateKey(privateKeyBuffer).toString()
            };
        }), options);
        // Set the wallet properties
        this.mnemonic = mnemonic;
        this.derivationPath = derivationPath;
        this.count = count;
        this.initialIndex = initialIndex;
    }
}
exports.ProviderInternalHDWallet = ProviderInternalHDWallet;
