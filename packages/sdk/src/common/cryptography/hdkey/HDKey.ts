import * as nc_utils from '@noble/curves/abstract/utils';
import * as s_bip32 from '@scure/bip32';
import * as s_bip39 from '@scure/bip39';
import { IllegalArgumentError } from '@errors';
import { Secp256k1 } from '@common/cryptography/secp256k1';
import { Sha256 } from '@common/vcdm';
import { base58 } from '@scure/base';

/**
 * Full Qualified Path
 */
const FQP = 'packages/sdk/src/hdkey/HDKey.ts!';

/**
 * This class extends the
 * [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
 * [HDKey](https://github.com/paulmillr/scure-bip32) class
 * to provide interoperability with
 * [ethers.js 6 HDNodeWallet](https://docs.ethers.org/v6/api/wallet/#HDNodeWallet).
 *
 * @extends s_bip32.HDKey
 */
class HDKey extends s_bip32.HDKey {
    /**
     * Prefix for extended private key
     */
    public static readonly EXTENDED_PRIVATE_KEY_PREFIX = new Uint8Array([
        0x04, 0x88, 0xad, 0xe4, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00
    ]);

    /**
     * Prefix for extended public key
     */
    public static readonly EXTENDED_PUBLIC_KEY_PREFIX = new Uint8Array([
        0x04, 0x88, 0xb2, 0x1e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00
    ]);

    /**
     * Default VET derivation path.
     *
     * See
     * [SLIP-0044 : Registered coin types for BIP-0044](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
     * for more info.
     */
    public static readonly VET_DERIVATION_PATH = "m/44'/818'/0'/0";

