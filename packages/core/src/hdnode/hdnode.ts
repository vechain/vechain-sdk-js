import * as s_bip32 from '@scure/bip32';
import * as s_bip39 from '@scure/bip39';
import * as nc_utils from '@noble/curves/abstract/utils';
import { base58 } from '@scure/base';
import { secp256k1 } from '../secp256k1';
import { Sha256 } from '../hash';
import { VET_DERIVATION_PATH, X_PRIV_PREFIX, X_PUB_PREFIX } from '../utils';
import {
    InvalidHDNode,
    InvalidHDNodeMnemonic,
    InvalidSecp256k1PrivateKey
} from '@vechain/sdk-errors';

class HDNode extends s_bip32.HDKey {
    /**
     * Creates a
     * [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
     * node wallet from
     * [BIP39 Mnemonic Words](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
     * and from it derives a child node based on the given derivation path.
     *
     * @param {string[]} words - An array of words representing the mnemonic.
     * @param {string} path - The derivation path to derive the child node.
     *
     * Default value is {@link VET_DERIVATION_PATH}.
     * @return {bip32.HDKey} - An instance of s_bip32.HDKey representing the derived child node.
     *
     * @throws {InvalidHDNode} If `path` is not valid to derive a node wallet.
     * @throws {InvalidHDNodeMnemonic} If `words` is an invalid array mnemonic.
     *
     * @remarks Security auditable method, depends on
     * * [s_bip32.HDKey.derive](https://github.com/paulmillr/scure-bip32);
     * * [s_bip32.HDKey.fromMasterSeed](https://github.com/paulmillr/scure-bip32);
     * * [s_bip39.mnemonicToSeedSync](https://github.com/paulmillr/scure-bip39)
     */
    public static fromMnemonic(
        words: string[],
        path: string = VET_DERIVATION_PATH
    ): HDNode {
        let master: s_bip32.HDKey;
        try {
            master = s_bip32.HDKey.fromMasterSeed(
                s_bip39.mnemonicToSeedSync(words.join(' ').toLowerCase())
            );
        } catch (error) {
            // The error masks any mnemonic words leak.
            throw new InvalidHDNodeMnemonic(
                'HDNode.fromMnemonic',
                'Invalid mnemonic words given as input.',
                undefined,
                error
            );
        }
        try {
            return master.derive(path) as HDNode;
        } catch (error) {
            throw new InvalidHDNode(
                'HDNode.fromMnemonic',
                'Invalid derivation path given as input.',
                { derivationPath: path },
                error
            );
        }
    }

    /**
     * Creates a
     * [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
     * node wallet from a private key and chain code.
     *
     * Secure audit function.
     * - [base58](https://github.com/paulmillr/scure-base)
     * - [s_bip32](https://github.com/paulmillr/scure-bip32).
     *
     * @param {Uint8Array} privateKey The private key.
     * @param {Uint8Array} chainCode The chain code.
     *
     * @returns Returns the node wallet from `privateKey` and `chainCode`.
     *
     * @throws {InvalidSecp256k1PrivateKey}
     */
    public static fromPrivateKey(
        privateKey: Uint8Array,
        chainCode: Uint8Array
    ): HDNode {
        if (privateKey.length === 32) {
            const header = nc_utils.concatBytes(
                X_PRIV_PREFIX,
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
                ) as HDNode;
            } catch (error) {
                throw new InvalidSecp256k1PrivateKey(
                    'HDNode.fromPrivateKey()',
                    'Invalid private key path given as input.',
                    undefined
                );
            }
        }

        // We reach this case if privateKey length is not exactly 32 bytes.
        privateKey.fill(0); // Clear the private key from memory, albeit it is invalid.
        throw new InvalidSecp256k1PrivateKey(
            'HDNode.fromPrivateKey()',
            'Invalid private key path given as input. Length must be exactly 32 bytes.',
            undefined
        );
    }

    /**
     * Creates a [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
     * {@link bip32.HDKey} node from a public key and chain code.
     *
     * @param {Uint8Array} publicKey - The public key bytes.
     * @param {Uint8Array} chainCode - The chain code bytes.
     * @returns {bip32.HDKey} - The `s_bip32.HDKey` object.
     * @throws {InvalidHDNode}
     */
    public static fromPublicKey(
        publicKey: Uint8Array,
        chainCode: Uint8Array
    ): HDNode {
        if (chainCode.length === 32) {
            const header = nc_utils.concatBytes(
                X_PUB_PREFIX,
                chainCode,
                secp256k1.compressPublicKey(publicKey)
            );
            const checksum = Sha256.of(Sha256.of(header).bytes).bytes.subarray(
                0,
                4
            );
            const expandedPublicKey = nc_utils.concatBytes(header, checksum);
            try {
                return s_bip32.HDKey.fromExtendedKey(
                    base58.encode(expandedPublicKey)
                ) as HDNode;
            } catch (error) {
                throw new InvalidHDNode(
                    'HDNode.fromPublicKey()',
                    'Invalid public key path given as input.',
                    { publicKey },
                    error
                );
            }
        }

        // We reach this case if chainCode length is not exactly 32 bytes.
        throw new InvalidHDNode(
            'HDNode.fromPublicKey()',
            'Invalid chain code given as input. Length must be exactly 32 bytes.',
            { chainCode }
        );
    }
}

export { HDNode };
