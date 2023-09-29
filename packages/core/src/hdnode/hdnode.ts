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
 * Create node from mnemonic words
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
    return createHDNode(node);
}

/**
 * Create node from extended public key
 *
 * @param pub public key
 * @param chainCode chain code
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
    const checksum = sha256AppliedToABuffer(sha256AppliedToABuffer(key));
    const slicedChecksum = checksum.subarray(0, 4);

    const node = ethers.HDNodeWallet.fromExtendedKey(
        ethers.encodeBase58(Buffer.concat([key, slicedChecksum]))
    ) as ethers.HDNodeWallet;
    return createHDNode(node);
}

/**
 * Create node from xpriv
 *
 * @param priv private key
 * @param chainCode chain code
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
    const checksum = sha256AppliedToABuffer(sha256AppliedToABuffer(key));
    const slicedChecksum = checksum.subarray(0, 4);

    const node = ethers.HDNodeWallet.fromExtendedKey(
        ethers.encodeBase58(Buffer.concat([key, slicedChecksum]))
    ) as ethers.HDNodeWallet;
    return createHDNode(node);
}

/**
 * Create a HDNode from an ethers HDNode
 *
 * @param ethersNode Node in ethers format
 * @returns Our HDNode format
 */
function createHDNode(ethersNode: ethers.HDNodeWallet): IHDNode {
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
            return createHDNode(ethersNode.deriveChild(index));
        }
    };
}

/**
 * Calculate sha256 hash of data expressed as buffer
 *
 * @param data Data to hash as buffer
 * @returns Sha256 hash of data as buffer
 */
function sha256AppliedToABuffer(data: Buffer): Buffer {
    const dataAsString = `0x${data.toString('hex')}`;
    const hashAsString = sha256(dataAsString);

    return Buffer.from(hashAsString.slice(2), 'hex');
}

export const HDNode = {
    fromMnemonic,
    fromPublicKey,
    fromPrivateKey,
    createHDNode
};
