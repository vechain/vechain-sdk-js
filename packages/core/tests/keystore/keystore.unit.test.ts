import { describe, test, expect } from '@jest/globals';
import { secp256k1, addressUtils, keystore } from '../../src';
import { type Keystore } from '../../src';
import { encryptionPassword } from './fixture';
import {
    InvalidKeystoreError,
    InvalidKeystorePasswordError,
    InvalidSecp256k1PrivateKeyError
} from '@vechain/vechain-sdk-errors';

/**
 * Keystore tests
 * @group unit/keystore
 */
describe('Keystore', () => {
    /**
     * Encrypt private key to keystore with given password
     */
    test('encrypt', async () => {
        // Generate a random private key
        const privateKey = secp256k1.generatePrivateKey();

        //  Create keystore
        const myKeystore = await keystore.encrypt(
            privateKey,
            encryptionPassword
        );

        // Verify keystore
        expect(myKeystore.version).toBe(3);
        const keyStoreAddress = addressUtils.toChecksummed(
            `0x` + myKeystore.address
        );
        const addressFromPrivateKey = addressUtils.fromPublicKey(
            secp256k1.derivePublicKey(privateKey)
        );
        expect(keyStoreAddress).toEqual(addressFromPrivateKey);
    });

    /**
     * Encrypt wrong private key to keystore with given password
     */
    test('encrypt wrong private key', async () => {
        //  Create keystore
        await expect(
            async () =>
                await keystore.encrypt(
                    Buffer.from('wrong private key', 'hex'),
                    encryptionPassword
                )
        ).rejects.toThrowError(InvalidSecp256k1PrivateKeyError);
    });

    /**
     * Decrypt private key from keystore
     */
    test('decrypt', async () => {
        // Generate a random private key
        const privateKey = secp256k1.generatePrivateKey();

        //  Create keystore
        const myKeystore = await keystore.encrypt(
            privateKey,
            encryptionPassword
        );

        // Decrypt keystore
        const decryptedKeystore = await keystore.decrypt(
            myKeystore,
            encryptionPassword
        );

        // Verify private key (slice(2) is used to remove 0x prefix)
        expect(decryptedKeystore.privateKey.slice(2)).toEqual(
            privateKey.toString('hex')
        );
    });

    /**
     * Decrypt private key from keystore with invalid password
     */
    test('decrypt with invalid password', async () => {
        // Generate a random private key
        const privateKey = secp256k1.generatePrivateKey();

        //  Create keystore
        const myKeystore = await keystore.encrypt(
            privateKey,
            encryptionPassword
        );

        // Decrypt with invalid password the keystore
        await expect(
            async () =>
                await keystore.decrypt(
                    myKeystore,
                    `WRONG_${encryptionPassword}`
                )
        ).rejects.toThrowError(InvalidKeystorePasswordError);
    });

    /**
     * Decrypt invalid keystore
     */
    test('decrypt invalid keystore', async () => {
        // Generate a random private key
        const privateKey = secp256k1.generatePrivateKey();

        //  Create keystore
        const myKeystore = await keystore.encrypt(
            privateKey,
            encryptionPassword
        );

        // Verify keystore -> False
        const invalidKeystore: string = JSON.stringify({
            ...myKeystore,
            version: 4
        });

        // Decrypt invalid keystore
        await expect(
            async () =>
                await keystore.decrypt(
                    JSON.parse(invalidKeystore) as Keystore,
                    encryptionPassword
                )
        ).rejects.toThrowError(InvalidKeystoreError);
    });

    /**
     * Keystore validation
     */
    test('validation', async () => {
        // Generate a random private key
        const privateKey = secp256k1.generatePrivateKey();

        //  Create keystore
        const myKeystore = await keystore.encrypt(
            privateKey,
            encryptionPassword
        );

        // Verify keystore -> True
        expect(keystore.isValid(myKeystore)).toBe(true);

        // Verify keystore -> False
        const invalidKeystore: string = JSON.stringify({
            ...myKeystore,
            version: 4
        });
        expect(keystore.isValid(JSON.parse(invalidKeystore) as Keystore)).toBe(
            false
        );
    });
});
