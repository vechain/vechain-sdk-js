import { ethers } from 'ethers';
import {
    VET_DERIVATION_PATH,
    X_PRIV_PREFIX,
    X_PUB_PREFIX,
    ZERO_BUFFER
} from '../utils';
import { type IHDNode } from './types';
import { addressUtils } from '../address';
import { sha256 } from '../hash';
import { secp256k1 } from '../secp256k1';
import { assert, buildError, HDNODE } from '@vechain/sdk-errors';
import { assertIsValidHdNodeDerivationPath } from '../assertions';

import * as bip32 from '@scure/bip32';
import * as bip39 from '@scure/bip39';
import { base58 } from '@scure/base';
import { wordlist } from '@scure/bip39/wordlists/english';

/**
 * Create an HDNode from a mnemonic phrase.
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

/**
 * Creates an HDNode from a private key and chain code.
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
 * Generates an HDNode instance using an extended public key.
 *
 * @throws{InvalidHDNodePublicKeyError, InvalidHDNodeChaincodeError}
 * @param publicKey - The extended public key.
 * @param chainCode - The associated chain code.
 * @returns An IHDNode instance derived from the given public key and chain code.
 */
function fromPublicKey(publicKey: Buffer, chainCode: Buffer): IHDNode {
    // Invalid public key
    // assert(
    //     'fromPublicKey',
    //     publicKey.length === 65,
    //     HDNODE.INVALID_HDNODE_PUBLIC_KEY,
    //     'Invalid public key. Length must be exactly 65 bytes.',
    //     { publicKey }
    // );

    // Invalid chain code
    // assertIsValidHdNodeChainCode('fromPublicKey', chainCode);

    // no need of elliptic lib
    const compressed = secp256k1.publicKeyToArray(publicKey, true);
    const key = Buffer.concat([
        X_PUB_PREFIX,
        chainCode,
        Buffer.from(compressed)
    ]);
    const checksum = sha256(sha256(key));
    const slicedChecksum = checksum.subarray(0, 4);

    const node = ethers.HDNodeWallet.fromExtendedKey(
        ethers.encodeBase58(Buffer.concat([key, slicedChecksum]))
    ) as ethers.HDNodeWallet;
    return ethersNodeToOurHDNode(node);
}

/**
 * Converts an `ethers` HDNode to a custom HDNode format.
 *
 * @throws{InvalidHDNodeDerivationPathError}
 * @param ethersNode - The HDNode instance from the `ethers` library.
 * @returns An IHDNode instance in the custom format.
 */
function ethersNodeToOurHDNode(ethersNode: ethers.HDNodeWallet): IHDNode {
    //     const pub = Buffer.from(
    //         secp256k1.publicKeyToArray(
    //             Buffer.from(ethersNode.publicKey.slice(2), 'hex'),
    //             false
    //         )
    //     );
    const pub = Buffer.from(
        secp256k1.compressPublicKey(
            Buffer.from(ethersNode.publicKey.slice(2), 'hex')
        )
    );
    const cc = Buffer.from(ethersNode.chainCode.slice(2), 'hex');
    const addr = addressUtils.fromPublicKey(pub);
    return {
        get publicKey() {
            return pub;
        },
        get privateKey() {
            if (ethersNode.privateKey !== undefined)
                return Buffer.from(ethersNode.privateKey.slice(2), 'hex');
            return null;
        },
        get chainCode() {
            return cc;
        },
        get address() {
            return addr;
        },
        derive(index) {
            return ethersNodeToOurHDNode(ethersNode.deriveChild(index));
        },
        derivePath(path: string) {
            // Invalid derivation path
            assertIsValidHdNodeDerivationPath('ethersNodeToOurHDNode', path);

            return ethersNodeToOurHDNode(ethersNode.derivePath(path));
        }
    };
}

export const HDNode = {
    fromMnemonic,
    fromPrivateKey,
    fromPublicKey
};
