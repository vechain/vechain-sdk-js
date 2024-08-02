import { VeChainSDKLogger } from '@vechain/sdk-logging';
import { Txt } from '../vcdm';
import { keystoreEthers, keystoreExperimental } from './cryptography';
import { type Keystore, type KeystoreAccount } from './types';

/**
 * A boolean indicating whether the keystore cryptography is experimental or not.
 */
let EXPERIMENTAL_CRYPTOGRAPHY: boolean = false;

/**
 * Sets the keystore cryptography to experimental mode.
 *
 * @param experimentalCryptography - A boolean indicating whether the keystore cryptography is experimental or not.
 */
function useExperimentalCryptography(experimentalCryptography: boolean): void {
    EXPERIMENTAL_CRYPTOGRAPHY = experimentalCryptography;
}

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
    if (EXPERIMENTAL_CRYPTOGRAPHY)
        VeChainSDKLogger('warning').log({
            title: `Experimental cryptography`,
            messages: [
                `Remember, you are using an experimental cryptography library.`,
                'functions: keystore.encrypt'
            ]
        });

    return EXPERIMENTAL_CRYPTOGRAPHY
        ? keystoreExperimental.encrypt(privateKey, Txt.of(password).bytes)
        : await keystoreEthers.encrypt(privateKey, password);
}

/**
 * Decrypts a keystore to obtain the private key using the given password.
 *
 * @throws {InvalidKeystoreError, InvalidKeystorePasswordError}
 * @param keystore - The keystore containing the encrypted private key.
 * @param password - The password used to decrypt the keystore.
 * @returns A Promise that resolves to the decrypted KeystoreAccount or rejects if the keystore or password is invalid.
 */
async function decrypt(
    keystore: Keystore,
    password: string
): Promise<KeystoreAccount> {
    if (EXPERIMENTAL_CRYPTOGRAPHY)
        VeChainSDKLogger('warning').log({
            title: `Experimental cryptography`,
            messages: [
                `Remember, you are using an experimental cryptography library.`,
                'functions: keystore.decrypt'
            ]
        });

    return EXPERIMENTAL_CRYPTOGRAPHY
        ? keystoreExperimental.decrypt(keystore, Txt.of(password).bytes)
        : await keystoreEthers.decrypt(keystore, password);
}

/**
 * Validates if the provided keystore adheres to the expected format and structure.
 *
 * @param keystore - The keystore to be validated.
 * @returns A boolean indicating whether the keystore is valid or not.
 */
function isValid(keystore: Keystore): boolean {
    if (EXPERIMENTAL_CRYPTOGRAPHY)
        VeChainSDKLogger('warning').log({
            title: `Experimental cryptography`,
            messages: [
                `Remember, you are using an experimental cryptography library.`,
                'functions: keystore.isValid'
            ]
        });

    return EXPERIMENTAL_CRYPTOGRAPHY
        ? keystoreExperimental.isValid(keystore)
        : keystoreEthers.isValid(keystore);
}

/**
 * Exports the keystore functions for encryption, decryption, and validation.
 */
const keystore = { encrypt, decrypt, isValid, useExperimentalCryptography };
export { keystore };
