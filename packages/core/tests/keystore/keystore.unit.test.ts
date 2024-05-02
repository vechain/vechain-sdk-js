import * as utils from '@noble/curves/abstract/utils';
import { describe, test, expect } from '@jest/globals';
import { encryptionPassword } from './fixture';
import { type KeyStore } from '../../src';
import {
    Hex0x,
    ZERO_BYTES,
    addressUtils,
    keystore,
    Hex,
    secp256k1
} from '../../src';
import {
    InvalidKeystoreError,
    InvalidKeystorePasswordError,
    InvalidSecp256k1PrivateKeyError
} from '@vechain/sdk-errors';

/**
 * Keystore tests
 * @group unit/keystore
 */
describe('keystore', () => {
    const PASSWORD = new TextEncoder().encode(
        encryptionPassword.normalize('NFKC')
    );
    const PASSWORD_IS_WIPED = ZERO_BYTES(PASSWORD.length);
    const PRIVATE_KEY_IS_WIPED = ZERO_BYTES(32);

    describe('encrypt', () => {
        test('encrypt - valid', () => {
            const privateKey = secp256k1.generatePrivateKey();
            const escrowKey = new Uint8Array(privateKey);
            const password = new Uint8Array(PASSWORD);
            const keyStore = keystore.encrypt(privateKey, password);
            expect(privateKey).toEqual(PRIVATE_KEY_IS_WIPED);
            expect(password).toEqual(PASSWORD_IS_WIPED);
            expect(keyStore.version).toBe(3);
            const keyStoreAddress = addressUtils.toERC55Checksum(
                Hex0x.canon(keyStore.address)
            );
            const addressFromPrivateKey = addressUtils.fromPublicKey(
                Buffer.from(secp256k1.derivePublicKey(escrowKey))
            );
            expect(keyStoreAddress).toEqual(addressFromPrivateKey);
        });

        test('encrypt - invalid private key', () => {
            const privateKey = utils.hexToBytes('c0ffee');
            const password = new Uint8Array(PASSWORD);
            expect(() => keystore.encrypt(privateKey, password)).toThrowError(
                InvalidSecp256k1PrivateKeyError
            );
            expect(privateKey).toEqual(ZERO_BYTES(privateKey.length));
            expect(password).toEqual(PASSWORD_IS_WIPED);
        });
    });

    /**
     * Decrypt private key from keystore
     */
    test('decrypt', async () => {
        // Generate a random private key
        const privateKey = secp256k1.generatePrivateKey();
        const escrowKey = new Uint8Array(privateKey);
        const password = new Uint8Array(PASSWORD);
        //  Create keystore
        const myKeystore = keystore.encrypt(Buffer.from(privateKey), password);

        // Decrypt keystore
        const decryptedKeystore = keystore.decrypt(
            myKeystore,
            encryptionPassword
        );

        // Verify private key (slice(2) is used to remove 0x prefix)
        expect(decryptedKeystore.privateKey.slice(2)).toEqual(
            Hex.of(escrowKey)
        );
    });

    /**
     * Decrypt private key from keystore with invalid password
     */
    test('decrypt with invalid password', async () => {
        // Generate a random private key
        const privateKey = secp256k1.generatePrivateKey();
        const password = new Uint8Array(PASSWORD);
        //  Create keystore
        const myKeystore = keystore.encrypt(Buffer.from(privateKey), password);

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
        const password = new Uint8Array(PASSWORD);
        //  Create keystore
        const myKeystore = keystore.encrypt(Buffer.from(privateKey), password);

        // Verify keystore -> False
        const invalidKeystore: string = JSON.stringify({
            ...myKeystore,
            version: 4
        });

        // Decrypt invalid keystore
        await expect(
            async () =>
                await keystore.decrypt(
                    JSON.parse(invalidKeystore) as KeyStore,
                    encryptionPassword
                )
        ).rejects.toThrowError(InvalidKeystoreError);
    });

    describe('isValid', () => {
        test('isValid - false', () => {
            const privateKey = secp256k1.generatePrivateKey();
            const password = new Uint8Array(PASSWORD);
            const invalidKeystore = JSON.parse(
                JSON.stringify({
                    ...keystore.encrypt(privateKey, password),
                    version: 4
                })
            ) as KeyStore;
            expect(keystore.isValid(invalidKeystore)).toBeFalsy();
        });

        test('isValid - true', () => {
            const privateKey = secp256k1.generatePrivateKey();
            const password = new Uint8Array(PASSWORD);
            const keyStore = keystore.encrypt(privateKey, password);
            expect(keystore.isValid(keyStore)).toBeTruthy();
        });
    });
});
