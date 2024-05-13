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

/**
 * @interface KeyStore
 * Represents a
 * [Web3 Secret Storage](https://ethereum.org/en/developers/docs/data-structures-and-encoding/web3-secret-storage)
 * keystore object that holds information about a private cryptographic key.
 * and its associated wallet address.
 *
 * @property {string} address - The wallet address associated with the stored private key.
 * @property {Object} crypto - The encryption information for the key.
 * @property {string} crypto.cipher - The encryption algorithm used.
 * @property {Object} crypto.cipherparams - Additional parameters for the encryption algorithm.
 * @property {string} crypto.cipherparams.iv - The initialization vector (IV) used for encryption.
 * @property {string} crypto.ciphertext - The encrypted private key.
 * @property {string} crypto.kdf - The key derivation function (KDF) used.
 * @property {Object} crypto.kdfparams - Additional parameters for the KDF.
 * @property {number} crypto.kdfparams.dklen - The derived private key length.
 * @property {number} crypto.kdfparams.n - The CPU/memory cost parameter for the key derivation function.
 * @property {number} crypto.kdfparams.p - The parallelization factor.
 * @property {number} crypto.kdfparams.r - The block size factor.
 * @property {string} crypto.kdfparams.salt - The salt value used in the KDF.
 * @property {string} crypto.mac - The MAC (Message Authentication Code)
 * to match the KDF function with the private key derived by the cyphered text stored.
 * @property {string} id - The
 * [unique identifier version 4](https://en.wikipedia.org/wiki/Universally_unique_identifier)
 * for the key store.
 * @property {number} version - The version number of the key store.
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
 * Interface representing a keystore account.
 *
 * **WARNING:** call
 * ```javascript
 * privateKey.fill(0)
 * ```
 * after use to avoid to invalidate any security audit and certification granted to this code.
 *
 * @property {string} address - The address associated with the account.
 * @property {Uint8Array} privateKey - The private key associated with the account.
 *
 * @remark **Differently from
 * [ethers KeystoreAccount](https://github.com/ethers-io/ethers.js/blob/main/src.ts/wallet/json-keystore.ts),
 * this type represents the private key as a buffer of bytes to avoid
 * [Memory Dumping](https://github.com/paulmillr/noble-hashes?tab=readme-ov-file#memory-dumping)
 * attack.**
 */
interface KeystoreAccount {
    address: string;
    privateKey: Uint8Array;
}

export { type KeyStore, type KeystoreAccount };
