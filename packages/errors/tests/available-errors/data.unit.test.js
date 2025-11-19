"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 * Available errors test - Data
 * @group unit/errors/available-errors/data
 */
(0, globals_1.describe)('Error package Available errors test - Data', () => {
    /**
     * InvalidDataType
     */
    (0, globals_1.test)('InvalidDataType', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.InvalidDataType('method', 'message', { data: 'data' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    /**
     * UnsupportedOperation
     */
    (0, globals_1.test)('UnsupportedOperation', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.UnsupportedOperation('method', 'message', { data: 'data' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
});
