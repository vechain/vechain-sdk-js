"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../src");
/**
 * Error logger tests
 *
 * @group unit/logging/error-logger
 */
(0, globals_1.describe)('Error logger tests', () => {
    /**
     * Should be able to log an error
     */
    (0, globals_1.test)('Should be able to log an error', () => {
        const logSpy = globals_1.jest.spyOn((0, src_1.VeChainSDKLogger)('error'), 'log');
        (0, src_1.VeChainSDKLogger)('error').log(new sdk_errors_1.JSONRPCInternalError('test-method', `Error on request`, {
            some: 'data'
        }));
        (0, globals_1.expect)(logSpy).toHaveBeenCalled();
        logSpy.mockRestore();
    });
});
