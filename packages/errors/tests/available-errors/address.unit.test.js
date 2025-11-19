"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 * Available errors test - Address
 * @group unit/errors/available-errors/address
 */
(0, globals_1.describe)('Error package Available errors test - Address', () => {
    /**
     * InvalidAddress
     */
    (0, globals_1.test)('InvalidAddress', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.InvalidAddress('method', 'message', { address: 'address' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
});
