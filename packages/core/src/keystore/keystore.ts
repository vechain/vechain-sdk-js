/**
 * Implements the JSON Keystore v3 Wallet encryption, decryption, and validation functionality.
 */
import { address } from '../address';
import { secp256k1 } from '../secp256k1';
import { ethers } from 'ethers';
import { SCRYPT_PARAMS } from '../utils';
import { type Keystore, type KeystoreAccount } from './types';
import { buildError, KEYSTORE } from '@vechain-sdk/errors';

/**
 * Encrypts a given private key into a keystore format using the specified password.
 *
 * @param privateKey - The private key to be encrypted.
 * @param password - The password used for the encryption.
 * @returns A Promise that resolves to the encrypted keystore.
 */
async function encrypt(
    privateKey: Buffer,
    password: string
): Promise<Keystore> {
    // Public and Address are derived from private key
    const derivePublicKey = secp256k1.derivePublicKey(privateKey);
    const deriveAddress = address.fromPublicKey(derivePublicKey);

    // Create keystore account compatible with ethers
    const keystoreAccount: ethers.KeystoreAccount = {
        address: deriveAddress,
        privateKey: '0x' + privateKey.toString('hex')
    };

    // Scrypt options
    const encryptOptions: ethers.EncryptOptions = {
        scrypt: {
            N: SCRYPT_PARAMS.N,
            r: SCRYPT_PARAMS.r,
            p: SCRYPT_PARAMS.p
        }
    };

    // Stirng version of keystore
    const keystoreJsonString = await ethers.encryptKeystoreJson(
        keystoreAccount,
        password,
        encryptOptions
    );

    return JSON.parse(keystoreJsonString) as Keystore;
}

/**
 * Decrypts a keystore to obtain the private key using the given password.
 *
 * @throws{InvalidKeystoreError, InvalidKeystorePasswordError}
 * @param keystore - The keystore containing the encrypted private key.
 * @param password - The password used to decrypt the keystore.
 * @returns A Promise that resolves to the decrypted KeystoreAccount or rejects if the keystore or password is invalid.
 */
async function decrypt(
    keystore: Keystore,
    password: string
): Promise<KeystoreAccount> {
    // Invalid keystore
    if (!isValid(keystore))
        throw buildError(KEYSTORE.INVALID_KEYSTORE, 'Invalid keystore');

    try {
        return (await ethers.decryptKeystoreJson(
            JSON.stringify(keystore),
            password
        )) as KeystoreAccount;
    } catch (e) {
        throw buildError(KEYSTORE.INVALID_PASSWORD, 'Invalid password');
    }
}

/**
 * Validates if the provided keystore adheres to the expected format and structure.
 *
 * @param keystore - The keystore to be validated.
 * @returns A boolean indicating whether the keystore is valid or not.
 */
function isValid(keystore: Keystore): boolean {
    return ethers.isKeystoreJson(JSON.stringify(keystore));
}

/**
 * Exports the keystore functions for encryption, decryption, and validation.
 */
const keystore = { encrypt, decrypt, isValid };
export { keystore };
