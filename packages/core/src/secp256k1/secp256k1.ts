import { randomBytes } from 'crypto';
import {
    ERRORS,
    PRIVATE_KEY_MAX_VALUE,
    SIGNATURE_LENGTH,
    ZERO_BUFFER
} from '../utils';
import { ec as EC } from 'elliptic';

// Cureve algorithm
const curve = new EC('secp256k1');

/**
 * Validate message hash
 * @param hash of message
 * @returns if message hash is valid or not
 */
function isValidMessageHash(hash: Buffer): boolean {
    return Buffer.isBuffer(hash) && hash.length === 32;
}

/**
 * Verify if private key is valid
 * @returns If private key is valid or not
 */
function isValidPrivateKey(key: Buffer): boolean {
    return (
        Buffer.isBuffer(key) &&
        key.length === 32 &&
        !key.equals(ZERO_BUFFER(32)) &&
        key.compare(PRIVATE_KEY_MAX_VALUE) < 0
    );
}

/**
 * Generate a random secure private key
 */
function generate(entropy?: () => Buffer): Buffer {
    entropy = entropy ?? ((): Buffer => randomBytes(32));
    let privKey: Buffer;
    do {
        privKey = entropy();
    } while (!isValidPrivateKey(privKey));
    return privKey;
}

/**
 * Generate public key from private key
 *
 * @param privateKey Private key used to genrate public key
 * @returns Public key
 */
function derivePublicKey(privateKey: Buffer): Buffer {
    if (!isValidPrivateKey(privateKey)) {
        throw new Error(ERRORS.SECP256K1.INVALID_PRIVATE_KEY);
    }
    const keyPair = curve.keyFromPrivate(privateKey);
    return Buffer.from(keyPair.getPublic().encode('array', false));
}

/**
 * sign a message using elliptic curve algorithm on the curve secp256k1
 * @param msgHash hash of message
 * @param privKey serialized private key
 */
function sign(msgHash: Buffer, privKey: Buffer): Buffer {
    if (!isValidMessageHash(msgHash)) {
        throw new Error(ERRORS.SECP256K1.INVALID_MESSAGE_HASH);
    }

    if (!isValidPrivateKey(privKey)) {
        throw new Error(ERRORS.SECP256K1.INVALID_PRIVATE_KEY);
    }

    const keyPair = curve.keyFromPrivate(privKey);
    const sig = keyPair.sign(msgHash, { canonical: true });

    const r = Buffer.from(sig.r.toArray('be', 32));
    const s = Buffer.from(sig.s.toArray('be', 32));

    return Buffer.concat([r, s, Buffer.from([sig.recoveryParam as number])]);
}

/**
 * recovery signature to public key
 * @param msgHash hash of message
 * @param sig signature
 */
function recover(msgHash: Buffer, sig: Buffer): Buffer {
    if (!isValidMessageHash(msgHash)) {
        throw new Error(ERRORS.SECP256K1.INVALID_MESSAGE_HASH);
    }
    if (!Buffer.isBuffer(sig) || sig.length !== SIGNATURE_LENGTH) {
        throw new Error(ERRORS.SECP256K1.INVALID_SIGNATURE);
    }
    const recovery = sig[64];
    if (recovery !== 0 && recovery !== 1) {
        throw new Error(ERRORS.SECP256K1.INVALID_SIGNATURE_RECOVERY);
    }

    const rCopy = Uint8Array.from(sig);
    const r = rCopy.slice(0, 32);

    const sCopy = Uint8Array.from(sig);
    const s = sCopy.slice(32, 64);

    return Buffer.from(
        (
            curve.recoverPubKey(msgHash, { r, s }, recovery) as {
                encode: (enc: string, flag: boolean) => ArrayBuffer;
            }
        ).encode('array', false)
    );
}

/**
 * Convert extended public key to array public key (compressed or uncompressed)
 *
 * @param extendedPublicKey extended public key
 * @returns array public key
 */
function extendedPublicKeyToArray(
    extendedPublicKey: Buffer,
    compact: boolean
): number[] {
    return curve.keyFromPublic(extendedPublicKey).getPublic(compact, 'array');
}

export const secp256k1 = {
    isValidMessageHash,
    isValidPrivateKey,
    generate,
    derivePublicKey,
    sign,
    recover,
    extendedPublicKeyToArray
};
