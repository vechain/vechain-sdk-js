import * as bip32 from '@scure/bip32';
import * as bip39 from '@scure/bip39';
import { addressUtils } from '../address';
import { assert, buildError, HDNODE } from '@vechain/sdk-errors';
import { base58 } from '@scure/base';
import { secp256k1 } from '../secp256k1';
import { sha256 } from '../hash';
import { type IHDNode } from './types';
import {
    VET_DERIVATION_PATH,
    X_PRIV_PREFIX,
    X_PUB_PREFIX,
    ZERO_BUFFER
} from '../utils';
import { wordlist } from '@scure/bip39/wordlists/english';

/**
 * Create an HDNode from a mnemonic phrase.
 *
 * Security audit function.
 * * [bip32](https://github.com/paulmillr/scure-bip32)
 * * [bip39](https://github.com/paulmillr/scure-bip39)
 *
 * @param {string[]} words - The mnemonic words.
 * @param {string} path - The derivation path. Defaults to {@link VET_DERIVATION_PATH}.
 * @returns {IHDNode} The created HDNode from mnemonic `words.
 * @throws {HDNODE.INVALID_HDNODE_DERIVATION_PATH} an error if the derivation path is invalid.
 * @throws {HDNODE.INVALID_HDNODE_MNEMONICS} an error if the mnemonic is invalid or if the derivation path is invalid.
 */
function fromMnemonic(words: string[], path = VET_DERIVATION_PATH): IHDNode {
    const mnemonic = words.join(' ').toLowerCase();
    assert(
        'HDNode.fromMnemonic',
        bip39.validateMnemonic(mnemonic, wordlist),
        HDNODE.INVALID_HDNODE_MNEMONICS,
        'Invalid mnemonic size. Mnemonic must be 12, 15, 18, 21, or 24 words.',
        { words }
    );
    try {
        return of(
            bip32.HDKey.fromMasterSeed(
                bip39.mnemonicToSeedSync(mnemonic)
            ).derive(path)
        );
    } catch (error) {
        throw buildError(
            'HDnode.fromMnemonic',
            HDNODE.INVALID_HDNODE_DERIVATION_PATH,
            'Invalid derivation path. Ensure the path adheres to the standard format.',
            { path },
            error
        );
    }
}

/**
 * Creates an HDNode from a private key and chain code.
 *
 * Security audit function.
 * [base58](https://github.com/paulmillr/scure-base)
 * [bip32](https://github.com/paulmillr/scure-bip32)
 *
 * @param {Buffer} privateKey - The private key to create the HDNode from.
 * @param {Buffer} chainCode - The chain code associated with the private key.
 * @returns {IHDNode} - The created HDNode.
 * @throws {HDNODE.INVALID_HDNODE_CHAIN_CODE} an error if chain code is invalid.
 * @throws {HDNODE.INVALID_HDNODE_PRIVATE_KEY} an error if the private key is invalid.
 */
function fromPrivateKey(privateKey: Buffer, chainCode: Buffer): IHDNode {
    assert(
        'HDNode.fromPrivateKey',
        privateKey.length === 32,
        HDNODE.INVALID_HDNODE_PRIVATE_KEY,
        'Invalid private key. Length must be exactly 32 bytes.',
        { privateKey }
    );
    const header = Buffer.concat([
        X_PRIV_PREFIX,
        chainCode,
        Buffer.from([0]),
        privateKey
    ]);
    const checksum = sha256(sha256(header)).subarray(0, 4);
    const xPrivateKey = Buffer.concat([header, checksum]);
    try {
        return of(bip32.HDKey.fromExtendedKey(base58.encode(xPrivateKey)));
    } catch (error) {
        throw buildError(
            'HDNode.fromPrivateKey',
            HDNODE.INVALID_HDNODE_CHAIN_CODE,
            'Invalid chain code. Length must be exactly 32 bytes.',
            { chainCode },
            error
        );
    }
}

/**
 * Creates an HDNode instance from a public key and chain code.
 *
 * Security audit function.
 * [base58](https://github.com/paulmillr/scure-base)
 * [bip32](https://github.com/paulmillr/scure-bip32)
 *
 * @param {Buffer} publicKey - The public key.
 * @param {Buffer} chainCode - The chain code.
 * @returns {IHDNode} - The HDNode instance.
 * @throws {HDNODE.INVALID_HDNODE_CHAIN_CODE} an error if chain code is invalid.
 * @throws {HDNODE.INVALID_HDNODE_PUBLIC_KEY} an error if the public key is invalid.
 */
function fromPublicKey(publicKey: Buffer, chainCode: Buffer): IHDNode {
    assert(
        'HDNode.fromPublicKey',
        chainCode.length === 32,
        HDNODE.INVALID_HDNODE_CHAIN_CODE,
        'Invalid chain code. Length must be exactly 32 bytes.',
        { chainCode }
    );
    const compressed = secp256k1.compressPublicKey(publicKey);
    const header = Buffer.concat([
        X_PUB_PREFIX,
        chainCode,
        Buffer.from(compressed)
    ]);
    const checksum = sha256(sha256(header)).subarray(0, 4);
    const xPublicKey = Buffer.concat([header, checksum]);
    try {
        return of(bip32.HDKey.fromExtendedKey(base58.encode(xPublicKey)));
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

/**
 * Creates an instance of IHDNode using the provided HDKey.
 *
 * If the input `hdkey` has missing properties (`null` or `undefined`) those
 * must be present in the returned `IHDNode`, those are represented as an
 * empty {@link Buffer}.
 *
 * @param {bip32.HDKey} hdkey - The HDKey to create the IHDNode from.
 * @returns {IHDNode} The created IHDNode instance.
 */
function of(hdkey: bip32.HDKey): IHDNode {
    const publicKey =
        hdkey.publicKey != null ? Buffer.from(hdkey.publicKey) : ZERO_BUFFER(0);
    const address = addressUtils.fromPublicKey(publicKey);
    return {
        get publicKey() {
            return publicKey;
        },
        get privateKey() {
            return hdkey.privateKey != null
                ? Buffer.from(hdkey.privateKey)
                : null;
        },
        get chainCode() {
            return hdkey.chainCode != null
                ? Buffer.from(hdkey.chainCode)
                : ZERO_BUFFER(0);
        },
        get address() {
            return address;
        },
        derive(index) {
            return of(hdkey.deriveChild(index));
        },
        derivePath(path: string) {
            return of(hdkey.derive(path));
        }
    };
}

export const HDNode = {
    fromMnemonic,
    fromPrivateKey,
    fromPublicKey
};
