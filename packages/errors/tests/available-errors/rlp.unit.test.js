"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 * Available errors test - RLP
 * @group unit/errors/available-errors/rlp
 */
(0, globals_1.describe)('Error package Available errors test - RLP', () => {
    /**
     * InvalidRLP
     */
    (0, globals_1.test)('InvalidRLP', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.InvalidRLP('method', 'message', {
                    context: 'context',
                    data: {
                        data: 'data'
                    }
                }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
});
