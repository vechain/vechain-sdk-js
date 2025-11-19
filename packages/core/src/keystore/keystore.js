"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keystore = void 0;
const sdk_logging_1 = require("@vechain/sdk-logging");
const vcdm_1 = require("../vcdm");
const cryptography_1 = require("./cryptography");
/**
 * A boolean indicating whether the keystore cryptography is experimental or not.
 */
let EXPERIMENTAL_CRYPTOGRAPHY = false;
/**
 * Sets the keystore cryptography to experimental mode.
 *
 * @param experimentalCryptography - A boolean indicating whether the keystore cryptography is experimental or not.
 */
function useExperimentalCryptography(experimentalCryptography) {
    EXPERIMENTAL_CRYPTOGRAPHY = experimentalCryptography;
}
/**
 * Encrypts a given private key into a keystore format using the specified password.
 *
 * @param privateKey - The private key to be encrypted.
 * @param password - The password used for the encryption.
 * @returns A Promise that resolves to the encrypted keystore.
 */
async function encrypt(privateKey, password) {
    if (EXPERIMENTAL_CRYPTOGRAPHY)
        (0, sdk_logging_1.VeChainSDKLogger)('warning').log({
            title: `Experimental cryptography`,
            messages: [
                `Remember, you are using an experimental cryptography library.`,
                'functions: keystore.encrypt'
            ]
        });
    return EXPERIMENTAL_CRYPTOGRAPHY
        ? cryptography_1.keystoreExperimental.encrypt(privateKey, vcdm_1.Txt.of(password).bytes)
        : await cryptography_1.keystoreEthers.encrypt(privateKey, password);
}
/**
 * Decrypts a keystore to obtain the private key using the given password.
 *
 * @throws {InvalidKeystoreError, InvalidKeystorePasswordError}
 * @param keystore - The keystore containing the encrypted private key.
 * @param password - The password used to decrypt the keystore.
 * @returns A Promise that resolves to the decrypted KeystoreAccount or rejects if the keystore or password is invalid.
 */
async function decrypt(keystore, password) {
    if (EXPERIMENTAL_CRYPTOGRAPHY)
        (0, sdk_logging_1.VeChainSDKLogger)('warning').log({
            title: `Experimental cryptography`,
            messages: [
                `Remember, you are using an experimental cryptography library.`,
                'functions: keystore.decrypt'
            ]
        });
    return EXPERIMENTAL_CRYPTOGRAPHY
        ? cryptography_1.keystoreExperimental.decrypt(keystore, vcdm_1.Txt.of(password).bytes)
        : await cryptography_1.keystoreEthers.decrypt(keystore, password);
}
/**
 * Validates if the provided keystore adheres to the expected format and structure.
 *
 * @param keystore - The keystore to be validated.
 * @returns A boolean indicating whether the keystore is valid or not.
 */
function isValid(keystore) {
    if (EXPERIMENTAL_CRYPTOGRAPHY)
        (0, sdk_logging_1.VeChainSDKLogger)('warning').log({
            title: `Experimental cryptography`,
            messages: [
                `Remember, you are using an experimental cryptography library.`,
                'functions: keystore.isValid'
            ]
        });
    return EXPERIMENTAL_CRYPTOGRAPHY
        ? cryptography_1.keystoreExperimental.isValid(keystore)
        : cryptography_1.keystoreEthers.isValid(keystore);
}
/**
 * Exports the keystore functions for encryption, decryption, and validation.
 */
const keystore = { encrypt, decrypt, isValid, useExperimentalCryptography };
exports.keystore = keystore;
