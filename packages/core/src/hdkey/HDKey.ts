import * as nc_utils from '@noble/curves/abstract/utils';
import * as s_bip32 from '@scure/bip32';
import * as s_bip39 from '@scure/bip39';
import { FixedPointNumber } from '../vcdm/FixedPointNumber';
import { HexUInt } from '../vcdm/HexUInt';
import { IllegalArgumentError } from '../errors';
import { Secp256k1 } from '../secp256k1';
import { Sha256 } from '../vcdm/hash/Sha256';
import { base58 } from '@scure/base';

/**
 * Full Qualified Path
 */
const FQP = 'packages/core/src/hdkey/HDKey.ts!';

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
    public static readonly EXTENDED_PRIVATE_KEY_PREFIX = HexUInt.of(
        '0488ade4000000000000000000'
    ).bytes;

    /**
     * Prefix for extended public key
     */
    public static readonly EXTENDED_PUBLIC_KEY_PREFIX = HexUInt.of(
        '0488b21e000000000000000000'
    ).bytes;

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
     * @param {string[]} words - An array of words representing the mnemonic.
     * @param {string} path - The derivation path to derive the child node.
     * Default value is {@link VET_DERIVATION_PATH}.
     *
     * @return The derived child hierarchical deterministic key.
     *
     * @throws {IllegalArgumentError} If `words` or `path` are invalid.
     *
     * @remarks Security auditable method, depends on
     * * [s_bip32.HDKey.derive](https://github.com/paulmillr/scure-bip32);
     * * [s_bip32.HDKey.fromMasterSeed](https://github.com/paulmillr/scure-bip32);
     * * [s_bip39.mnemonicToSeedSync](https://github.com/paulmillr/scure-bip39).
     */
    public static fromMnemonic(
        words: string[],
        path: string = this.VET_DERIVATION_PATH
    ): HDKey {
        let master: s_bip32.HDKey;
        try {
            master = s_bip32.HDKey.fromMasterSeed(
                s_bip39.mnemonicToSeedSync(words.join(' ').toLowerCase())
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
     * @param {privateKey} The private key.
     * @param {chainCode} The chain code.
     *
     * @returns Returns the hierarchical deterministic key from `privateKey` and `chainCode`.
     *
     * @throws {IllegalArgumentError} If the `privateKey` is invalid.
     *
     * @remarks Security auditable method, depends on
     * * [base58.encode](https://github.com/paulmillr/scure-base);
     * * {@link Sha256};
     * * [s_bip32.HDKey.fromExtendedKey](https://github.com/paulmillr/scure-bip32).
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
     * @remarks Security auditable method, depends on
     * * [base58.encode](https://github.com/paulmillr/scure-base);
     * * {@link Secp256k1.compressPublicKey};
     * * {@link Sha256};
     * * [HDKey.fromExtendedKey](https://github.com/paulmillr/scure-bip32).
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
     * Checks if derivation path single component is valid
     *
     * @param component - Derivation path single component to check
     * @param index - Derivation path single component index
     *
     * @returns `true`` if derivation path single component is valid, otherwise `false`.
     *
     */
    private static isDerivationPathComponentValid(
        component: string,
        index: number
    ): boolean {
        // Zero component can be "m" or "number" or "number'", other components can be only "number" or "number'"
        return (
            // m
            (index === 0 ? component === 'm' : false) ||
            // "number"
            FixedPointNumber.isNaturalExpression(component) ||
            // "number'"
            (FixedPointNumber.isNaturalExpression(component.slice(0, -1)) &&
                component.endsWith("'"))
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
