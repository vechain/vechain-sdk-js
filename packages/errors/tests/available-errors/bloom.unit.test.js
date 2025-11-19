"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 * Available errors test - Bloom
 * @group unit/errors/available-errors/bloom
 */
(0, globals_1.describe)('Error package Available errors test - Bloom', () => {
    /**
     * InvalidBloom
     */
    (0, globals_1.test)('InvalidBloom', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.InvalidBloom('method', 'message', { data: 'data' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
    /**
     * InvalidBloom
     */
    (0, globals_1.test)('InvalidBloomParams', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.InvalidBloomParams('method', 'message', { data: 'data' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
});
