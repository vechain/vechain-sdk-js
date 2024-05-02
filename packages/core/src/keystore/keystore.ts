/**
 * Implements the JSON Keystore v3 Wallet encryption, decryption, and validation functionality.
 */
import * as utils from '@noble/curves/abstract/utils';
import { Hex, SCRYPT_PARAMS } from '../utils';
import { addressUtils } from '../address';
import { assert, buildError, KEYSTORE } from '@vechain/sdk-errors';
import { keccak256 } from '../hash';
import { scrypt } from '@noble/hashes/scrypt';
import { secp256k1 } from '../secp256k1';
import {
    type EncryptOptions,
    type KeyStore,
    type KeystoreAccount,
    type ScryptParams
} from './types';

import { ethers } from 'ethers';

import { CTR } from 'aes-js';

/**
 * Encrypts a private key with a password to returns a keystore object
 * compliant with [Web3 Secret Storage Definition](https://ethereum.org/en/developers/docs/data-structures-and-encoding/web3-secret-storage/).
 *
 * @param {Uint8Array} privateKey - The private key to encrypt, the memory location is wiped after use.
 * @param {Uint8Array} password - The password to use for encryption, the memory location is wiped after use.
 *
 * @returns {KeyStore} - The encrypted keystore object.
 *
 * @throws {InvalidSecp256k1PrivateKeyError} - If the private key is invalid.
 * @throws {InvalidKeystoreError} - If an error occurs during encryption.
 */
function encrypt(privateKey: Uint8Array, password: Uint8Array): KeyStore {
    try {
        const keyStore = _encryptKeystoreJson(privateKey, password, {
            scrypt: {
                N: SCRYPT_PARAMS.N,
                r: SCRYPT_PARAMS.r,
                p: SCRYPT_PARAMS.p
            }
        });
        return keyStore;
    } finally {
        privateKey.fill(0); // Clear the private key from memory.
        password.fill(0); // Clear the password from memory.
    }
}

function _encryptKeystoreJson(
    privateKey: Uint8Array,
    password: Uint8Array,
    options: EncryptOptions = {}
): KeyStore {
    // const kdf = getScryptParams(options);
    return _encryptKeystore(privateKey, password, options);
}

function _encryptKeystore(
    privateKey: Uint8Array,
    password: Uint8Array,
    options: EncryptOptions
): KeyStore {
    const kdf = getScryptParams(options);
    const key = scrypt(password, kdf.salt, {
        N: kdf.N,
        r: kdf.r,
        p: kdf.p,
        dkLen: kdf.dkLen
    });
    // Override initialization vector.
    const iv = options.iv ?? secp256k1.randomBytes(16);
    assert(
        'keystore.encrypt',
        iv.length === 16,
        KEYSTORE.INVALID_KEYSTORE,
        'Invalid options.iv length.',
        { iv }
    );
    // Override the uuid.
    const uuidRandom = options.uuid ?? secp256k1.randomBytes(16);
    assert(
        'keystore.encrypt',
        uuidRandom.length === 16,
        KEYSTORE.INVALID_KEYSTORE,
        'Invalid options.uuid length.',
        { iv }
    );
    // This will be used to encrypt the wallet (as per Web3 secret storage).
    // - 32 bytes   As normal for the Web3 secret storage (derivedKey, macPrefix)
    // - 32 bytes   AES key to encrypt mnemonic with (required here to be Ethers Wallet)
    const derivedKey = key.slice(0, 16);
    const macPrefix = key.slice(16, 32);
    // Encrypt the private key
    const aesCtr = new CTR(derivedKey, iv);
    const ciphertext = aesCtr.encrypt(privateKey);

    // Compute the message authentication code, used to check the password
    const mac = keccak256(utils.concatBytes(macPrefix, ciphertext));
    const keyStore: KeyStore = {
        address: Hex.canon(
            addressUtils.fromPublicKey(secp256k1.derivePublicKey(privateKey))
        ),
        crypto: {
            cipher: 'aes-128-ctr',
            cipherparams: {
                iv: Hex.of(iv)
            },
            ciphertext: Hex.of(ciphertext),
            kdf: 'scrypt',
            kdfparams: {
                dklen: 32,
                n: kdf.N,
                p: kdf.p,
                r: kdf.r,
                salt: Hex.of(kdf.salt)
            },
            mac: Hex.of(mac)
        },
        id: uuidV4(uuidRandom),
        version: 3
    };
    return keyStore;
}

