/**
 * Implements the JSON Keystore v3 Wallet encryption, decryption, and validation functionality.
 */
import * as utils from '@noble/curves/abstract/utils';
import { Hex, Hex0x, SCRYPT_PARAMS } from '../utils';
import { addressUtils } from '../address';
import { assert, buildError, KEYSTORE } from '@vechain/sdk-errors';
import { ctr } from '@noble/ciphers/aes';
import { keccak256 } from '../hash';
import { scrypt } from '@noble/hashes/scrypt';
import { secp256k1 } from '../secp256k1';
import {
    type KeyStore,
    type KeystoreAccount,
    type ScryptParams
} from './types';

/**
 * The cryptographic algorithm used to store the private key in the
 * keystore is the
 * [Advanced Encryption Standard](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
 * 128 bits Counter Mode as defined by
 * [NIST AES Recommendation for Block Cipher Modes of Operation](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation).
 *
 * @constant {string}
 */
const KEYSTORE_CRYPTO_CIPHER = 'aes-128-ctr';

/**
 * The length of the key returned by the
 * [Scrypt](https://en.wikipedia.org/wiki/Scrypt)
 * [Key Derivation Function](https://en.wikipedia.org/wiki/Key_derivation_function)
 * used in the keystore.
 */
const KEYSTORE_CRYPTO_PARAMS_DKLEN = 32;

/**
 * The [Key Derivation Function](https://en.wikipedia.org/wiki/Key_derivation_function)
 * of the keystore is [Scrypt](https://en.wikipedia.org/wiki/Scrypt).
 */
const KEYSTORE_CRYPTO_KDF = 'scrypt';

/**
 * The version number of the
 * [Web3 Secret Storage Definition](https://ethereum.org/en/developers/docs/data-structures-and-encoding/web3-secret-storage)
 * specifications used in keystore.
 *
 * @constant
 * @type {number}
 * @default 3
 */
const KEYSTORE_VERSION = 3;

/**
 * EncryptOptions interface defines the options of the
 * [Scrypt](https://en.wikipedia.org/wiki/Scrypt) algorithm for the
 * [Key Derivation Function](https://en.wikipedia.org/wiki/Key_derivation_function)
 * used in keystore encryption.
 *
 * @property {Uint8Array} iv - Initialization Vector.
 * @property {Uint8Array} salt - Random bytes to protect against [Rainbow table](https://en.wikipedia.org/wiki/Rainbow_table).
 * @property {number} scrypt.N - CPU/memory cost parameter.
 * @property {number} scrypt.p - Parallelization parameter.
 * @property {number} scrypt.r - Blocksize parameter.
 *
 * @see {encodeScryptParams}
 */
interface EncryptOptions {
    iv?: Uint8Array;
    salt?: Uint8Array;
    uuid?: Uint8Array;
    scrypt?: {
        N?: number;
        p?: number;
        r?: number;
    };
}

/**
 * Retrieves the
 * [Key Derivation Function](https://en.wikipedia.org/wiki/Key_derivation_function)
 * parameters from the given keystore.
 *
 * Only [Scrypt](https://en.wikipedia.org/wiki/Scrypt) is supported as key-derivation function.
 * [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) superseded by Scrypt, hence
 * not implemented.
 *
 * @param {KeyStore} keyStore - The key store object.
 * @returns {ScryptParams} - The decryption key-derivation function parameters.
 *
 * @throws {InvalidKeystoreError} - if [Scrypt](https://en.wikipedia.org/wiki/Scrypt)
 * is not the key-derivation function required by `keyStore` or if any parameter
 * encoded in the keystore is invalid.
 *
 * @see {decryptKeystore}
 * @see {encodeScryptParams}
 */
function decodeScryptParams(keyStore: KeyStore): ScryptParams {
    if (keyStore.crypto.kdf.toLowerCase() === KEYSTORE_CRYPTO_KDF) {
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
            dkLen === KEYSTORE_CRYPTO_PARAMS_DKLEN,
            KEYSTORE.INVALID_KEYSTORE,
            `Decryption failed: keystore.crypto.kdfparams.dklen parameter must be ${KEYSTORE_CRYPTO_PARAMS_DKLEN}`,
            { keyStore }
        );
        return {
            N,
            dkLen: KEYSTORE_CRYPTO_PARAMS_DKLEN,
            name: KEYSTORE_CRYPTO_KDF,
            p,
            r,
            salt
        } satisfies ScryptParams;
    }
    throw buildError(
        'keystore.decrypt',
        KEYSTORE.INVALID_KEYSTORE,
        'Decryption failed: unsupported key-derivation function.',
        { keyStore }
    );
}

/**
 * Encodes the parameters of the
 * [Scrypt](https://en.wikipedia.org/wiki/Scrypt) algorithm of the
 * [Key Derivation Function](https://en.wikipedia.org/wiki/Key_derivation_function)
 * used in the keystore encryption.
 *
 * @param {EncryptOptions} options - The encryption options used to override
 * the default Scrypt parameters:
 * - N: CPU/memory cost = 131072.
 * - p: Parallelization parameter = 1,
 * - r: Blocksize parameter = 8.
 *
 * @returns {ScryptParams} - The encoded scrypt parameters.
 *
 * @throws {InvalidKeystoreError} if any parameter value is invalid.
 *
 * @see {decodeScryptParams}
 * @see {encryptKeystore}
 */
