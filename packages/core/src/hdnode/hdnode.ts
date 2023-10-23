import { ethers } from 'ethers';
import {
    ERRORS,
    VET_DERIVATION_PATH,
    X_PRIV_PREFIX,
    X_PUB_PREFIX
} from '../utils';
import { type IHDNode } from './types';
import { address } from '../address';
import { sha256 } from '../hash';
import { secp256k1 } from '../secp256k1';

/**
 * Generates an HDNode instance using mnemonic words.
 *
 * @param words - The mnemonic words.
 * @param path - The derivation path (default is VET_DERIVATION_PATH).
 * @returns An IHDNode instance derived from the given mnemonic.
 * @throws {Error} When the mnemonic words are invalid.
 */
function fromMnemonic(words: string[], path = VET_DERIVATION_PATH): IHDNode {
    if (words.length !== 12) {
        throw new Error(ERRORS.HDNODE.INVALID_MNEMONICS);
    }
    // normalize words to lowercase
    const joinedWords = words.join(' ').toLowerCase();
    const node = ethers.HDNodeWallet.fromMnemonic(
        ethers.Mnemonic.fromPhrase(joinedWords),
        path
    );
    return ethersNodeToOurHDNode(node);
}

/**
 * Generates an HDNode instance using an extended public key.
 *
 * @param publicKey - The extended public key.
 * @param chainCode - The associated chain code.
 * @returns An IHDNode instance derived from the given public key and chain code.
 * @throws {Error} When the public key or chain code is invalid.
 */
function fromPublicKey(publicKey: Buffer, chainCode: Buffer): IHDNode {
    // Invalid public key
    if (publicKey.length !== 65)
        throw new Error(ERRORS.HDNODE.INVALID_PUBLICKEY);

    // Invalid chain code
    if (chainCode.length !== 32)
        throw new Error(ERRORS.HDNODE.INVALID_CHAINCODE);

    const compressed = secp256k1.extendedPublicKeyToArray(publicKey, true);
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
 * @param privateKey - The private key.
 * @param chainCode - The associated chain code.
 * @returns An IHDNode instance derived from the given private key and chain code.
 * @throws {Error} When the private key or chain code is invalid.
 */
function fromPrivateKey(privateKey: Buffer, chainCode: Buffer): IHDNode {
    // Invalid private key
    if (privateKey.length !== 32)
        throw new Error(ERRORS.HDNODE.INVALID_PRIVATEKEY);

    // Invalid chain code
    if (chainCode.length !== 32)
        throw new Error(ERRORS.HDNODE.INVALID_CHAINCODE);

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
 * @param ethersNode - The HDNode instance from the `ethers` library.
 * @returns An IHDNode instance in the custom format.
 */
function ethersNodeToOurHDNode(ethersNode: ethers.HDNodeWallet): IHDNode {
    const pub = Buffer.from(
        secp256k1.extendedPublicKeyToArray(
            Buffer.from(ethersNode.publicKey.slice(2), 'hex'),
            false
        )
    );
    const cc = Buffer.from(ethersNode.chainCode.slice(2), 'hex');
    const addr = address.fromPublicKey(pub);

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
            return ethersNodeToOurHDNode(ethersNode.derivePath(path));
        }
    };
}

export const HDNode = {
    fromMnemonic,
    fromPublicKey,
    fromPrivateKey
};
