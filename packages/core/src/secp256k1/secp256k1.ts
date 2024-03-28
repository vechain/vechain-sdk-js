import { Hex, Hex0x, PRIVATE_KEY_MAX_VALUE, SIGNATURE_LENGTH, ZERO_BUFFER } from '../utils';
import { ec as EC } from 'elliptic';
import { assert, SECP256K1 } from '@vechain/sdk-errors';
import {
    assertIsValidPrivateKey,
    assertIsValidSecp256k1MessageHash
} from '../assertions';

import { BN } from 'bn.js';
import { secp256k1 as _secp256k1 } from '@noble/curves/secp256k1';
import { randomBytes as _randomBytes } from '@noble/hashes/utils';

// Curve algorithm.
const curve = new EC('secp256k1');

/**
 * Validate message hash.
 * @param hash of message.
 * @returns if message hash is valid or not.
 */
function isValidMessageHash(hash: Buffer): boolean {
    return Buffer.isBuffer(hash) && hash.length === 32;
}

/**
 * Verify if private key is valid.
 * @returns If private key is valid or not.
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
 * Generate private key using elliptic curve algorithm on the curve secp256k1.
 * @returns Private key generated.
 */
function generatePrivateKey(): Buffer {
    return Buffer.from(_secp256k1.utils.randomPrivateKey());
}

/**
 * Derive public key from private key using elliptic curve algorithm secp256k1.
 *
 * @throws{InvalidSecp256k1PrivateKeyError}
 * @param privateKey - private key to derive public key from.
 * @returns Public key derived from private key.
 */
function derivePublicKey(privateKey: Buffer): Buffer {
    assertIsValidPrivateKey('derivePublicKey', privateKey, isValidPrivateKey);
    const publicKey = _secp256k1.getPublicKey(privateKey, false);
    return Buffer.from(publicKey);
}

/**
 * Sign a message using elliptic curve algorithm secp256k1.
 *
 * @throws{InvalidSecp256k1PrivateKeyError, InvalidSecp256k1MessageHashError}
 * @param messageHash hash of message.
 * @param privateKey serialized private key.
 */
function sign(messageHash: Buffer, privateKey: Buffer): Buffer {
    assertIsValidSecp256k1MessageHash('sign', messageHash, isValidMessageHash);
    assertIsValidPrivateKey('sign', privateKey, isValidPrivateKey);
    const sig = _secp256k1.sign(messageHash, privateKey);
    const r = Buffer.from(new BN(sig.r.toString()).toArray('be', 32));
    const s = Buffer.from(new BN(sig.s.toString()).toArray('be', 32));
    return Buffer.concat([r, s, Buffer.from([sig.recovery])]);
}

/**
 * Recover the public key from its signature and messahe hash.
 *
 * @throws{InvalidSecp256k1MessageHashError, InvalidSecp256k1SignatureError, InvalidSecp256k1SignatureRecoveryError}
 * @param messageHash hash of message
 * @param sig signature
 */
function recover(messageHash: Buffer, sig: Buffer): Buffer {
    assertIsValidSecp256k1MessageHash(
        'recover',
        messageHash,
        isValidMessageHash
    );

    assert(
        'recover',
        Buffer.isBuffer(sig) && sig.length === SIGNATURE_LENGTH,
        SECP256K1.INVALID_SECP256k1_SIGNATURE,
        'Invalid signature given as input. Length must be exactly 65 bytes.',
        { sig }
    );

    const recovery = sig[64];
    assert(
        'recover',
        recovery === 0 || recovery === 1,
        SECP256K1.INVALID_SECP256k1_SIGNATURE_RECOVERY,
        'Invalid signature recovery value. Signature bytes at position 64 must be 0 or 1.',
        { recovery }
    );

    return Buffer.from(
        _secp256k1.Signature.fromCompact(Uint8Array.from(sig).slice(0, 64))
            .addRecoveryBit(recovery)
            .recoverPublicKey(messageHash)
            .toRawBytes(false)
    );
}