    /**
     * Creates a
     * [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
     * from
     * [BIP39 Mnemonic Words](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
     * and the given derivation path.
     *
     * @param {string[]} words - An array of 12-24 words representing the mnemonic.
     * @param {string} path - The derivation path to derive the child node.
     * @param {string} passphrase – That will additionally protect the key.
     * Default value is {@link VET_DERIVATION_PATH}.
     *
     * @return The derived child hierarchical deterministic key.
     *
     * @throws {IllegalArgumentError} If `words` or `path` are invalid.
     *
     * @remarks Security audited method, depends on
     * * [s_bip32.HDKey.derive](https://github.com/paulmillr/scure-bip32);
     * * [s_bip32.HDKey.fromMasterSeed](https://github.com/paulmillr/scure-bip32);
     * * [s_bip39.mnemonicToSeedSync](https://github.com/paulmillr/scure-bip39).
     * * The above dependency implementations are sensitive to [timing attack](https://en.wikipedia.org/wiki/Timing_attack)
     *   and should be not used in the context where such risk is a concern:
     *   read the [Security](https://github.com/paulmillr/noble-hashes/blob/main/README.md#security) note.
     * * Follow links for additional security notes.
     */
    public static fromMnemonic(
        words: string[],
        path: string = this.VET_DERIVATION_PATH,
        passphrase?: string
    ): HDKey {
        let master: s_bip32.HDKey;
        try {
            master = s_bip32.HDKey.fromMasterSeed(
                s_bip39.mnemonicToSeedSync(
                    words.join(' ').toLowerCase(),
                    passphrase
                )
            );
        } catch (error) {
            // The error masks any mnemonic words leak.
            throw new IllegalArgumentError(
                `${FQP}HDNode.fromMnemonic(words: string[], path: string): HDKey`,
                'Invalid mnemonic words given as input.',
                undefined,
                error instanceof Error ? error : undefined
            );
        }
        try {
            return master.derive(path) as HDKey;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}HDNode.fromMnemonic(words: string[], path: string): HDKey`,
                'Invalid derivation path given as input.',
                { derivationPath: path },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Creates a
     * [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
     * from a private key and chain code.
     *
     * @param {Uint8Array} privateKey The private key.
     * @param {Uint8Array} chainCode The chain code.
     *
     * @returns Returns the hierarchical deterministic key from `privateKey` and `chainCode`.
     *
     * @throws {IllegalArgumentError} If the `privateKey` is invalid.
     *
     * @remarks Security audited method, depends on
     * * [base58.encode](https://github.com/paulmillr/scure-base);
     * * [nc_utils.concatBytes](https://github.com/paulmillr/noble-curves?tab=readme-ov-file#utils-useful-utilities)
     * * [s_bip32.HDKey.fromExtendedKey](https://github.com/paulmillr/scure-bip32).
     * * {@link Sha256};
     * * The above dependency implementations are sensitive to [timing attack](https://en.wikipedia.org/wiki/Timing_attack)
     *   and should be not used in the context where such risk is a concern:
     *   read the [Security](https://github.com/paulmillr/noble-hashes/blob/main/README.md#security) note.
     * * Follow links for additional security notes.
     */
    public static fromPrivateKey(
        privateKey: Uint8Array,
        chainCode: Uint8Array
    ): HDKey {
        if (privateKey.length === 32) {
            const header = nc_utils.concatBytes(
                this.EXTENDED_PRIVATE_KEY_PREFIX,
                chainCode,
                Uint8Array.of(0),
                privateKey
            );
            privateKey.fill(0); // Clear the private key from memory.
            const checksum = Sha256.of(Sha256.of(header).bytes).bytes.subarray(
                0,
                4
            );
            const expandedPrivateKey = nc_utils.concatBytes(header, checksum);
            try {
                return s_bip32.HDKey.fromExtendedKey(
                    base58.encode(expandedPrivateKey)
                ) as HDKey;
            } catch (e) {
                throw new IllegalArgumentError(
                    `${FQP}HDNode.fromPrivateKey(privateKey: Uint8Array, chainCode: Uint8Array): HDKey`,
                    'Invalid private key path given as input.'
                );
            }
        }

        // We reach this case if privateKey length is not exactly 32 bytes.
        privateKey.fill(0); // Clear the private key from memory, albeit it is invalid.
        throw new IllegalArgumentError(
            `${FQP}HDNode.fromPrivateKey(privateKey: Uint8Array, chainCode: Uint8Array): HDKey`,
            'Invalid private key path given as input. Length must be exactly 32 bytes.'
        );
    }

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
     * @throws {IllegalArgumentError} if the `publicKey` is invalid.
     *
     * @remarks Security audited method, depends on
     * * [base58.encode](https://github.com/paulmillr/scure-base);
     * * [nc_utils.concatBytes](https://github.com/paulmillr/noble-curves?tab=readme-ov-file#utils-useful-utilities)
     * * [HDKey.fromExtendedKey](https://github.com/paulmillr/scure-bip32).
     * * {@link Secp256k1.compressPublicKey};
     * * {@link Sha256};
     * * The above dependency implementations are sensitive to [timing attack](https://en.wikipedia.org/wiki/Timing_attack)
     *   and should be not used in the context where such risk is a concern:
     *   read the [Security](https://github.com/paulmillr/noble-hashes/blob/main/README.md#security) note.
     * * Follow links for additional security notes.
     */
    public static fromPublicKey(
        publicKey: Uint8Array,
        chainCode: Uint8Array
    ): HDKey {
        if (chainCode.length === 32) {
            const header = nc_utils.concatBytes(
                this.EXTENDED_PUBLIC_KEY_PREFIX,
                chainCode,
                Secp256k1.compressPublicKey(publicKey)
            );
            const checksum = Sha256.of(Sha256.of(header).bytes).bytes.subarray(
                0,
                4
            );
            const expandedPublicKey = nc_utils.concatBytes(header, checksum);
            try {
                return s_bip32.HDKey.fromExtendedKey(
                    base58.encode(expandedPublicKey)
                ) as HDKey;
            } catch (error) {
                throw new IllegalArgumentError(
                    `${FQP}HDNode.fromPublicKey(publicKey: Uint8Array, chainCode: Uint8Array): HDKey)`,
                    'Invalid public key path given as input.',
                    { publicKey },
                    error instanceof Error ? error : undefined
                );
            }
        }
        // We reach this case if chainCode length is not exactly 32 bytes.
        throw new IllegalArgumentError(
            `${FQP}HDNode.fromPublicKey(publicKey: Uint8Array, chainCode: Uint8Array): HDKey)`,
            'Invalid chain code given as input. Length must be exactly 32 bytes.',
            { chainCode }
        );
    }

    /**
     * Checks if BIP32 derivation path is valid.
     *
     * @param derivationPath - Derivation path to check.
     *
     * @returns `true` if derivation path is valid, otherwise `false`.
     */
    public static isDerivationPathValid(derivationPath: string): boolean {
        const bip32Regex = /^m(\/\d+'?){3}(\/\d+){1,2}$/;
        return bip32Regex.test(derivationPath);
    }
}

export { HDKey };
