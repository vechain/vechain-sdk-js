import { describe, test, expect } from '@jest/globals';
import { secp256k1 } from '../../src/secp256k1/secp256k1';
import { address } from '../../src/address/address';
import { ERRORS } from '../../src/utils/errors';
import { keystore } from '../../src/keystore/keystore';
import { type Keystore } from '../../src/keystore/types';
import { encryptionPassword } from './fixture';

/**
 * Keystore tests
 */
describe('Keystore', () => {
    /**
     * Encrypt private key to keystore with given password
     */
    test('encrypt', async () => {
        // Generate a random private key
        const privateKey = secp256k1.generate();

        //  Create keystore
        const myKeystore = await keystore.encrypt(
            privateKey,
            encryptionPassword
        );

        // Verify keystore
        expect(myKeystore.version).toBe(3);
        const keyStoreAddress = address.toChecksumed(`0x` + myKeystore.address);
        const addressFromPrivateKey = address.fromPublicKey(
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
        ).rejects.toThrowError(ERRORS.SECP256K1.INVALID_PRIVATE_KEY);
    });

    /**
     * Decrypt private key from keystore
     */
    test('decrypt', async () => {
        // Generate a random private key
        const privateKey = secp256k1.generate();

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
        const privateKey = secp256k1.generate();

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
        ).rejects.toThrowError(ERRORS.KEYSTORE.INVALID_PASSWORD);
    });

    /**
     * Decrypt invalid keystore
     */
    test('decrypt invalid keystore', async () => {
        // Generate a random private key
        const privateKey = secp256k1.generate();

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
        ).rejects.toThrowError(ERRORS.KEYSTORE.INVALID_KEYSTORE);
    });

    /**
     * Keystore validation
     */
    test('validation', async () => {
        // Generate a random private key
        const privateKey = secp256k1.generate();

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
