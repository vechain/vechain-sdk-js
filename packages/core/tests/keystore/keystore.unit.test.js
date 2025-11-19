"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../src");
const fixture_1 = require("./fixture");
const sdk_logging_1 = require("@vechain/sdk-logging");
/**
 * Keystore tests
 * @group unit/keystore
 */
[true, false].forEach((experimentalCryptography) => {
    (0, globals_1.describe)(`Keystore - ${experimentalCryptography ? 'EXPERIMENTAL' : 'NOT EXPERIMENTAL'} cryptography`, () => {
        beforeAll(() => {
            // Silence all loggers without affecting spy functionality
            jest.spyOn((0, sdk_logging_1.VeChainSDKLogger)('log'), 'log').mockImplementation(() => { });
            jest.spyOn((0, sdk_logging_1.VeChainSDKLogger)('error'), 'log').mockImplementation(() => { });
            jest.spyOn((0, sdk_logging_1.VeChainSDKLogger)('warning'), 'log').mockImplementation(() => { });
        });
        /**
         * Set experimental cryptography
         */
        (0, globals_1.beforeEach)(() => {
            src_1.keystore.useExperimentalCryptography(experimentalCryptography);
        });
        /**
         * Encrypt private key to keystore with given password
         */
        (0, globals_1.test)('encrypt', async () => {
            // Generate a random private key
            const privateKey = await src_1.Secp256k1.generatePrivateKey();
            const addressFromPrivateKey = src_1.Address.ofPrivateKey(privateKey).toString();
            //  Create keystore
            const myKeystore = await src_1.keystore.encrypt(privateKey, fixture_1.encryptionPassword);
            // Verify keystore
            (0, globals_1.expect)(myKeystore.version).toBe(3);
            const keyStoreAddress = src_1.Address.checksum(src_1.HexUInt.of(myKeystore.address));
            (0, globals_1.expect)(keyStoreAddress).toEqual(addressFromPrivateKey);
        });
        /**
         * Encrypt wrong private key to keystore with given password
         */
        (0, globals_1.test)('encrypt wrong private key', async () => {
            //  Create keystore
            await (0, globals_1.expect)(async () => await src_1.keystore.encrypt(new TextEncoder().encode('wrong private key'), fixture_1.encryptionPassword)).rejects.toThrowError(experimentalCryptography
                ? sdk_errors_1.InvalidDataType
                : sdk_errors_1.InvalidSecp256k1PrivateKey);
        });
        /**
         * Decrypt private key from keystore
         */
        (0, globals_1.test)('decrypt', async () => {
            // Generate a random private key
            const privateKey = await src_1.Secp256k1.generatePrivateKey();
            const expected = src_1.HexUInt.of(privateKey).toString();
            //  Create keystore
            const myKeystore = await src_1.keystore.encrypt(privateKey, fixture_1.encryptionPassword);
            // Decrypt keystore
            const decryptedKeystore = await src_1.keystore.decrypt(myKeystore, fixture_1.encryptionPassword);
            // Verify private key
            (0, globals_1.expect)(decryptedKeystore.privateKey).toEqual(expected);
        });
        /**
         * Decrypt private key from keystore with invalid password
         */
        (0, globals_1.test)('decrypt with invalid password', async () => {
            // Generate a random private key
            const privateKey = await src_1.Secp256k1.generatePrivateKey();
            //  Create keystore
            const myKeystore = await src_1.keystore.encrypt(privateKey, fixture_1.encryptionPassword);
            // Decrypt with invalid password the keystore
            await (0, globals_1.expect)(async () => await src_1.keystore.decrypt(myKeystore, `WRONG_${fixture_1.encryptionPassword}`)).rejects.toThrowError(sdk_errors_1.InvalidKeystoreParams);
        });
        /**
         * Decrypt invalid keystore
         */
        (0, globals_1.test)('decrypt invalid keystore', async () => {
            // Generate a random private key
            const privateKey = await src_1.Secp256k1.generatePrivateKey();
            //  Create keystore
            const myKeystore = await src_1.keystore.encrypt(privateKey, fixture_1.encryptionPassword);
            // Verify keystore -> False
            const invalidKeystore = (0, sdk_errors_1.stringifyData)({
                ...myKeystore,
                version: 4
            });
            // Decrypt invalid keystore
            await (0, globals_1.expect)(async () => await src_1.keystore.decrypt(JSON.parse(invalidKeystore), fixture_1.encryptionPassword)).rejects.toThrowError(experimentalCryptography
                ? sdk_errors_1.InvalidKeystoreParams
                : sdk_errors_1.InvalidKeystore);
        });
        /**
         * Keystore validation
         */
        (0, globals_1.test)('validation', async () => {
            // Generate a random private key
            const privateKey = await src_1.Secp256k1.generatePrivateKey();
            //  Create keystore
            const myKeystore = await src_1.keystore.encrypt(privateKey, fixture_1.encryptionPassword);
            // Verify keystore -> True
            (0, globals_1.expect)(src_1.keystore.isValid(myKeystore)).toBe(true);
            // Verify keystore -> False
            const invalidKeystore = (0, sdk_errors_1.stringifyData)({
                ...myKeystore,
                version: 4
            });
            (0, globals_1.expect)(src_1.keystore.isValid(JSON.parse(invalidKeystore))).toBe(false);
        });
    });
});
