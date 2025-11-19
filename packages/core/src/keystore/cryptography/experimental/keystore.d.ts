import { type Keystore, type KeystoreAccount } from '../../types';
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
declare function encrypt(privateKey: Uint8Array, password: Uint8Array): Keystore;
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
declare function decrypt(keystore: Keystore, password: Uint8Array): KeystoreAccount;
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
declare function isValid(keystore: Keystore): boolean;
/**
 * Exports the keystore functions for encryption, decryption, and validation.
 */
export declare const keystore: {
    decrypt: typeof decrypt;
    encrypt: typeof encrypt;
    isValid: typeof isValid;
};
export {};
//# sourceMappingURL=keystore.d.ts.map