/**
 * Implements the JSON Keystore v3 Wallet encryption, decryption, and validation functionality.
 */
import { Hex0x, SCRYPT_PARAMS } from '../utils';
import { addressUtils } from '../address';
import { assert, buildError, KEYSTORE } from '@vechain/sdk-errors';
import { secp256k1 } from '../secp256k1';
import {
    type EncryptOptions,
    type Keystore,
    type KeystoreAccount, ScryptParams
} from './types';

import { ethers, getBytes } from 'ethers';
import { getPassword } from 'ethers/lib.esm/wallet/utils';
import { randomBytes } from '@noble/hashes/utils';

/**
 * Encrypts a given private key into a keystore format using the specified password.
 *
 * @param privateKey - The private key to be encrypted.
 * @param password - The password used for the encryption.
 * @returns A Promise that resolves to the encrypted keystore.
 */
async function encrypt(
    privateKey: Uint8Array,
    password: string
): Promise<Keystore> {
    // Public and Address are derived from private key.
    const keystoreAccount: KeystoreAccount = {
        address: addressUtils.fromPublicKey(
            secp256k1.derivePublicKey(privateKey)
        ),
        privateKey: Hex0x.of(privateKey)
    };
    privateKey.fill(0); // Clear private key from memory.
    // Scrypt options
    const encryptOptions: EncryptOptions = {
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

// async function _encryptKeystoreJson(
//     account: KeystoreAccount,
//     password: string | Uint8Array,
//     options?: EncryptOptions
// ): Promise<string> {
//     if (options == null) {
//         options = {};
//     }
//
//     const passwordBytes = getPassword(password);
//     const kdf = getEncryptKdfParams(options);
//     const key = await scrypt(
//         passwordBytes,
//         kdf.salt,
//         kdf.N,
//         kdf.r,
//         kdf.p,
//         64,
//         options.progressCallback
//     );
//     return encryptKeystore(getBytes(key), kdf, account, options);
// }

// function getEncryptKdfParams(options: EncryptOptions): ScryptParams {
//     // Check/generate the salt
//     const salt =
//         options.salt != null
//             ? getBytes(options.salt, 'options.salt')
//             : randomBytes(32);
//
//     // Override the scrypt password-based key derivation function parameters
//     let N = (1 << 17), r = 8, p = 1;
//     if (options.scrypt) {
//         if (options.scrypt.N) { N = options.scrypt.N; }
//         if (options.scrypt.r) { r = options.scrypt.r; }
//         if (options.scrypt.p) { p = options.scrypt.p; }
//     }
//     assertArgument(typeof(N) === "number" && N > 0 && Number.isSafeInteger(N) && (BigInt(N) & BigInt(N - 1)) === BigInt(0), "invalid scrypt N parameter", "options.N", N);
//     assertArgument(typeof(r) === "number" && r > 0 && Number.isSafeInteger(r), "invalid scrypt r parameter", "options.r", r);
//     assertArgument(typeof(p) === "number" && p > 0 && Number.isSafeInteger(p), "invalid scrypt p parameter", "options.p", p);
//
//     return { name: "scrypt", dkLen: 32, salt, N, r, p };
// }

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
    assert(
        'keystore.decrypt',
        isValid(keystore),
        KEYSTORE.INVALID_KEYSTORE,
        'Invalid keystore. Ensure the keystore is properly formatted and contains the necessary data.',
        {
            keystore
        }
    );

    try {
        return (await ethers.decryptKeystoreJson(
            JSON.stringify(keystore),
            password
        )) as KeystoreAccount;
    } catch (e) {
        throw buildError(
            'keystore.decrypt',
            KEYSTORE.INVALID_PASSWORD,
            'Decryption failed: Invalid Password for the given keystore.',
            {
                keystore,
                password
            },
            e
        );
    }
}

/**
 * Checks if a given keystore object is valid parsing its JSON representation
 * to catch any parsing errors, only valid keystore having version 3 are accepted.
 *
 * @param {Keystore} keystore - The keystore object to validate.
 * @return {boolean} Returns true if the keystore is valid, false otherwise.
 */
function isValid(keystore: Keystore): boolean {
    try {
        const copy = JSON.parse(JSON.stringify(keystore)) as Keystore;
        if (copy.version === 3) {
            return true;
        }
    } catch (error) {} // Return false if parsing fails.
    return false;
}

/**
 * Exports the keystore functions for encryption, decryption, and validation.
 */
export const keystore = { decrypt, encrypt, isValid };
