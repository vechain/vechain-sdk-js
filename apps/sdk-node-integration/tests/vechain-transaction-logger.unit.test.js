"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const vechain_transaction_logger_1 = require("../src/vechain-transaction-logger");
/**
 * VechainTransactionLogger Tests
 *
 * @group integration/apps/vechain-transaction-logger
 */
(0, globals_1.describe)('VechainTransactionLogger - Tests', () => {
    let logSpy;
    // Mock the console.log function to prevent logging before tests
    (0, globals_1.beforeEach)(() => {
        logSpy = globals_1.jest.spyOn(console, 'log');
        logSpy.mockImplementation(() => { });
    });
    // Restore the console.log function after tests
    (0, globals_1.afterEach)(() => {
        logSpy.mockRestore();
    });
    (0, globals_1.test)('Should be able to start and stop a logger instance', (done) => {
        // Create a new logger instance
        const logger = new vechain_transaction_logger_1.VechainTransactionLogger('https://testnet.vechain.org/');
        // Start logging transactions for the specified address
        logger.startLogging('0xc3bE339D3D20abc1B731B320959A96A08D479583');
        // Check if the logger has started and stop it
        setTimeout(() => {
            (0, globals_1.expect)(logSpy).toHaveBeenCalledWith('Start monitoring account 0xc3bE339D3D20abc1B731B320959A96A08D479583');
            logger.stopLogging();
            done();
        }, 2000);
    }, 6000);
});
