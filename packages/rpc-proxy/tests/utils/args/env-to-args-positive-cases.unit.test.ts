import { describe, test } from '@jest/globals';
import { getArgsFromEnv } from '../../../src/utils';

/**
 * Environment variables to command line arguments positive cases tests
 * @group unit/utils/env-to-args-positive-cases
 */
describe('Environment variables to command line arguments positive cases', () => {
    /**
     * Set up the environment variables
     */
    beforeAll(() => {
        process.env.URL = 'http://localhost:8669';
        process.env.PORT = '8669';
        process.env.ACCOUNTS = 'some accounts';
        process.env.MNEMONIC = 'some mnemonic';
        process.env.MNEMONIC_COUNT = '10';
        process.env.MNEMONIC_INITIAL_INDEX = '0';
        process.env.ENABLE_DELEGATION = 'true';
        process.env.GAS_PAYER_PRIVATE_KEY = '0x1234567890abcdef';
        process.env.GAS_PAYER_SERVICE_URL = 'http://localhost:8669';
        process.env.VERBOSE = 'true';
        process.env.CONFIGURATION_FILE = 'config.json';
    });

    /**
     * Convert environment variables to command line arguments
     */
    describe('Convert environment variables to command line arguments', () => {
        /**
         * Should be able to convert environment variables to command line arguments
         */
        test('Should be able to convert environment variables to command line arguments', () => {
            const args = getArgsFromEnv();

            expect(args).toEqual([
                'node',
                'dist/index.js',
                '-u',
                'http://localhost:8669',
                '-p',
                '8669',
                '-a',
                'some accounts',
                '-m',
                'some mnemonic',
                '--mnemonicCount',
                '10',
                '--mnemonicInitialIndex',
                '0',
                '-e',
                'true',
                '--gasPayerPrivateKey',
                '0x1234567890abcdef',
                '-d',
                'http://localhost:8669',
                '-v',
                'true',
                '-c',
                'config.json'
            ]);
        });
    });
});
