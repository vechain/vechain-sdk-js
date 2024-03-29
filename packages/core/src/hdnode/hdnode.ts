import { ethers } from 'ethers';
import {
    MNEMONIC_WORDLIST_ALLOWED_SIZES,
    VET_DERIVATION_PATH,
    X_PRIV_PREFIX,
    X_PUB_PREFIX,
    ZERO_BUFFER
} from '../utils';
import { type IHDNode } from './types';
import { addressUtils } from '../address';
import { sha256 } from '../hash';
import { secp256k1 } from '../secp256k1';
import { type WordlistSizeType } from '../mnemonic';
import { assert, HDNODE } from '@vechain/sdk-errors';
import {
    assertIsValidHdNodeChainCode,
    assertIsValidHdNodeDerivationPath
} from '../assertions';

import * as bip32 from '@scure/bip32';
import * as bip39 from '@scure/bip39';

/**
 * Generates an HDNode instance using mnemonic words.
 *
 * @throws {InvalidHDNodeMnemonicsError, InvalidHDNodeDerivationPathError}
 * @param words - The mnemonic words.
 * @param path - The derivation path (default is VET_DERIVATION_PATH).
 * @returns An IHDNode instance derived from the given mnemonic.
 */
function fromMnemonic(words: string[], path = VET_DERIVATION_PATH): IHDNode {
    // Invalid mnemonic words
    assert(
        'fromMnemonic',
        MNEMONIC_WORDLIST_ALLOWED_SIZES.includes(
            words.length as WordlistSizeType
        ),
        HDNODE.INVALID_HDNODE_MNEMONICS,
        'Invalid mnemonic size. Mnemonic must be 12, 15, 18, 21, or 24 words.',
        { words }
    );

    // Invalid derivation path
    assertIsValidHdNodeDerivationPath('fromMnemonic', path);

    // normalize words to lowercase
    const joinedWords = words.join(' ').toLowerCase();
    const node = ethers.HDNodeWallet.fromMnemonic(
        ethers.Mnemonic.fromPhrase(joinedWords),
        path
    );
    return ethersNodeToOurHDNode(node);
}

function fromMnemonicx(words: string[], path = VET_DERIVATION_PATH): IHDNode {
    // Invalid mnemonic words
    // bip39.validateMnemonic(mn, wordlist);

    const seed = bip39.mnemonicToSeedSync(words.join(' ').toLowerCase());
    const master = bip32.HDKey.fromMasterSeed(seed);
    const node = master.derive(path);
    return of(node);
}

function of(hdkey: bip32.HDKey): IHDNode {
    const publicKey =
        hdkey.publicKey != null ? Buffer.from(hdkey.publicKey) : ZERO_BUFFER(0);
    // const address = Buffer.from(
    //     keccak_256(publicKey).slice(publicKey.length - 20)
    // );
    const addr = addressUtils.fromPublicKey(publicKey);
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
            return addr;
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
    assertIsValidHdNodeChainCode('fromPublicKey', chainCode);

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
 * Generates an HDNode instance using an extended private key (xpriv).
 *
 * @throws{InvalidHDNodePrivateKeyError, InvalidHDNodeChaincodeError}
 * @param privateKey - The private key.
 * @param chainCode - The associated chain code.
 * @returns An IHDNode instance derived from the given private key and chain code.
 */
function fromPrivateKey(privateKey: Buffer, chainCode: Buffer): IHDNode {
    // Invalid private key
    assert(
        'fromPrivateKey',
        privateKey.length === 32,
        HDNODE.INVALID_HDNODE_PRIVATE_KEY,
        'Invalid private key. Length must be exactly 32 bytes.',
        { privateKey }
    );

    // Invalid chain code
    assertIsValidHdNodeChainCode('fromPrivateKey', chainCode);

    const key = Buffer.concat([
        X_PRIV_PREFIX,
        chainCode,
        Buffer.from([0]),
        privateKey
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
    fromPublicKey,
    fromPrivateKey,
    fromMnemonicx
};
