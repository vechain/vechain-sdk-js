"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keystore = void 0;
/**
 * Implements the JSON Keystore v3 Wallet encryption, decryption, and validation functionality.
 */
const sdk_errors_1 = require("@vechain/sdk-errors");
const ethers_1 = require("ethers");
const secp256k1_1 = require("../../../secp256k1");
const vcdm_1 = require("../../../vcdm");
const const_1 = require("./const");
/**
 * Encrypts a given private key into a keystore format using the specified password.
 *
 * @param privateKey - The private key to be encrypted.
 * @param password - The password used for the encryption.
 * @returns A Promise that resolves to the encrypted keystore.
 */
async function encrypt(privateKey, password) {
    // Public and Address are derived from a private key
    const derivePublicKey = secp256k1_1.Secp256k1.derivePublicKey(privateKey);
    const deriveAddress = vcdm_1.Address.ofPublicKey(derivePublicKey).toString();
    // Create keystore account compatible with ethers
    const keystoreAccount = {
        address: deriveAddress,
        privateKey: vcdm_1.HexUInt.of(privateKey).toString()
    };
    // Scrypt options
    const encryptOptions = {
        scrypt: {
            N: const_1.SCRYPT_PARAMS.N,
            r: const_1.SCRYPT_PARAMS.r,
            p: const_1.SCRYPT_PARAMS.p
        }
    };
    // String version of keystore
    const keystoreJsonString = await ethers_1.ethers.encryptKeystoreJson(keystoreAccount, password, encryptOptions);
    return JSON.parse(keystoreJsonString);
}
/**
 * Decrypts a keystore to obtain the private key using the given password.
 *
 * @param keystore - The keystore containing the encrypted private key.
 * @param password - The password used to decrypt the keystore.
 * @returns A Promise that resolves to the decrypted KeystoreAccount or rejects if the keystore or password is invalid.
 * @throws {InvalidKeystore, InvalidKeystoreParams}
 */
async function decrypt(keystore, password) {
    // Invalid keystore
    if (!isValid(keystore)) {
        throw new sdk_errors_1.InvalidKeystore('keystore.decrypt()', 'Invalid keystore. Ensure the keystore is properly formatted and contains the necessary data.', { keystore });
    }
    try {
        return (await ethers_1.ethers.decryptKeystoreJson((0, sdk_errors_1.stringifyData)(keystore), password));
    }
    catch {
        throw new sdk_errors_1.InvalidKeystoreParams('keystore.decrypt()', 'Decryption failed: Invalid Password for the given keystore.', 
        // @NOTE: We are not exposing the password in the error data for security reasons.
        {
            keystore
        });
    }
}
/**
 * Validates if the provided keystore adheres to the expected format and structure.
 *
 * @param keystore - The keystore to be validated.
 * @returns A boolean indicating whether the keystore is valid or not.
 */
function isValid(keystore) {
    return ethers_1.ethers.isKeystoreJson((0, sdk_errors_1.stringifyData)(keystore));
}
/**
 * Exports the keystore functions for encryption, decryption, and validation.
 */
const keystore = { encrypt, decrypt, isValid };
exports.keystore = keystore;
