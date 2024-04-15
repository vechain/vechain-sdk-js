import {
    afterEach,
    beforeEach,
    describe,
    expect,
    jest,
    test
} from '@jest/globals';
import { type SpiedFunction } from 'jest-mock';
import { VechainTransactionLogger } from '../src/vechain-transaction-logger';

/**
 * VechainTransactionLogger Tests
 * 
 * @group integration/apps/vechain-transaction-logger
 */
describe('VechainTransactionLogger - Tests', () => {
    let logSpy: SpiedFunction<{
        (...data: never[]): void;
        (message?: never, ...optionalParams: never[]): void;
    }>;

    // Mock the console.log function to prevent logging before tests
    beforeEach(() => {
        logSpy = jest.spyOn(console, 'log');
        logSpy.mockImplementation(() => {});
    });

    // Restore the console.log function after tests
    afterEach(() => {
        logSpy.mockRestore();
    });
    
    test('Should be able to start and stop a logger instance', (done) => {
        // Create a new logger instance
        const logger = new VechainTransactionLogger('https://testnet.vechain.org/');
        // Start logging transactions for the specified address
        logger.startLogging('0xc3bE339D3D20abc1B731B320959A96A08D479583');

        // Check if the logger has started and stop it
        setTimeout(() => {
            expect(logSpy).toHaveBeenCalledWith(
                'Start monitoring account 0xc3bE339D3D20abc1B731B320959A96A08D479583'
            );
            logger.stopLogging();
            done();
        }, 1000);
    });
});
