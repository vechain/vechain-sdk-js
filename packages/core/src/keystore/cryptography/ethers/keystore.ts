/**
 * Implements the JSON Keystore v3 Wallet encryption, decryption, and validation functionality.
 */
import { Address } from '../../../vcdm';
import { ethers } from 'ethers';
import { Hex } from '../../../vcdm/Hex';
import { SCRYPT_PARAMS } from './const';
import { Secp256k1 } from '../../../secp256k1';
import {
    InvalidKeystore,
    InvalidKeystoreParams,
    stringifyData
} from '@vechain/sdk-errors';
import { type Keystore, type KeystoreAccount } from '../../types';

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
    // Public and Address are derived from a private key
    const derivePublicKey = Secp256k1.derivePublicKey(privateKey);
    const deriveAddress = Address.ofPublicKey(
        Buffer.from(derivePublicKey)
    ).toString();

    // Create keystore account compatible with ethers
    const keystoreAccount: ethers.KeystoreAccount = {
        address: deriveAddress,
        privateKey: Hex.of(privateKey).toString()
    };

    // Scrypt options
    const encryptOptions: ethers.EncryptOptions = {
        scrypt: {
            N: SCRYPT_PARAMS.N,
            r: SCRYPT_PARAMS.r,
            p: SCRYPT_PARAMS.p
        }
    };

    // String version of keystore
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
 * @param keystore - The keystore containing the encrypted private key.
 * @param password - The password used to decrypt the keystore.
 * @returns A Promise that resolves to the decrypted KeystoreAccount or rejects if the keystore or password is invalid.
 * @throws {InvalidKeystore, InvalidKeystoreParams}
 */
async function decrypt(
    keystore: Keystore,
    password: string
): Promise<KeystoreAccount> {
    // Invalid keystore
    if (!isValid(keystore)) {
        throw new InvalidKeystore(
            'keystore.decrypt()',
            'Invalid keystore. Ensure the keystore is properly formatted and contains the necessary data.',
            { keystore }
        );
    }

    try {
        return (await ethers.decryptKeystoreJson(
            stringifyData(keystore),
            password
        )) as KeystoreAccount;
    } catch (e) {
        throw new InvalidKeystoreParams(
            'keystore.decrypt()',
            'Decryption failed: Invalid Password for the given keystore.',
            // @NOTE: We are not exposing the password in the error data for security reasons.
            {
                keystore
            }
        );
    }
}

/**
 * Validates if the provided keystore adheres to the expected format and structure.
 *
 * @param keystore - The keystore to be validated.
 * @returns A boolean indicating whether the keystore is valid or not.
 */
function isValid(keystore: Keystore): boolean {
    return ethers.isKeystoreJson(stringifyData(keystore));
}

/**
 * Exports the keystore functions for encryption, decryption, and validation.
 */
const keystore = { encrypt, decrypt, isValid };
export { keystore };
