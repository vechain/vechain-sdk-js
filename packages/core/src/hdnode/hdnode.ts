import * as bip32 from '@scure/bip32';
import * as bip39 from '@scure/bip39';
import * as utils from '@noble/curves/abstract/utils';
import { buildError, HDNODE } from '@vechain/sdk-errors';
import { base58 } from '@scure/base';
import { secp256k1 } from '../secp256k1';
import { sha256 } from '../hash';
import { VET_DERIVATION_PATH } from '../utils';

/**
 * Prefix for extended private key
 */
const X_PRIV_PREFIX = utils.hexToBytes('0488ade4000000000000000000');

/**
 * Prefix for extended public key
 */
const X_PUB_PREFIX = utils.hexToBytes('0488b21e000000000000000000');

/**
 * Creates a [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
 * {@link bip32.HDKey} node
 * from [BIP39 Mnemonic Words](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) and from it
 * derives a child HDKey node based on the given derivation path.
 *
 * Secure audit function.
 * - [bip32](https://github.com/paulmillr/scure-bip32).
 * - [bip39](https://github.com/paulmillr/scure-bip39)
 *
 * @param {string[]} words - An array of words representing the mnemonic.
 * @param {string} path - The derivation path to derive the child node.
 * Default value is {@link VET_DERIVATION_PATH}.
 *
 * @return {bip32.HDKey} - An instance of bip32.HDKey representing the derived child node.
 *
 * @throws {InvalidHDNodeMnemonicsError} If an error occurs generating the master `bip32.HDKey` from `words`.
 * @throws {InvalidHDNodeDerivationPathError} If an error occurs deriving the `bip32.HDKey` at `path` from the master HDKey
 */
function fromMnemonic(
    words: string[],
    path = VET_DERIVATION_PATH
): bip32.HDKey {
    let master: bip32.HDKey;
    try {
        master = bip32.HDKey.fromMasterSeed(
            bip39.mnemonicToSeedSync(words.join(' ').toLowerCase())
        );
    } catch (error) {
        // The error masks any mnemonic words leak.
        throw buildError(
            'HDNode.fromMnemonic',
            HDNODE.INVALID_HDNODE_MNEMONICS,
            'Invalid mnemonic words.'
        );
    }
    try {
        return master.derive(path);
    } catch (error) {
        throw buildError(
            'HDNode.fromMnemonic',
            HDNODE.INVALID_HDNODE_DERIVATION_PATH,
            (error as Error).message,
            { path },
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
 * - [bip32](https://github.com/paulmillr/scure-bip32).
 *
 * @param {Uint8Array} privateKey The private key.
 * @param {Uint8Array} chainCode The chain code.
 *
 * @returns {bip32.HDKey} The `bip32.HDKey` object.
 *
 * @throws {InvalidHDNodePrivateKeyError} If `privateKey` length is not exactly 32 bytes.
 * @throws {InvalidHDNodeChaincodeError} if an error occurs deriving the {@link bip32.HDNode}
 * from the combination of `privateKey` and `chainCode`.
 */
function fromPrivateKey(
    privateKey: Uint8Array,
    chainCode: Uint8Array
): bip32.HDKey {
    if (privateKey.length === 32) {
        const header = utils.concatBytes(
            X_PRIV_PREFIX,
            chainCode,
            Uint8Array.of(0),
            privateKey
        );
        privateKey.fill(0); // Clear the private key from memory.
        const checksum = sha256(sha256(header)).subarray(0, 4);
        const expandedPrivateKey = utils.concatBytes(header, checksum);
        try {
            return bip32.HDKey.fromExtendedKey(
                base58.encode(expandedPrivateKey)
            );
        } catch (error) {
            throw buildError(
                'HDNode.fromPrivateKey',
                HDNODE.INVALID_HDNODE_CHAIN_CODE,
                (error as Error).message,
                { chainCode }
            );
        }
    }
    privateKey.fill(0); // Clear the private key from memory, albeit it is invalid.
    throw buildError(
        'HDNode.fromPrivateKey',
        HDNODE.INVALID_HDNODE_PRIVATE_KEY,
        'Invalid private key. Length must be exactly 32 bytes.'
    );
}

/**
 * Creates a [BIP32 Hierarchical Deterministic Key](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
 * {@link bip32.HDKey} node from a public key and chain code.
 *
 * @param {Uint8Array} publicKey - The public key bytes.
 * @param {Uint8Array} chainCode - The chain code bytes.
 *
 * @returns {bip32.HDKey} - The `bip32.HDKey` object.
 *
 * @throws {InvalidHDNodeChaincodeError} If `chainCode` length is not exactly 32 bytes.
 */
function fromPublicKey(
    publicKey: Uint8Array,
    chainCode: Uint8Array
): bip32.HDKey {
    if (chainCode.length === 32) {
        const header = utils.concatBytes(
            X_PUB_PREFIX,
            chainCode,
            secp256k1.compressPublicKey(publicKey)
        );
        const checksum = sha256(sha256(header)).subarray(0, 4);
        const expandedPublicKey = utils.concatBytes(header, checksum);
        try {
            return bip32.HDKey.fromExtendedKey(
                base58.encode(expandedPublicKey)
            );
        } catch (error) {
            throw buildError(
                'HDNode.fromPublicKey',
                HDNODE.INVALID_HDNODE_PUBLIC_KEY,
                'Invalid public key.',
                { publicKey },
                error
            );
        }
    }
    throw buildError(
        'HDNode.fromPublicKey',
        HDNODE.INVALID_HDNODE_CHAIN_CODE,
        'Invalid chain code. Length must be exactly 32 bytes.',
        { chainCode }
    );
}

export const HDNode = {
    fromMnemonic,
    fromPrivateKey,
    fromPublicKey
};
