interface EncryptOptions {
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
 * compatible with
 * [ethers ScryptParams](https://github.com/ethers-io/ethers.js/blob/main/src.ts/wallet/json-keystore.ts).
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
 * Keystore type.
 * Output of encryption function.
 */
/**
 * Represents a KeyStore object, which contains encrypted information about a cryptocurrency wallet
 * according [Web3 Secret Storage Definition](https://ethereum.org/en/developers/docs/data-structures-and-encoding/web3-secret-storage/).
 *
 * @interface KeyStore
 * @property {string} address - The address of the cryptocurrency wallet.
 * @property {Object} crypto - The object containing the encrypted data.
 * @property {Cipher} crypto.cipher - The cipher algorithm used for encryption.
 * @property {Object} crypto.cipherparams - The parameters for the cipher algorithm.
 * @property {string} crypto.cipherparams.iv - The IV (Initialization Vector) used for encryption.
 * @property {string} crypto.ciphertext - The encrypted data.
 * @property {string} crypto.kdf - The key derivation function used for encryption.
 * @property {Object} crypto.kdfparams - The parameters for the key derivation function.
 * @property {number} crypto.kdfparams.dklen - The length of the derived key.
 * @property {number} crypto.kdfparams.n - The CPU/memory cost parameter for the key derivation function.
 * @property {number} crypto.kdfparams.p - The parallelization parameter for the key derivation function.
 * @property {number} crypto.kdfparams.r - The block size parameter for the key derivation function.
 * @property {string} crypto.kdfparams.salt - The salt used for the key derivation function.
 * @property {string} crypto.mac - The message authentication code of the encrypted data.
 * @property {string} id - The unique identifier of the KeyStore object.
 * @property {number} version - The version number of the KeyStore object.
 */
interface KeyStore {
    address: string;
    crypto: {
        cipher: string;
        cipherparams: {
            iv: string;
        };
        ciphertext: string;
        kdf: string;
        kdfparams: {
            dklen: number;
            n: number;
            p: number;
            r: number;
            salt: string;
        };
        mac: string;
    };
    id: string;
    version: number;
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
    type EncryptOptions,
    type KeyStore,
    type KeystoreAccount,
    type ScryptParams
};
