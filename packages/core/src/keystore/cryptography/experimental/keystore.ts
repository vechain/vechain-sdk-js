/**
 * Implements the
 * [JSON Keystore v3 Wallet](https://ethereum.org/en/developers/docs/data-structures-and-encoding/web3-secret-storage)
 * encryption, decryption, and validation functionality.
 */
import * as n_utils from '@noble/curves/abstract/utils';
import { Address, Hex } from '../../../vcdm';
import { InvalidKeystoreParams, stringifyData } from '@vechain/sdk-errors';
import { Keccak256 } from '../../../vcdm/hash/Keccak256';
import { Secp256k1 } from '../../../secp256k1';
import { ctr } from '@noble/ciphers/aes';
import { scrypt } from '@noble/hashes/scrypt';
import { type Keystore, type KeystoreAccount } from '../../types';

/**
 * The cryptographic algorithm used to store the private key in the
 * keystore is the
 * [Advanced Encryption Standard](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
 * [128 bits Counter Mode](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation)
 * as defined by
 * [NIST AES Recommendation for Block Cipher Modes of Operation](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38a.pdf).
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
 */
const KEYSTORE_VERSION = 3;

/**
 * The [Scrypt](https://en.wikipedia.org/wiki/Scrypt) parameters
 * used in the keystore encryption.
 *
 * @property {number} N - The CPU/memory cost parameter = 2^17 = 131072.
 * @property {number} r - The block size parameter = 8.
 * @property {number} p - The parallelization parameter = 1.
 */
