import type { ProgressCallback } from 'ethers/src.ts/crypto';
/**
 * Represents a cipher algorithm supported by the keystore encryption.
 *
 * @typedef {('aes-128-ctr' | 'aes-128-cbc' | 'aes-256-cbc')} Cipher
 */
type Cipher = 'aes-128-ctr' | 'aes-128-cbc' | 'aes-256-cbc';

interface EncryptOptions {
    progressCallback?: ProgressCallback;
    iv?: Uint8Array;
    entropy?: Uint8Array;
    client?: string;
    salt?: Uint8Array;
    uuid?: Uint8Array;
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
 * Keystore type.
 * Output of encryption function.
 */
interface KeyStore {
    address: string;
    crypto: {
        cipher: Cipher;
        cipherparams: {
            iv: string;
        };
        ciphertext: string;
        kdf: 'pbkdf2' | 'scrypt';
        kdfparams: ScryptParams;
        mac: string;
    };
    id: string;
    version: 3;
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
    type KeyStore,
    type KeystoreAccount,
    type ScryptParams
};
