"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 * Available errors test - HDKey
 * @group unit/errors/available-errors/hdkey
 */
(0, globals_1.describe)('Error package Available errors test - HDKey', () => {
    /**
     * Helper function to test InvalidHDKeyMnemonic
     * @param innerError - The inner error, if any
     * @param data - The fragment data for the test
     */
    const testInvalidHDKeyMnemonic = (innerError, data // Allow the whole object to be undefined
    ) => {
        (0, globals_1.expect)(() => {
            throw new src_1.InvalidHDKeyMnemonic('method', 'message', data, innerError);
        }).toThrowError(src_1.VechainSDKError);
    };
    /**
     * Test InvalidHDKeyMnemonic
     */
    (0, globals_1.test)('InvalidHDKeyMnemonic', () => {
        // Inner error options
        const innerErrors = [
            undefined,
            new Error('error')
        ];
        // Fragment type options, ensuring valid types
        const fragmentData = [
            { wordlistSize: 0 },
            undefined
        ];
        innerErrors.forEach((innerError) => {
            fragmentData.forEach((data) => {
                testInvalidHDKeyMnemonic(innerError, data);
            });
        });
    });
    /**
     * Helper function to test InvalidHDKey
     * @param innerError - The inner error, if any
     */
    const testInvalidHDKey = (innerError) => {
        (0, globals_1.expect)(() => {
            throw new src_1.InvalidHDKey('method', 'message', {
                derivationPath: 'path',
                chainCode: new Uint8Array(0),
                publicKey: new Uint8Array(0)
            }, innerError);
        }).toThrowError(src_1.VechainSDKError);
    };
    /**
     * Test InvalidHDKey
     */
    (0, globals_1.test)('InvalidHDKey', () => {
        // Inner error options
        const innerErrors = [
            undefined,
            new Error('error')
        ];
        innerErrors.forEach((innerError) => {
            testInvalidHDKey(innerError);
        });
    });
});