const SCRYPT_PARAMS = {
    N: 131072,
    r: 8,
    p: 1
};

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
 * @property {number} scrypt.r - Block size parameter.
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
 * ScryptParams interfaces defines the parameters of the
 * [Scrypt](https://en.wikipedia.org/wiki/Scrypt) algorithm for the
 * [Key Derivation Function](https://en.wikipedia.org/wiki/Key_derivation_function)
 * used in keystore encryption.
 *
 * Compatible with
 * [ethers ScryptParams](https://github.com/ethers-io/ethers.js/blob/main/src.ts/wallet/json-keystore.ts).
 *
 * @property {number} N - CPU/memory cost parameter.
 * @property {number} dkLen - Derived key length in bytes.
 * @property {string} name - constant "scrypt".
 * @property {number} p - Parallelization parameter.
 * @property {number} r - Block size parameter.
 * @property {Uint8Array} salt - Random bytes to protect against [Rainbow table](https://en.wikipedia.org/wiki/Rainbow_table).
 */
interface ScryptParams {
    N: number;
    dkLen: number;
    name: string;
    p: number;
    r: number;
    salt: Uint8Array;
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
 * @param {Keystore} keystore - The key store object.
 * @returns {ScryptParams} - The decryption key-derivation function parameters.
 * @throws {InvalidKeystoreParams}
 *
 * @see {decryptKeystore}
 * @see {encodeScryptParams}
 */
function decodeScryptParams(keystore: Keystore): ScryptParams {
    const salt = n_utils.hexToBytes(keystore.crypto.kdfparams.salt);
    const N = keystore.crypto.kdfparams.n;
    const r = keystore.crypto.kdfparams.r;
    const p: number = keystore.crypto.kdfparams.p;
    // Make sure N is a power of 2
    if (N <= 0 || (N & (N - 1)) !== 0)
        throw new InvalidKeystoreParams(
            '(EXPERIMENTAL) keystore.decodeScryptParams()',
            'Decryption failed: invalid  keystore.crypto.kdfparams.n parameter.',
            {
                keystore,
                N
            }
        );

    // Make sure r and p are positive
    if (r <= 0 || p <= 0)
        throw new InvalidKeystoreParams(
            '(EXPERIMENTAL) keystore.decodeScryptParams()',
            'Decryption failed: both keystore.crypto.kdfparams.r or keystore.crypto.kdfparams.p parameter must be > 0.',
            {
                keystore,
                r,
                p
            }
        );
    const dkLen = keystore.crypto.kdfparams.dklen;

    if (dkLen !== KEYSTORE_CRYPTO_PARAMS_DKLEN)
        throw new InvalidKeystoreParams(
            '(EXPERIMENTAL) keystore.decodeScryptParams()',
            `Decryption failed: keystore.crypto.kdfparams.dklen parameter must be ${KEYSTORE_CRYPTO_PARAMS_DKLEN}`,
            {
                keystore,
                dkLen
            }
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

/**
 * Encodes the parameters of the
 * [Scrypt](https://en.wikipedia.org/wiki/Scrypt) algorithm of the
 * [Key Derivation Function](https://en.wikipedia.org/wiki/Key_derivation_function)
 * used in the keystore encryption.
 *
 * @param {EncryptOptions} options - The encryption options used to override
 * the default Scrypt parameters:
 * - N: CPU/memory cost,
 * - p: Parallelization parameter,
 * - r: Block size parameter.
 * @returns {ScryptParams} - The encoded scrypt parameters.
 * @throws {InvalidKeystoreParams}
 *
 * @see {decodeScryptParams}
 * @see {encryptKeystore}
 */
function encodeScryptParams(options: EncryptOptions): ScryptParams {
    // Use or generate the salt.
    const salt =
        options.salt ?? Secp256k1.randomBytes(KEYSTORE_CRYPTO_PARAMS_DKLEN);
    // Override the scrypt password-based key derivation function parameters,
    let N = SCRYPT_PARAMS.N;
    let r = SCRYPT_PARAMS.r;
    let p = SCRYPT_PARAMS.p;
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

    if (N <= 0 || (BigInt(N) & BigInt(N - 1)) !== BigInt(0))
        throw new InvalidKeystoreParams(
            '(EXPERIMENTAL) keystore.encodeScryptParams()',
            'Encryption failed: invalid options.scrypt.N parameter.',
            {
                options,
                N
            }
        );

    if (r <= 0 || !Number.isSafeInteger(r))
        throw new InvalidKeystoreParams(
            '(EXPERIMENTAL) keystore.encodeScryptParams()',
            'Encryption failed: invalid options.scrypt.r parameter.',
            {
                options,
                r
            }
        );

    if (p <= 0 || !Number.isSafeInteger(p))
        throw new InvalidKeystoreParams(
            '(EXPERIMENTAL) keystore.encodeScryptParams()',
            'Encryption failed: invalid options.scrypt.p parameter.',
            {
                options,
                p
            }
        );

    return {
        name: KEYSTORE_CRYPTO_KDF,
        dkLen: KEYSTORE_CRYPTO_PARAMS_DKLEN,
        N,
        p,
        r,
        salt
    } satisfies ScryptParams;
}

/**
 * Encrypts a private key with a password to returns a keystore object
 * compliant with [Web3 Secret Storage Definition](https://ethereum.org/en/developers/docs/data-structures-and-encoding/web3-secret-storage/)
 * version 3.
 *
 * The private key is encoded using the
 * [Advanced Encryption Standard](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
 * [128 bits Counter Mode](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation)
 * as defined by
 * [NIST AES Recommendation for Block Cipher Modes of Operation](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38a.pdf).
 *
 * The [Key Derivation Function](https://en.wikipedia.org/wiki/Key_derivation_function)
 * algorithm is [Scrypt](https://en.wikipedia.org/wiki/Scrypt).
 *
 * Secure audit function.
 * - {@link encryptKeystore}.
 * - `password` wiped after use.
 * - `privateKey` wiped after use.
 *
 * @param {Uint8Array} privateKey - The private key to encrypt, the memory location is wiped after use.
 * @param {Uint8Array} password - The password to use for encryption, the memory location is wiped after use.
 * @returns {Keystore} - The encrypted keystore object.
 * @throws {InvalidKeystoreParams}
 *
 * @see {encryptKeystore}
 *
 * @remarks **The private key must not be represented as string to avoid the
 * [Memory Dumping](https://github.com/paulmillr/noble-hashes?tab=readme-ov-file#memory-dumping)
 * attack**.
 */
function encrypt(privateKey: Uint8Array, password: Uint8Array): Keystore {
    return encryptKeystore(privateKey, password, {
        scrypt: {
            N: SCRYPT_PARAMS.N,
            r: SCRYPT_PARAMS.r,
            p: SCRYPT_PARAMS.p
        }
    });
}

/**
 * Encrypts a private key with a password to returns a keystore object compliant with
 * [Web3 Secret Storage Definition](https://ethereum.org/en/developers/docs/data-structures-and-encoding/web3-secret-storage/)
 * version {@link KEYSTORE_VERSION}.
 *
 * The private key is encoded using the
 * [Advanced Encryption Standard](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
 * [128 bits Counter Mode](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation)
 * as defined by
 * [NIST AES Recommendation for Block Cipher Modes of Operation](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38a.pdf).
 *
 * The [Key Derivation Function](https://en.wikipedia.org/wiki/Key_derivation_function)
 * algorithm is [Scrypt](https://en.wikipedia.org/wiki/Scrypt).
 *
 * Secure audit function.
 * - [ctr](https://github.com/paulmillr/noble-ciphers?tab=readme-ov-file#aes).
 * - {@link Keccak256.of}
 * - `password` wiped after use.
 * - `privateKey` wiped after use.
 * - {@link Secp256k1.derivePublicKey}.
 * - {@link Secp256k1.randomBytes}.
 * - [scrypt](https://github.com/paulmillr/noble-hashes/?tab=readme-ov-file#scrypt).
 *
 * @param privateKey - The private key to encrypt, the memory location is wiped after use.
 * @param password - The password to use for encryption, the memory location is wiped after use.
 * @param options - Parameters used to configure the **AES** encryption of the private key and the **Scrypt** derivation key function.
 * @returns {Keystore} - The encrypted keystore object.
 * @throws {InvalidKeystoreParams}
 *
 * @remarks **The private key must not be represented as string to avoid the
 * [Memory Dumping](https://github.com/paulmillr/noble-hashes?tab=readme-ov-file#memory-dumping)
 * attack**.
 *
 * @see {encrypt}
 * @see {uuidV4}
 */
function encryptKeystore(
    privateKey: Uint8Array,
    password: Uint8Array,
    options: EncryptOptions
): Keystore {
    try {
        const kdf = encodeScryptParams(options);
        const key = scrypt(password, kdf.salt, {
            N: kdf.N,
            r: kdf.r,
            p: kdf.p,
            dkLen: kdf.dkLen
        });
        // Override initialization vector.
        const iv = options.iv ?? Secp256k1.randomBytes(16);
        if (iv.length !== 16)
            throw new InvalidKeystoreParams(
                '(EXPERIMENTAL) keystore.encryptKeystore()',
                'Encryption failed: invalid options.iv length.',
                { iv }
            );

        // Override the uuid.
        const uuidRandom = options.uuid ?? Secp256k1.randomBytes(16);

        if (uuidRandom.length !== 16)
            throw new InvalidKeystoreParams(
                '(EXPERIMENTAL) keystore.encryptKeystore()',
                'Encryption failed: invalid options.uuid length.',
                { uuidRandom }
            );

        // Message Authentication Code prefix.
        const macPrefix = key.slice(16, 32);
        // Encrypt the private key: 32 bytes for the Web3 Secret Storage (derivedKey, macPrefix)
        const ciphertext = ctr(key.slice(0, 16), iv).encrypt(privateKey);
        return {
            address: Address.ofPrivateKey(privateKey).toString(),
            crypto: {
                cipher: KEYSTORE_CRYPTO_CIPHER,
                cipherparams: {
                    iv: Hex.of(iv).digits
                },
                ciphertext: Hex.of(ciphertext).digits,
                kdf: 'scrypt',
                kdfparams: {
                    dklen: KEYSTORE_CRYPTO_PARAMS_DKLEN,
                    n: kdf.N,
                    p: kdf.p,
                    r: kdf.r,
                    salt: Hex.of(kdf.salt).digits
                },
                // Compute the message authentication code, used to check the password.
                mac: Keccak256.of(n_utils.concatBytes(macPrefix, ciphertext))
                    .digits
            },
            id: uuidV4(uuidRandom),
            version: KEYSTORE_VERSION
        } satisfies Keystore;
    } finally {
        privateKey.fill(0); // Clear the private key from memory.
        password.fill(0); // Clear the password from memory.
    }
}

/**
 * Decrypts a keystore compliant with
 * [Web3 Secret Storage Definition](https://ethereum.org/en/developers/docs/data-structures-and-encoding/web3-secret-storage/)
 * version 3, using the given password to obtain the private key and wallet address.
 *
 * **WARNING:** call
 * ```javascript
 * privateKey.fill(0)
 * ```
 * after use to avoid to invalidate any security audit and certification granted to this code.
 *
 * The private key should be encoded using the
 * [Advanced Encryption Standard](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
 * [128 bits Counter Mode](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation)
 * as defined by
 * [NIST AES Recommendation for Block Cipher Modes of Operation](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38a.pdf),
 * any different encryption not supported.
 *
 * The [Key Derivation Function](https://en.wikipedia.org/wiki/Key_derivation_function)
 * algorithm should be [Scrypt](https://en.wikipedia.org/wiki/Scrypt),
 * any different KDF function not supported.
 *
 * Secure audit function.
 * - {@link decryptKeystore}
 *
 * @param {Keystore} keystore - The keystore object to decrypt.
 * @param {Uint8Array} password - The password used for decryption, wiped after use.
 * @return {KeystoreAccount} - The decrypted keystore account object.
 *
 * @see {decryptKeystore}
 * @see {isValid}
 */
function decrypt(keystore: Keystore, password: Uint8Array): KeystoreAccount {
    return decryptKeystore(keystore, password);
}

/**
 * Decrypts a keystore compliant with
 * [Web3 Secret Storage Definition](https://ethereum.org/en/developers/docs/data-structures-and-encoding/web3-secret-storage/)
 * using the given password to obtain the private key and wallet address.
 *
 * **WARNING:** call
 * ```javascript
 * privateKey.fill(0)
 * ```
 * after use to avoid to invalidate any security audit and certification granted to this code.
 *
 * The private key should be encoded using the
 * [Advanced Encryption Standard](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
 * [128 bits Counter Mode](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation)
 * as defined by
 * [NIST AES Recommendation for Block Cipher Modes of Operation](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38a.pdf),
 * any different encryption not supported.
 *
 * The [Key Derivation Function](https://en.wikipedia.org/wiki/Key_derivation_function)
 * algorithm should be [Scrypt](https://en.wikipedia.org/wiki/Scrypt),
 * any different KDF function not supported.
 *
 * Secure audit function.
 * - {@link Address.ofPrivateKey}
 * - [ctr](https://github.com/paulmillr/noble-ciphers?tab=readme-ov-file#aes).
 * - `password` wiped after use.
 * - [scrypt](https://github.com/paulmillr/noble-hashes/?tab=readme-ov-file#scrypt).
 *
 * @param {Keystore} keystore - The keystore object to decrypt.
 * @param {Uint8Array} password - The password used for decryption, wiped after use.
 * @return {KeystoreAccount} - The decrypted keystore account object.
 * @throws {InvalidKeystoreParams}
 *
 * @see {decodeScryptParams}
 * @see {decrypt}
 */
function decryptKeystore(
    keystore: Keystore,
    password: Uint8Array
): KeystoreAccount {
    try {
        if (keystore.crypto.cipher.toLowerCase() !== KEYSTORE_CRYPTO_CIPHER)
            throw new InvalidKeystoreParams(
                '(EXPERIMENTAL) keystore.decryptKeystore()',
                'Decryption failed: unsupported crypto cipher algorithm.',
                { cipher: keystore.crypto.cipher.toLowerCase() }
            );

        if (keystore.crypto.kdf.toLowerCase() !== KEYSTORE_CRYPTO_KDF)
            throw new InvalidKeystoreParams(
                '(EXPERIMENTAL) keystore.decryptKeystore()',
                'Decryption failed: unsupported crypto key derivation function.',
                { keyDerivationFunction: keystore.crypto.kdf.toLowerCase() }
            );

        if (keystore.version !== KEYSTORE_VERSION)
            throw new InvalidKeystoreParams(
                '(EXPERIMENTAL) keystore.decryptKeystore()',
                'Decryption failed: unsupported keystore version.',
                { version: keystore.version }
            );

        const kdf = decodeScryptParams(keystore);
        const key = scrypt(password, kdf.salt, {
            N: kdf.N,
            r: kdf.r,
            p: kdf.p,
            dkLen: kdf.dkLen
        });
        const ciphertext = n_utils.hexToBytes(keystore.crypto.ciphertext);
        if (
            keystore.crypto.mac !==
            Keccak256.of(n_utils.concatBytes(key.slice(16, 32), ciphertext))
                .digits
        ) {
            throw new InvalidKeystoreParams(
                '(EXPERIMENTAL) keystore.decryptKeystore()',
                'Decryption failed: Invalid Password for the given keystore.',
                // @NOTE: We are not exposing the password in the error data for security reasons.
                {
                    keystore
                }
            );
        }
        const privateKey = ctr(
            key.slice(0, 16),
            n_utils.hexToBytes(keystore.crypto.cipherparams.iv)
        ).decrypt(ciphertext);
        const address = Address.ofPrivateKey(privateKey).toString();
        if (
            keystore.address !== '' &&
            address !== Address.checksum(Hex.of(keystore.address))
        ) {
            throw new InvalidKeystoreParams(
                '(EXPERIMENTAL) keystore.decryptKeystore()',
                'Decryption failed: address/password mismatch.',
                { keystoreAddress: keystore.address }
            );
        }
        return {
            address,
            // @note: Convert the private key to a string to be compatible with ethers
            privateKey: Hex.of(privateKey).toString()
        } satisfies KeystoreAccount;
    } finally {
        password.fill(0); // Clear the password from memory.
    }
}

/**
 * Checks if a given keystore object is valid parsing its JSON representation
 * to catch any parsing errors, only valid
 * [Web3 Secret Storage Definition](https://ethereum.org/en/developers/docs/data-structures-and-encoding/web3-secret-storage/)
 * version 3 keystore are accepted, using
 * [Advanced Encryption Standard](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
 * [128 bits Counter Mode](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation)
 * to encrypt the private key and using
 * [Scrypt](https://en.wikipedia.org/wiki/Scrypt) as
 * [Key Derivation Function](https://en.wikipedia.org/wiki/Key_derivation_function).
 *
 * @param {Keystore} keystore - The keystore object to validate.
 * @return {boolean} Returns true if the keystore is valid, false otherwise.
 */
function isValid(keystore: Keystore): boolean {
    try {
        const copy = JSON.parse(stringifyData(keystore)) as Keystore;
        if (
            copy.crypto.cipher.toLowerCase() === KEYSTORE_CRYPTO_CIPHER &&
            copy.crypto.kdf.toLowerCase() === KEYSTORE_CRYPTO_KDF &&
            copy.version === KEYSTORE_VERSION
        ) {
            return true;
        }
    } catch (error) {} // Return false if parsing fails.
    return false;
}

/**
 * Generates a version 4
 * [UUID (Universally Unique Identifier)](https://en.wikipedia.org/wiki/Universally_unique_identifier)
 * based on the given bytes.
 *
 * @param {Uint8Array} bytes - The byte array used to generate the UUID.
 * @returns {string} The generated UUID.
 */
function uuidV4(bytes: Uint8Array): string {
    // Section: 4.1.3:
    // - time_hi_and_version[12:16] = 0b0100
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    // Section 4.4
    // - clock_seq_hi_and_reserved[6] = 0b0
    // - clock_seq_hi_and_reserved[7] = 0b1
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const value = Hex.of(bytes).digits;
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
