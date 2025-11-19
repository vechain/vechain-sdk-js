"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../src");
/**
 * Log logger tests
 *
 * @group unit/logging/log-logger
 */
(0, globals_1.describe)('Log logger tests', () => {
    /**
     * Should be able to log a generic log
     */
    (0, globals_1.test)('Should be able to log a log', () => {
        const logSpy = globals_1.jest.spyOn((0, src_1.VeChainSDKLogger)('log'), 'log');
        (0, src_1.VeChainSDKLogger)('log').log({
            title: 'Title of the log message ...',
            messages: ['Message to log 1...', 'Message to log 2...']
        });
        (0, globals_1.expect)(logSpy).toHaveBeenCalled();
        logSpy.mockRestore();
    });
});
