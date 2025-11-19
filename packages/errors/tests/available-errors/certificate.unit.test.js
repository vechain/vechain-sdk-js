"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 * Available errors test - Certificate
 * @group unit/errors/available-errors/certificate
 */
(0, globals_1.describe)('Error package Available errors test - Certificate', () => {
    /**
     * CertificateSignatureMismatch
     */
    (0, globals_1.test)('CertificateSignatureMismatch', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.CertificateSignatureMismatch('method', 'message', { data: 'data' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
});
