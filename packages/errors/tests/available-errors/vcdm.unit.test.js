"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 * Available errors test - VCDM
 * @group unit/errors/available-errors/vcdm
 */
(0, globals_1.describe)('Error package Available errors test - VCDM', () => {
    /**
     * InvalidOperation
     */
    (0, globals_1.test)('InvalidOperation', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.InvalidOperation('method', 'message', { data: 'data' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
});
