"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../src");
/**
 * Warning logger tests
 *
 * @group unit/logging/warning-logger
 */
(0, globals_1.describe)('Warning logger tests', () => {
    /**
     * Should be able to log a generic log
     */
    (0, globals_1.test)('Should be able to log a warning', () => {
        const logSpy = globals_1.jest.spyOn((0, src_1.VeChainSDKLogger)('warning'), 'log');
        (0, src_1.VeChainSDKLogger)('warning').log({
            title: 'Title of the warning message ...',
            messages: [
                'Warning message to log 1...',
                'Warning message to log 2...'
            ]
        });
        (0, globals_1.expect)(logSpy).toHaveBeenCalled();
        logSpy.mockRestore();
    });
});
