"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 * Available errors test - Secp2561k1
 * @group unit/errors/available-errors/secp2561k1
 */
(0, globals_1.describe)('Error package Available errors test - Secp2561k1', () => {
    /**
     * InvalidSecp256k1PrivateKey
     */
    (0, globals_1.test)('InvalidSecp256k1PrivateKey', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.InvalidSecp256k1PrivateKey('method', 'message', undefined, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    /**
     * InvalidSecp256k1MessageHash
     */
    (0, globals_1.test)('InvalidSecp256k1MessageHash', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.InvalidSecp256k1MessageHash('method', 'message', { messageHash: new Uint8Array(0) }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    /**
     * InvalidSecp256k1Signature
     */
    (0, globals_1.test)('InvalidSecp256k1Signature', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.InvalidSecp256k1Signature('method', 'message', {
                    signature: new Uint8Array(0),
                    recovery: 0
                }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
});
