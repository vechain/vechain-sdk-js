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

import { CTR } from 'aes-js';

import {
    assertArgument,
    computeAddress,
    getAddress,
    getBytes,
    getBytesCopy,
    hexlify,
    scryptSync
} from 'ethers';

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
        return encryptKeystore(privateKey, password, {
            scrypt: {
                N: SCRYPT_PARAMS.N,
                r: SCRYPT_PARAMS.r,
                p: SCRYPT_PARAMS.p
            }
        });
    } finally {
        privateKey.fill(0); // Clear the private key from memory.
        password.fill(0); // Clear the password from memory.
    }
}

function encryptKeystore(
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

        'Encryption failed: invalid options.iv length.',
        { iv }
    );
    // Override the uuid.
    const uuidRandom = options.uuid ?? secp256k1.randomBytes(16);
    assert(
        'keystore.encrypt',
        uuidRandom.length === 16,
        KEYSTORE.INVALID_KEYSTORE,
        'Encryption failed: options.uuid length mustbe 16',
        { iv }
    );
    // Message Authentication Code prefix.
    const macPrefix = key.slice(16, 32);
    // Encrypt the private key: 32 bytes for the Web3 Secret Storage (derivedKey, macPrefix)
    const ciphertext = new CTR(key.slice(0, 16), iv).encrypt(privateKey);
    return {
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
            // Compute the message authentication code, used to check the password.
            mac: Hex.of(keccak256(utils.concatBytes(macPrefix, ciphertext)))
        },
        id: uuidV4(uuidRandom),
        version: 3
    } satisfies KeyStore;
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
        'Encryption failed: invalid options.scrypt.N parameter.',
        { options }
    );
    assert(
        'keystore.encrypt',
        r > 0 && Number.isSafeInteger(r),
        KEYSTORE.INVALID_KEYSTORE,
        'Encryption failed: invalid options.scrypt.r parameter.',
        { options }
    );
    assert(
        'keystore.encrypt',
        p > 0 && Number.isSafeInteger(p),
        KEYSTORE.INVALID_KEYSTORE,
        'Encryption failed: invalid options.scrypt.p parameter.',
        { options }
    );
    return { name: 'scrypt', dkLen: 64, salt, N, r, p };
}

/**
 * Decrypts a keystore to obtain the private key using the given password.
 *
 * @throws{InvalidKeystoreError, InvalidKeystorePasswordError}
 * @param keyStore - The keystore containing the encrypted private key.
 * @param password - The password used to decrypt the keystore.
 * @returns A Promise that resolves to the decrypted KeystoreAccount or rejects if the keystore or password is invalid.
 */
function decrypt(keyStore: KeyStore, password: Uint8Array): KeystoreAccount {
    // Invalid keystore
    assert(
        'keystore.decrypt',
        isValid(keyStore),
        KEYSTORE.INVALID_KEYSTORE,
        'Invalid keystore. Ensure the keystore is properly formatted and contains the necessary data.',
        {
            keystore: keyStore
        }
    );
    return decryptKeystore(keyStore, password);
}

/**
 * Decrypts a keystore to obtain the private key using the given password.
 *
 * [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) not supported yet.
 *
 * @param keyStore
 * @param password
 */
function decryptKeystore(
    keyStore: KeyStore,
    password: Uint8Array
): KeystoreAccount {
    const kdf = getDecryptKdfParams(keyStore);
    try {
        const key = scryptSync(
            password,
            kdf.salt,
            kdf.N,
            kdf.r,
            kdf.p,
            kdf.dkLen
        );
        return getAccount(keyStore, key);
    } catch (e) {
        throw buildError(
            'keystore.decrypt',
            KEYSTORE.INVALID_PASSWORD,
            'Decryption failed: invalid password for the given keystore.',
            {
                keystore: keyStore
            },
            e
        );
    }
}

// Version 0.1 x-ethers metadata must contain an encrypted mnemonic phrase
function getAccount(data: KeyStore, _key: string): KeystoreAccount {
    const key = getBytes(_key);
    const ciphertext = spelunk<Uint8Array>(data, 'crypto.ciphertext:data!');
    // const computedMAC = hexlify(
    //     keccak256(concat([key.slice(16, 32), ciphertext]))
    // ).substring(2);

    // assertArgument(
    //       computedMAC ===
    //           spelunk<string>(data, 'crypto.mac:string!').toLowerCase(),
    //       'incorrect password',
    //       'password',
    //       '[ REDACTED ]'
    //   );

    const privateKey = _decrypt(data, key.slice(0, 16), ciphertext);

    const address = computeAddress(privateKey);
    if (data.address !== '') {
        let check = data.address.toLowerCase();
        if (!check.startsWith('0x')) {
            check = '0x' + check;
        }

        assertArgument(
            getAddress(check) === address,
            'keystore address/privateKey mismatch',
            'address',
            data.address
        );
    }

    return {
        address,
        privateKey
    } satisfies KeystoreAccount;
}

