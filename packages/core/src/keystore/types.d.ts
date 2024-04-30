import type { ProgressCallback } from 'ethers/src.ts/crypto';
import type { BytesLike } from 'ethers/src.ts/utils';

/**
 * Represents a cipher algorithm supported by the keystore encryption.
 *
 * @typedef {('aes-128-ctr' | 'aes-128-cbc' | 'aes-256-cbc')} Cipher
 */
type Cipher = 'aes-128-ctr' | 'aes-128-cbc' | 'aes-256-cbc';

/**
 * Represents options for keystore encryption,
 * compatible with [ethers EncryptOptions](https://github.com/ethers-io/ethers.js/blob/main/src.ts/wallet/json-keystore.ts).
 *
 * @typedef {Object} EncryptOptions
 * @property {ProgressCallback} [progressCallback] - A callback function to track the encryption progress.
 * @property {BytesLike} [iv] - The initialization vector used for encryption.
 * @property {BytesLike} [entropy] - The entropy used for generating the encryption key.
 * @property {string} [client] - The client identifier.
 * @property {BytesLike} [salt] - The salt value used for key derivation.
 * @property {string} [uuid] - The UUID identifier.
 * @property {Object} [scrypt] - The parameters for scrypt key derivation function.
 * @property {number} [scrypt.N] - The CPU/memory cost parameter (N).
 * @property {number} [scrypt.r] - The block size parameter (r).
 * @property {number} [scrypt.p] - The parallelization parameter (p).
 */
interface EncryptOptions {
    progressCallback?: ProgressCallback;
    iv?: BytesLike;
    entropy?: BytesLike;
    client?: string;
    salt?: Uint8Array;
    uuid?: string;
    scrypt?: {
        N?: number;
        r?: number;
        p?: number;
    };
}

/**
 * Scrypt parameters for keystore encryption,
 * compatible with [ethers ScryptParams](https://github.com/ethers-io/ethers.js/blob/main/src.ts/wallet/json-keystore.ts).
 */
interface ScryptParams {
    N: number;
    dkLen: number;
    name: 'scrypt';
    p: number;
    r: number;
    salt: Uint8Array;
}

/**
 * PBKDF2SHA256 parameters for keystore encryption
 */
interface PBKDF2SHA256Params {
    c: number;
    dklen: number;
    prf: 'hmac-sha256';
    salt: Uint8Array | string;
}

/**
 * Keystore type.
 * Output of encryption function.
 */
interface Keystore {
    crypto: {
        cipher: Cipher;
        ciphertext: string;
        cipherparams: {
            iv: string;
        };
        kdf: 'pbkdf2' | 'scrypt';
        kdfparams: ScryptParams | PBKDF2SHA256Params;
        mac: string;
    };
    id: string;
    version: 3;
    address: string;
}

/**
 * Interface representing a keystore account,
 * compatible with [ethers KeystoreAccount](https://github.com/ethers-io/ethers.js/blob/main/src.ts/wallet/json-keystore.ts).
 *
 * @interface
 * @property {string} address - The address associated with the account.
 * @property {string} privateKey - The private key associated with the account.
 * @property {Object} mnemonic - The mnemonic (optional) associated with the account.
 * @property {string} mnemonic.path - The path (optional) of the mnemonic.
 * @property {string} mnemonic.locale - The locale (optional) of the mnemonic.
 * @property {string} mnemonic.entropy - The entropy of the mnemonic.
 */
interface KeystoreAccount {
    address: string;
    privateKey: string;
    mnemonic?: {
        path?: string;
        locale?: string;
        entropy: string;
    };
}

export {
    type Cipher,
    type EncryptOptions,
    type ScryptParams,
    type PBKDF2SHA256Params,
    type Keystore,
    type KeystoreAccount
};