function encodeScryptParams(options: EncryptOptions): ScryptParams {
    // Use or generate the salt.
    const salt =
        options.salt ?? secp256k1.randomBytes(KEYSTORE_CRYPTO_PARAMS_DKLEN);
    // Override the scrypt password-based key derivation function parameters,
    let N = 1 << 17;
    let p = 1;
    let r = 8;
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
 * Encrypts a private key with a password to returns a keystore object
 * compliant with [Web3 Secret Storage Definition](https://ethereum.org/en/developers/docs/data-structures-and-encoding/web3-secret-storage/)
 * version 3.
 *
 * The private key is encoded using the
 * [Advanced Encryption Standard](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
 * 128 bits Counter Mode as defined by
 * [NIST AES Recommendation for Block Cipher Modes of Operation](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation).
 *
 * The [Key Derivation Function](https://en.wikipedia.org/wiki/Key_derivation_function)
 * algorithm is [Scrypt](https://en.wikipedia.org/wiki/Scrypt).
 *
 * Secure audit function.
 * - {@link encryptKeystore}.
 * - password wiped after use.
 * - privateKey: wiped after use.
 *
 * @param {Uint8Array} privateKey - The private key to encrypt, the memory location is wiped after use.
 * @param {Uint8Array} password - The password to use for encryption, the memory location is wiped after use.
 *
 * @returns {KeyStore} - The encrypted keystore object.
 *
 * @throws {InvalidSecp256k1PrivateKeyError} - If the private key is invalid.
 * @throws {InvalidKeystoreError} - If an error occurs during encryption.
 *
 * @see {@link encryptKeystore}
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
    const kdf = encodeScryptParams(options);
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
        'Encryption failed: options.uuid length must be 16',
        { iv }
    );
    // Message Authentication Code prefix.
    const macPrefix = key.slice(16, 32);
    // Encrypt the private key: 32 bytes for the Web3 Secret Storage (derivedKey, macPrefix)
    const ciphertext = ctr(key.slice(0, 16), iv).encrypt(privateKey);
    return {
        address: Hex.canon(
            addressUtils.fromPublicKey(secp256k1.derivePublicKey(privateKey))
        ),
        crypto: {
            cipher: KEYSTORE_CRYPTO_CIPHER,
            cipherparams: {
                iv: Hex.of(iv)
            },
            ciphertext: Hex.of(ciphertext),
            kdf: 'scrypt',
            kdfparams: {
                dklen: KEYSTORE_CRYPTO_PARAMS_DKLEN,
                n: kdf.N,
                p: kdf.p,
                r: kdf.r,
                salt: Hex.of(kdf.salt)
            },
            // Compute the message authentication code, used to check the password.
            mac: Hex.of(keccak256(utils.concatBytes(macPrefix, ciphertext)))
        },
        id: uuidV4(uuidRandom),
        version: KEYSTORE_VERSION
    } satisfies KeyStore;
}

function decrypt(keyStore: KeyStore, password: Uint8Array): KeystoreAccount {
    // Check for invalid keystore.
    assert(
        'keystore.decrypt',
        isValid(keyStore),
        KEYSTORE.INVALID_KEYSTORE,
        'Invalid keystore. Ensure the keystore is properly formatted and contains the necessary data.',
        { keyStore }
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
// Version 0.1 x-ethers metadata must contain an encrypted mnemonic phrase
function decryptKeystore(
    keyStore: KeyStore,
    password: Uint8Array
): KeystoreAccount {
    assert(
        'keystore.decrypt',
        keyStore.crypto.cipher.toLowerCase() === KEYSTORE_CRYPTO_CIPHER,
        KEYSTORE.INVALID_KEYSTORE,
        'Decryption failed: unsupported cipher.',
        { keyStore }
    );
    const kdf = decodeScryptParams(keyStore);
    const key = scrypt(password, kdf.salt, {
        N: kdf.N,
        r: kdf.r,
        p: kdf.p,
        dkLen: kdf.dkLen
    });
    const ciphertext = utils.hexToBytes(keyStore.crypto.ciphertext);
    assert(
        'keystore.decrypt',
        keyStore.crypto.mac ===
            Hex.of(keccak256(utils.concatBytes(key.slice(16, 32), ciphertext))),
        KEYSTORE.INVALID_PASSWORD,
        'Decryption failed: invalid password for the given keystore.'
    );
    const privateKey = ctr(
        key.slice(0, 16),
        utils.hexToBytes(keyStore.crypto.cipherparams.iv)
    ).decrypt(ciphertext);
    const address = addressUtils.fromPrivateKey(privateKey);
    if (keyStore.address !== '') {
        assert(
            'keystore.decrypt',
            address ===
                addressUtils.toERC55Checksum(Hex0x.canon(keyStore.address)),
            KEYSTORE.INVALID_KEYSTORE,
            'Decryption failed: address/password mismatch.',
            { keyStore }
        );
    }
    return {
        address,
        privateKey: Hex0x.of(privateKey)
    } satisfies KeystoreAccount;
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
        if (copy.version === KEYSTORE_VERSION) {
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
