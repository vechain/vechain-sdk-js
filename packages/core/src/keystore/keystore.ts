import log from 'loglevel';
import { Txt } from '../vcdm';
import { keystoreEthers, keystoreExperimental } from './cryptography';
import { type Keystore, type KeystoreAccount } from './types';
import pkg from '../../package.json';

/**
 * Represents the software tag identifier expressing the **artifact and version coordinates**
 * used for logging or debugging purposes.
 *
 * This constant value is used to facilitate filtering or grouping of log messages,
 * helping developers to identify and trace operations or issues related to this specific SDK version in the application.
 */
const TAG = `vechain-sdk-js:${pkg.version}`;

/**
 * Full-Qualified Path
 */
const FQP = 'packages/core/src/keystore/keystore.ts!';

/**
 * A logger instance configured with a specific tag and fully qualified path (FQP).
 * The logger is intended for capturing and managing application log messages,
 * utilizing the tag and FQP for context-specific logging.
 */
const logger = log.getLogger(`${TAG}:${FQP}`);

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
    privateKey: Uint8Array,
    password: string
): Promise<Keystore> {
    if (EXPERIMENTAL_CRYPTOGRAPHY)
        logger.warn(
            `${TAG}:${FQP}encrypt(privateKey: Uint8Array, password: string): EXPERIMENTAL CRYPTOGRAPHY LIBRARY.`
        );

    return EXPERIMENTAL_CRYPTOGRAPHY
        ? keystoreExperimental.encrypt(privateKey, Txt.of(password).bytes)
        : await keystoreEthers.encrypt(privateKey, password);
}

/**
 * Decrypts a keystore to obtain the private key using the given password.
 *
 * @throws {InvalidKeystoreError, InvalidPasswordError}
 * @param keystore - The keystore containing the encrypted private key.
 * @param password - The password used to decrypt the keystore.
 * @returns A Promise that resolves to the decrypted KeystoreAccount or rejects if the keystore or password is invalid.
 */
async function decrypt(
    keystore: Keystore,
    password: string
): Promise<KeystoreAccount> {
    if (EXPERIMENTAL_CRYPTOGRAPHY)
        logger.warn(
            `${TAG}:${FQP}decrypt(keystore: Keystore, password: string): EXPERIMENTAL CRYPTOGRAPHY LIBRARY.`
        );
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
        logger.warn(
            `${TAG}:${FQP}isValid(keystore: Keystore): EXPERIMENTAL CRYPTOGRAPHY LIBRARY.`
        );
    return EXPERIMENTAL_CRYPTOGRAPHY
        ? keystoreExperimental.isValid(keystore)
        : keystoreEthers.isValid(keystore);
}

/**
 * Exports the keystore functions for encryption, decryption, and validation.
 */
const keystore = { encrypt, decrypt, isValid, useExperimentalCryptography };
export { keystore };
