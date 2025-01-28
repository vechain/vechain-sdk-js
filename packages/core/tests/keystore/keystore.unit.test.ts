import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    InvalidDataType,
    InvalidKeystore,
    InvalidKeystoreParams,
    InvalidSecp256k1PrivateKey,
    stringifyData
} from '@vechain/sdk-errors';
import {
    Address,
    HexUInt,
    keystore,
    Secp256k1,
    type Keystore
} from '../../src';
import { encryptionPassword } from './fixture';

/**
 * Keystore tests
 * @group unit/keystore
 */
[true, false].forEach((experimentalCryptography) => {
    describe(`Keystore - ${experimentalCryptography ? 'EXPERIMENTAL' : 'NOT EXPERIMENTAL'} cryptography`, () => {
        /**
         * Set experimental cryptography
         */
        beforeEach(() => {
            keystore.useExperimentalCryptography(experimentalCryptography);
        });
        /**
         * Encrypt private key to keystore with given password
         */
        test('encrypt', async () => {
            // Generate a random private key
            const privateKey = await Secp256k1.generatePrivateKey();
            const addressFromPrivateKey =
                Address.ofPrivateKey(privateKey).toString();

            //  Create keystore
            const myKeystore = await keystore.encrypt(
                privateKey,
                encryptionPassword
            );

            // Verify keystore
            expect(myKeystore.version).toBe(3);
            const keyStoreAddress = Address.checksum(
                HexUInt.of(myKeystore.address)
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
                        new TextEncoder().encode('wrong private key'),
                        encryptionPassword
                    )
            ).rejects.toThrowError(
                experimentalCryptography
                    ? InvalidDataType
                    : InvalidSecp256k1PrivateKey
            );
        });

        /**
         * Decrypt private key from keystore
         */
        test('decrypt', async () => {
            // Generate a random private key
            const privateKey = await Secp256k1.generatePrivateKey();

            const expected = HexUInt.of(privateKey).toString();

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

            // Verify private key
            expect(decryptedKeystore.privateKey).toEqual(expected);
        });

        /**
         * Decrypt private key from keystore with invalid password
         */
        test('decrypt with invalid password', async () => {
            // Generate a random private key
            const privateKey = await Secp256k1.generatePrivateKey();

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
            ).rejects.toThrowError(InvalidKeystoreParams);
        });

        /**
         * Decrypt invalid keystore
         */
        test('decrypt invalid keystore', async () => {
            // Generate a random private key
            const privateKey = await Secp256k1.generatePrivateKey();

            //  Create keystore
            const myKeystore = await keystore.encrypt(
                privateKey,
                encryptionPassword
            );

            // Verify keystore -> False
            const invalidKeystore: string = stringifyData({
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
            ).rejects.toThrowError(
                experimentalCryptography
                    ? InvalidKeystoreParams
                    : InvalidKeystore
            );
        });

        /**
         * Keystore validation
         */
        test('validation', async () => {
            // Generate a random private key
            const privateKey = await Secp256k1.generatePrivateKey();

            //  Create keystore
            const myKeystore = await keystore.encrypt(
                privateKey,
                encryptionPassword
            );

            // Verify keystore -> True
            expect(keystore.isValid(myKeystore)).toBe(true);

            // Verify keystore -> False
            const invalidKeystore: string = stringifyData({
                ...myKeystore,
                version: 4
            });
            expect(
                keystore.isValid(JSON.parse(invalidKeystore) as Keystore)
            ).toBe(false);
        });
    });
});