function getScryptParams(options: EncryptOptions): ScryptParams {
    // Use or generate the salt.
    const salt = options.salt ?? secp256k1.randomBytes(32);
    // Override the scrypt password-based key derivation function parameters,
    let N = 1 << 17;
    let r = 8;
    let p = 1;
    if (options.scrypt != null) {
        if (options.scrypt.N != null) {
            N = options.scrypt.N;
        }
        if (options.scrypt.r != null) {
            r = options.scrypt.r;
        }
        if (options.scrypt.p != null) {
            p = options.scrypt.p;
        }
    }
    assert(
        'keystore.encrypt',
        N > 0 &&
            Number.isSafeInteger(N) &&
            (BigInt(N) & BigInt(N - 1)) === BigInt(0),
        KEYSTORE.INVALID_KEYSTORE,
        'Invalid options.scrypt.N parameter.',
        { N }
    );
    assert(
        'keystore.encrypt',
        r > 0 && Number.isSafeInteger(r),
        KEYSTORE.INVALID_KEYSTORE,
        'invalid options.scrypt.r parameter.',
        { r }
    );
    assert(
        'keystore.encrypt',
        p > 0 && Number.isSafeInteger(p),
        KEYSTORE.INVALID_KEYSTORE,
        'Invalid options.scrypt.p parameter.',
        { p }
    );
    return { name: 'scrypt', dkLen: 64, salt, N, r, p };
}

/**
 * Decrypts a keystore to obtain the private key using the given password.
 *
 * @throws{InvalidKeystoreError, InvalidKeystorePasswordError}
 * @param keystore - The keystore containing the encrypted private key.
 * @param password - The password used to decrypt the keystore.
 * @returns A Promise that resolves to the decrypted KeystoreAccount or rejects if the keystore or password is invalid.
 */
async function decrypt(
    keystore: KeyStore,
    password: string
): Promise<KeystoreAccount> {
    // Invalid keystore
    assert(
        'keystore.decrypt',
        isValid(keystore),
        KEYSTORE.INVALID_KEYSTORE,
        'Invalid keystore. Ensure the keystore is properly formatted and contains the necessary data.',
        {
            keystore
        }
    );

    try {
        return (await ethers.decryptKeystoreJson(
            JSON.stringify(keystore),
            password
        )) as KeystoreAccount;
    } catch (e) {
        throw buildError(
            'keystore.decrypt',
            KEYSTORE.INVALID_PASSWORD,
            'Decryption failed: Invalid Password for the given keystore.',
            {
                keystore,
                password
            },
            e
        );
    }
}

/**
 * Checks if a given keystore object is valid parsing its JSON representation
 * to catch any parsing errors, only valid keystore having version 3 are accepted.
 *
 * @param {KeyStore} keystore - The keystore object to validate.
 * @return {boolean} Returns true if the keystore is valid, false otherwise.
 */
function isValid(keystore: KeyStore): boolean {
    try {
        const copy = JSON.parse(JSON.stringify(keystore)) as KeyStore;
        if (copy.version === 3) {
            return true;
        }
    } catch (error) {} // Return false if parsing fails.
    return false;
}

function uuidV4(bytes: Uint8Array): string {
    // Section: 4.1.3:
    // - time_hi_and_version[12:16] = 0b0100
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    // Section 4.4
    // - clock_seq_hi_and_reserved[6] = 0b0
    // - clock_seq_hi_and_reserved[7] = 0b1
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const value = Hex.of(bytes);
    return [
        value.substring(0, 8),
        value.substring(8, 12),
        value.substring(12, 16),
        value.substring(16, 20),
        value.substring(20, 32)
    ].join('-');
}

/**
 * Exports the keystore functions for encryption, decryption, and validation.
 */
export const keystore = { decrypt, encrypt, isValid };
