/**
 * This file implements **JSON Keystore v3 Wallet**
 * encryption, decryption and validation.
 */
import { address } from '../address/address';
import { secp256k1 } from '../secp256k1/secp256k1';
import { ethers } from 'ethers';
import { ERRORS } from '../utils/errors';
import { type Keystore, type KeystoreAccount } from './types';

/**
 * Encrypt private key to keystore with given password
 *
 * @param privateKey Private key to be encrypted
 * @param password Password to encrypt the private key
 * @returns The keystore
 */
async function encrypt(
    privateKey: Buffer,
    password: string
): Promise<Keystore> {
    // Public and Address are derived from private key
    const derivePublicKey = secp256k1.derive(privateKey);
    const deriveAddress = address.fromPublicKey(derivePublicKey);

    // Create keystore account compatible with ethers
    const keystoreAccount: ethers.KeystoreAccount = {
        address: deriveAddress,
        privateKey: '0x' + privateKey.toString('hex')
    };

    // Scrypt options
    const encryptOptions: ethers.EncryptOptions = {
        scrypt: {
            N: 131072,
            r: 8,
            p: 1
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
 * Decrypt private key from keystore
 *
 * @param keystore Keystore to be decrypted
 * @param password Password used to decrypt keystore
 * @returns Keystore account
 */
async function decrypt(
    keystore: Keystore,
    password: string
): Promise<KeystoreAccount> {
    // Invalid keystore
    if (!isValid(keystore))
        return await Promise.reject(
            new Error(ERRORS.KEYSTORE.INVALID_KEYSTORE)
        );

    try {
        const decrypted = (await ethers.decryptKeystoreJson(
            JSON.stringify(keystore),
            password
        )) as KeystoreAccount;
        return decrypted;
    } catch (e) {
        return await Promise.reject(
            new Error(ERRORS.KEYSTORE.INVALID_PASSWORD)
        );
    }
}

/**
 * Check if the keystore is valid
 *
 * @param keystore Key store to be validated
 * @returns If the keystore is valid
 */
function isValid(keystore: Keystore): boolean {
    return ethers.isKeystoreJson(JSON.stringify(keystore));
}

const keystore = { encrypt, decrypt, isValid };
export { keystore };
