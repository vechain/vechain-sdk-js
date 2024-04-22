import * as bip32 from '@scure/bip32';
import * as bip39 from '@scure/bip39';
import * as utils from '@noble/curves/abstract/utils';
import { assert, buildError, HDNODE } from '@vechain/sdk-errors';
import { base58 } from '@scure/base';
import { mnemonic } from '../mnemonic';
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
        throw buildError(
            'HDNode.fromMnemonic',
            HDNODE.INVALID_HDNODE_MNEMONICS,
            (error as Error).message,
            { mnemonic },
            error
        );
    }
    try {
        return master.derive(path);
    } catch (error) {
        throw buildError(
            'HDNode.fromMnemonic',
            HDNODE.INVALID_HDNODE_DERIVATION_PATH,
            'Invalid derivation path.',
            { path },
            error
        );
    }
}

function fromPrivateKey(
    privateKey: Uint8Array,
    chainCode: Uint8Array
): bip32.HDKey {
    assert(
        'HDNode.fromPrivateKey',
        privateKey.length === 32,
        HDNODE.INVALID_HDNODE_PRIVATE_KEY,
        'Invalid private key. Length must be exactly 32 bytes.',
        { privateKey }
    );
    const header = utils.concatBytes(
        X_PRIV_PREFIX,
        chainCode,
        Buffer.from([0]),
        privateKey
    );
    const checksum = sha256(sha256(header)).subarray(0, 4);
    const expandedPrivateKey = utils.concatBytes(header, checksum);
    try {
        return bip32.HDKey.fromExtendedKey(base58.encode(expandedPrivateKey));
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

function fromPublicKey(
    publicKey: Uint8Array,
    chainCode: Uint8Array
): bip32.HDKey {
    assert(
        'HDNode.fromPublicKey',
        chainCode.length === 32,
        HDNODE.INVALID_HDNODE_CHAIN_CODE,
        'Invalid chain code. Length must be exactly 32 bytes.',
        { chainCode }
    );
    const header = utils.concatBytes(
        X_PUB_PREFIX,
        chainCode,
        secp256k1.compressPublicKey(publicKey)
    );
    const checksum = sha256(sha256(header)).subarray(0, 4);
    const expandedPublicKey = Buffer.concat([header, checksum]);
    try {
        return bip32.HDKey.fromExtendedKey(base58.encode(expandedPublicKey));
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

export const HDNode = {
    fromMnemonic,
    fromPrivateKey,
    fromPublicKey
};
