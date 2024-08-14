import * as n_bip32 from '@scure/bip32';
import * as n_bip39 from '@scure/bip39';
import * as n_utils from '@noble/curves/abstract/utils';
import {
    InvalidHDNode,
    InvalidHDNodeMnemonic,
    InvalidSecp256k1PrivateKey
} from '@vechain/sdk-errors';
import { base58 } from '@scure/base';
import { secp256k1 } from '../secp256k1';
import { Sha256 } from '../hash';
import { VET_DERIVATION_PATH, X_PRIV_PREFIX, X_PUB_PREFIX } from '../utils';

/**
 * Creates a [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
 * {@link bip32.HDKey} node
 * from [BIP39 Mnemonic Words](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) and from it
 * derives a child HDKey node based on the given derivation path.
 *
 * Secure audit function.
 * - [n_bip32](https://github.com/paulmillr/scure-bip32).
 * - [n_bip39](https://github.com/paulmillr/scure-bip39)
 *
 * @param {string[]} words - An array of words representing the mnemonic.
 * @param {string} path - The derivation path to derive the child node.
 * Default value is {@link VET_DERIVATION_PATH}.
 * @return {bip32.HDKey} - An instance of n_bip32.HDKey representing the derived child node.
 * @throws {InvalidHDNodeMnemonic,InvalidHDNode}
 */
function fromMnemonic(
    words: string[],
    path: string = VET_DERIVATION_PATH
): n_bip32.HDKey {
    let master: n_bip32.HDKey;
    try {
        master = n_bip32.HDKey.fromMasterSeed(
            n_bip39.mnemonicToSeedSync(words.join(' ').toLowerCase())
        );
    } catch (error) {
        // The error masks any mnemonic words leak.
        throw new InvalidHDNodeMnemonic(
            'HDNode.fromMnemonic()',
            'Invalid mnemonic words given as input.',
            undefined,
            error
        );
    }
    try {
        return master.derive(path);
    } catch (error) {
        throw new InvalidHDNode(
            'HDNode.fromMnemonic()',
            'Invalid derivation path given as input.',
            { derivationPath: path },
            error
        );
    }
}

/**
 * Creates a [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
 * {@link bip32.HDKey} node from a private key and chain code.
 *
 * Secure audit function.
 * - [base58](https://github.com/paulmillr/scure-base)
 * - [n_bip32](https://github.com/paulmillr/scure-bip32).
 *
 * @param {Uint8Array} privateKey The private key.
 * @param {Uint8Array} chainCode The chain code.
 * @returns {bip32.HDKey} The `n_bip32.HDKey` object.
 * @throws {InvalidSecp256k1PrivateKey}
 */
function fromPrivateKey(
    privateKey: Uint8Array,
    chainCode: Uint8Array
): n_bip32.HDKey {
    if (privateKey.length === 32) {
        const header = n_utils.concatBytes(
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
        const expandedPrivateKey = n_utils.concatBytes(header, checksum);
        try {
            return n_bip32.HDKey.fromExtendedKey(
                base58.encode(expandedPrivateKey)
            );
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
 * @returns {bip32.HDKey} - The `n_bip32.HDKey` object.
 * @throws {InvalidHDNode}
 */
function fromPublicKey(
    publicKey: Uint8Array,
    chainCode: Uint8Array
): n_bip32.HDKey {
    if (chainCode.length === 32) {
        const header = n_utils.concatBytes(
            X_PUB_PREFIX,
            chainCode,
            secp256k1.compressPublicKey(publicKey)
        );
        const checksum = Sha256.of(Sha256.of(header).bytes).bytes.subarray(
            0,
            4
        );
        const expandedPublicKey = n_utils.concatBytes(header, checksum);
        try {
            return n_bip32.HDKey.fromExtendedKey(
                base58.encode(expandedPublicKey)
            );
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

export const HDNode = {
    fromMnemonic,
    fromPrivateKey,
    fromPublicKey
};
