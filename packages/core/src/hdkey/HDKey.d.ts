import * as s_bip32 from '@scure/bip32';
/**
 * This class extends the
 * [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
 * [HDKey](https://github.com/paulmillr/scure-bip32) class
 * to provide interoperability with
 * [ethers.js 6 HDNodeWallet](https://docs.ethers.org/v6/api/wallet/#HDNodeWallet).
 *
 * @extends s_bip32.HDKey
 */
declare class HDKey extends s_bip32.HDKey {
    /**
     * Prefix for extended private key
     */
    static readonly EXTENDED_PRIVATE_KEY_PREFIX: Uint8Array<ArrayBufferLike>;
    /**
     * Prefix for extended public key
     */
    static readonly EXTENDED_PUBLIC_KEY_PREFIX: Uint8Array<ArrayBufferLike>;
    /**
     * Default VET derivation path.
     *
     * See
     * [SLIP-0044 : Registered coin types for BIP-0044](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
     * for more info.
     */
    static readonly VET_DERIVATION_PATH = "m/44'/818'/0'/0";
    /**
     * Creates a
     * [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
     * from
     * [BIP39 Mnemonic Words](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
     * and the given derivation path.
     *
     * @param {string[]} words - An array of words representing the mnemonic.
     * @param {string} path - The derivation path to derive the child node.
     * Default value is {@link VET_DERIVATION_PATH}.
     *
     * @return The derived child hierarchical deterministic key.
     *
     * @throws {InvalidHDKey} If `path` is not valid to derive a node wallet.
     * @throws {InvalidHDKeyMnemonic} If `words` is an invalid array mnemonic.
     *
     * @remarks Security auditable method, depends on
     * * [s_bip32.HDKey.derive](https://github.com/paulmillr/scure-bip32);
     * * [s_bip32.HDKey.fromMasterSeed](https://github.com/paulmillr/scure-bip32);
     * * [s_bip39.mnemonicToSeedSync](https://github.com/paulmillr/scure-bip39).
     */
    static fromMnemonic(words: string[], path?: string): HDKey;
    /**
     * Creates a
     * [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
     * from a private key and chain code.
     *
     * @param {Uint8Array} - privateKey The private key.
     * @param {Uint8Array} - chainCode The chain code.
     *
     * @returns Returns the hierarchical deterministic key from `privateKey` and `chainCode`.
     *
     * @throws {InvalidSecp256k1PrivateKey} If the `privateKey` is invalid.
     *
     * @remarks **This method wipes `privateKey`** for security reasons.
     * @remarks Security auditable method, depends on
     * * [base58.encode](https://github.com/paulmillr/scure-base);
     * * {@link Sha256};
     * * [s_bip32.HDKey.fromExtendedKey](https://github.com/paulmillr/scure-bip32).
     */
    static fromPrivateKey(privateKey: Uint8Array, chainCode: Uint8Array): HDKey;
    /**
     * Creates a
     * [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
     * key from a public key and chain code.
     *
     * @param {Uint8Array} publicKey - The public key bytes.
     * @param {Uint8Array} chainCode - The chain code bytes.
     *
     * @returns {HDKey} Returns the hierarchical deterministic key from `public` and `chainCode`.
     *
     * @throws {InvalidHDKey} if the `publicKey` is invalid.
     *
     * @remarks Security auditable method, depends on
     * * [base58.encode](https://github.com/paulmillr/scure-base);
     * * {@link Secp256k1.compressPublicKey};
     * * {@link Sha256};
     * * [HDKey.fromExtendedKey](https://github.com/paulmillr/scure-bip32).
     */
    static fromPublicKey(publicKey: Uint8Array, chainCode: Uint8Array): HDKey;
    /**
     * Checks if derivation path single component is valid
     *
     * @param component - Derivation path single component to check
     * @param index - Derivation path single component index
     *
     * @returns `true`` if derivation path single component is valid, otherwise `false`.
     *
     */
    private static isDerivationPathComponentValid;
    /**
     * Checks if BIP32 derivation path is valid.
     *
     * @param derivationPath - Derivation path to check.
     *
     * @returns `true` if derivation path is valid, otherwise `false`.
     */
    static isDerivationPathValid(derivationPath: string): boolean;
}
export { HDKey };
//# sourceMappingURL=HDKey.d.ts.map