/**
 * Convert extended public key to array public key (compressed or uncompressed)
 *
 * @param extendedPublicKey extended public key.
 * @param compact if public key should be compressed or not.
 * @returns array public key.
 */
// https://bitcoin.stackexchange.com/questions/44024/get-uncompressed-public-key-from-compressed-form
// https://www.secg.org/sec2-v2.pdf
// https://cryptobook.nakov.com/digital-signatures/ecdsa-sign-verify-messages
function extendedPublicKeyToArray(
    extendedPublicKey: Buffer,
    compact: boolean
): number[] {
    console.log('EPKTA:I: ' + Hex.of(extendedPublicKey));
    const keyPair = curve.keyFromPublic(extendedPublicKey);
    console.log('EPKTA:O: ' + keyPair.getPublic(false, 'hex'));
    console.log('EPKTA:C: ' + keyPair.getPublic(true, 'hex'));
    return keyPair.getPublic(compact, 'array');
}

function decompressPublicKey(compressedPublicKey: Uint8Array): Buffer {
    const prefix = compressedPublicKey.slice(0, 1);
    const pub = compressedPublicKey.slice(1);
    const x = BigInt(Hex0x.of(pub));
    const secp256k1P = BigInt(
        '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F'
    );
    const secp256k1A = BigInt('0x0');
    const secp256k1B = BigInt('0x7');

    const ySquare = (x ** 3n + secp256k1A * x + secp256k1B) % secp256k1P;
    const pOverFour = (secp256k1P + 1n) / 4n;
    let y = ySquare ** pOverFour % secp256k1P;

    const isYEven = y % 2n === 0n;
    const isSecondKey = (prefix[0] === 0x03);

    if ((isYEven && isSecondKey) || (!isYEven && !isSecondKey)){
        y = secp256k1P - y;
    }

    const decompressedPub = Buffer.concat([
        Buffer.from([0x04]),
        Buffer.from(x.toString(16).padStart(64, "0"), "hex"),
        Buffer.from(y.toString(16).padStart(64, "0"), "hex")
    ]);

    return decompressedPub;
}

/*
const compressedPublicKey = Buffer.from("02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5", 'hex');
console.log(decompressPublicKey(compressedPublicKey));
 */

function inflate(compressedPublicKey: Uint8Array): Buffer {
    // const prefix = compressedPublicKey[0];
    const x = BigInt(Hex0x.of(compressedPublicKey.slice(1)));
    const y2 =
        (x ** 3n + x * _secp256k1.CURVE.a + _secp256k1.CURVE.b) %
        _secp256k1.CURVE.p;
    // const exp = (_secp256k1.CURVE.p + 1n) / 4n;
    return Buffer.concat([
        Buffer.from([0x04]), // Prefix byte for uncompressed key
        Buffer.from(Hex.of(x)), // X-coordinate
        Buffer.from(Hex.of(y2)) // Y-coordinate
    ]);
}

/**
 * Generates random bytes of specified length.
 *
 * The function relays on [noble-hashes](https://github.com/paulmillr/noble-hashes/blob/main/src/utils.ts)
 * functionality to delegate the OS to generate the random sequence according the host hardware.
 *
 * @param {number} bytesLength - The length of the random bytes to generate.
 * @return {Buffer} - The generated random bytes as a Buffer object.
 * @throws Error with `crypto.getRandomValues must be defined`
 * message if no hardware for random generation is
 * available at runtime.
 */
function randomBytes(bytesLength?: number | undefined): Buffer {
    return Buffer.from(_randomBytes(bytesLength));
}

export const secp256k1 = {
    decompressPublicKey,
    derivePublicKey,
    extendedPublicKeyToArray,
    generatePrivateKey,
    inflate,
    isValidMessageHash,
    isValidPrivateKey,
    recover,
    randomBytes,
    sign
};
