/**
 * Types of ciphers for keystore encryption
 */
type Cipher = 'aes-128-ctr' | 'aes-128-cbc' | 'aes-256-cbc';

/**
 * Scrypt parameters for keystore encryption
 */
interface ScryptParams {
    dklen: number;
    n: number;
    p: number;
    r: number;
    salt: Uint8Array | string;
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
 * Keystore account type
 * Output of decryption function.
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
    type ScryptParams,
    type PBKDF2SHA256Params,
    type Keystore,
    type KeystoreAccount
};
