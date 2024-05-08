import * as utils from '@noble/curves/abstract/utils';
import { describe, test, expect } from '@jest/globals';
import { encryptionPassword } from './fixture';
import { type KeyStore } from '../../src';
import {
    Hex0x,
    ZERO_BYTES,
    addressUtils,
    keystore,
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

    describe('decrypt', () => {
        test('decrypt - valid', () => {
            const privateKey = secp256k1.generatePrivateKey();
            const escrowKey = new Uint8Array(privateKey);
            const password = new Uint8Array(PASSWORD);
            const escrowPassword = new Uint8Array(password);
            const keyStore = keystore.encrypt(privateKey, password);
            const keystoreAccount = keystore.decrypt(keyStore, escrowPassword);
            expect(keystoreAccount.privateKey).toEqual(escrowKey);
        });

        test('decrypt - invalid password', () => {
            const privateKey = secp256k1.generatePrivateKey();
            const password = new Uint8Array(PASSWORD);
            const keyStore = keystore.encrypt(privateKey, password);
            const invalidPassword = new TextEncoder().encode(
                `WRONG_${encryptionPassword}`.normalize('NFKC')
            );
            expect(() =>
                keystore.decrypt(keyStore, invalidPassword)
            ).toThrowError(InvalidKeystorePasswordError);
        });

        test('decrypt - invalid keystore', () => {
            const privateKey = secp256k1.generatePrivateKey();
            const password = new Uint8Array(PASSWORD);
            const escrowPassword = new Uint8Array(password);
            const keyStore = keystore.encrypt(privateKey, password);
            const invalidKeystore: string = JSON.stringify({
                ...keyStore,
                version: 4
            });
            expect(() =>
                keystore.decrypt(
                    JSON.parse(invalidKeystore) as KeyStore,
                    escrowPassword
                )
            ).toThrowError(InvalidKeystoreError);
        });
    });

    describe('isValid', () => {
        test('isValid - false - invalid crypto cipher', () => {
            const privateKey = secp256k1.generatePrivateKey();
            const password = new Uint8Array(PASSWORD);
            const invalidKeystore = JSON.parse(
                JSON.stringify({
                    ...keystore.encrypt(privateKey, password),
                    crypto: {
                        cipher: 'chacha'
                    }
                })
            ) as KeyStore;
            expect(keystore.isValid(invalidKeystore)).toBeFalsy();
        });

        test('isValid - false - invalid crypto kdf', () => {
            const privateKey = secp256k1.generatePrivateKey();
            const password = new Uint8Array(PASSWORD);
            const invalidKeystore = JSON.parse(
                JSON.stringify({
                    ...keystore.encrypt(privateKey, password),
                    crypto: {
                        kdf: 'pdkdf2'
                    }
                })
            ) as KeyStore;
            expect(keystore.isValid(invalidKeystore)).toBeFalsy();
        });

        test('isValid - false - invalid version', () => {
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
