import { type Keystore, type KeystoreAccount } from '../../types';
/**
 * Encrypts a given private key into a keystore format using the specified password.
 *
 * @param privateKey - The private key to be encrypted.
 * @param password - The password used for the encryption.
 * @returns A Promise that resolves to the encrypted keystore.
 */
declare function encrypt(privateKey: Uint8Array, password: string): Promise<Keystore>;
/**
 * Decrypts a keystore to obtain the private key using the given password.
 *
 * @param keystore - The keystore containing the encrypted private key.
 * @param password - The password used to decrypt the keystore.
 * @returns A Promise that resolves to the decrypted KeystoreAccount or rejects if the keystore or password is invalid.
 * @throws {InvalidKeystore, InvalidKeystoreParams}
 */
declare function decrypt(keystore: Keystore, password: string): Promise<KeystoreAccount>;
/**
 * Validates if the provided keystore adheres to the expected format and structure.
 *
 * @param keystore - The keystore to be validated.
 * @returns A boolean indicating whether the keystore is valid or not.
 */
declare function isValid(keystore: Keystore): boolean;
/**
 * Exports the keystore functions for encryption, decryption, and validation.
 */
declare const keystore: {
    encrypt: typeof encrypt;
    decrypt: typeof decrypt;
    isValid: typeof isValid;
};
export { keystore };
//# sourceMappingURL=keystore.d.ts.map