/**
 * Retrieves the decryption key-derivation function parameters from the given key store.
 *
 * Only [Scrypt](https://en.wikipedia.org/wiki/Scrypt) is supported as key-derivation function.
 *
 * @param {KeyStore} keyStore - The key store object.
 * @returns {ScryptParams} - The decryption key-derivation function parameters.
 * @throws {InvalidKeystoreError} - if [Scrypt](https://en.wikipedia.org/wiki/Scrypt)
 * is not the key-derivation function required by `keyStore` or if any parameter
 * encoded in the keystore is invalid.
 */
function getDecryptKdfParams(keyStore: KeyStore): ScryptParams {
    if (keyStore.crypto.kdf.toLowerCase() === 'scrypt') {
        const salt = utils.hexToBytes(keyStore.crypto.kdfparams.salt);
        const N = keyStore.crypto.kdfparams.n;
        const r = keyStore.crypto.kdfparams.r;
        const p: number = keyStore.crypto.kdfparams.p;
        // Make sure N is a power of 2
        assert(
            'keystore.decrypt',
            N > 0 && (N & (N - 1)) === 0,
            KEYSTORE.INVALID_KEYSTORE,
            'Decryption failed: invalid  keystore.crypto.kdfparams.n parameter.',
            { keyStore }
        );
        assert(
            'keystore.decrypt',
            r > 0 && p > 0,
            KEYSTORE.INVALID_KEYSTORE,
            'Decryption failed: both keystore.crypto.kdfparams.r or keystore.crypto.kdfparams.p parameter must be > 0.',
            { keyStore }
        );
        const dkLen = keyStore.crypto.kdfparams.dklen;
        assert(
            'keystore.decrypt',
            dkLen === 32,
            KEYSTORE.INVALID_KEYSTORE,
            'Decryption failed: keystore.crypto.kdfparams.dklen parameter must be 32.',
            { keyStore }
        );
        return {
            name: 'scrypt',
            salt,
            N,
            r,
            p,
            dkLen: 64
        } satisfies ScryptParams;
    }
    throw buildError(
        'keystore.decrypt',
        KEYSTORE.INVALID_KEYSTORE,
        'Decryption failed: unsupported key-derivation function.',
        { keyStore }
    );
}

function _decrypt(
    data: unknown,
    key: Uint8Array,
    ciphertext: Uint8Array
): string {
    const cipher = spelunk<string>(data, 'crypto.cipher:string');
    if (cipher === 'aes-128-ctr') {
        const iv = spelunk<Uint8Array>(data, 'crypto.cipherparams.iv:data!');
        const aesCtr = new CTR(key, iv);
        return hexlify(aesCtr.decrypt(ciphertext));
    }
    throw new Error('unsupported cipher');
}

// function getPassword(password: string | Uint8Array): Uint8Array {
//     if (typeof password === 'string') {
//         return toUtf8Bytes(password, 'NFKC');
//     }
//     return getBytesCopy(password);
// }

function looseArrayify(hexString: string): Uint8Array {
    if (typeof hexString === 'string' && !hexString.startsWith('0x')) {
        hexString = '0x' + hexString;
    }
    return getBytesCopy(hexString);
}

function spelunk<T>(object: any, _path: string): T {
    const match = _path.match(/^([a-z0-9$_.-]*)(:([a-z]+))?(!)?$/i);
    assertArgument(match != null, 'invalid path', 'path', _path);

    const path = match[1];
    const type = match[3];
    const reqd = match[4] === '!';

    let cur = object;
    for (const comp of path.toLowerCase().split('.')) {
        // Search for a child object with a case-insensitive matching key
        if (Array.isArray(cur)) {
            if (!comp.match(/^[0-9]+$/)) {
                break;
            }
            cur = cur[parseInt(comp)];
        } else if (typeof cur === 'object') {
            let found: any = null;
            for (const key in cur) {
                if (key.toLowerCase() === comp) {
                    found = cur[key];
                    break;
                }
            }
            cur = found;
        } else {
            cur = null;
        }

        if (cur == null) {
            break;
        }
    }

    assertArgument(
        !reqd || cur != null,
        'missing required value',
        'path',
        path
    );

    if (type && cur != null) {
        if (type === 'int') {
            if (typeof cur === 'string' && cur.match(/^-?[0-9]+$/)) {
                return parseInt(cur) as unknown as T;
            } else if (Number.isSafeInteger(cur)) {
                return cur;
            }
        }

        if (type === 'number') {
            if (typeof cur === 'string' && cur.match(/^-?[0-9.]*$/)) {
                return parseFloat(cur) as unknown as T;
            }
        }

        if (type === 'data') {
            if (typeof cur === 'string') {
                return looseArrayify(cur) as unknown as T;
            }
        }

        if (type === 'array' && Array.isArray(cur)) {
            return cur as unknown as T;
        }
        if (type === typeof cur) {
            return cur;
        }

        assertArgument(false, `wrong type found for ${type} `, 'path', path);
    }

    return cur;
}

// ---

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
