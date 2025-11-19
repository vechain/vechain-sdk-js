"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 * Available errors test - Keystore
 * @group unit/errors/available-errors/keystore
 */
(0, globals_1.describe)('Error package Available errors test - Keystore', () => {
    /**
     * InvalidKeystore
     */
    (0, globals_1.test)('InvalidKeystore', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.InvalidKeystore('method', 'message', { data: 'data' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    /**
     * InvalidKeystoreParams
     */
    (0, globals_1.test)('InvalidKeystoreParams', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.InvalidKeystoreParams('method', 'message', { data: 'data' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
});
