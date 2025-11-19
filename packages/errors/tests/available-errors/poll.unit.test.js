"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 * Available errors test - Poll
 * @group unit/errors/available-errors/poll
 */
(0, globals_1.describe)('Error package Available errors test - Poll', () => {
    /**
     * PollExecution
     */
    (0, globals_1.test)('PollExecution', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            (0, globals_1.expect)(() => {
                throw new src_1.PollExecution('method', 'message', { functionName: 'function' }, innerError);
            }).toThrowError(src_1.VechainSDKError);
        });
    });
});
