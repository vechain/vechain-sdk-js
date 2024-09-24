import { describe, test } from '@jest/globals';
import { getArgsFromEnv } from '../../../src/utils';

/**
 * Environment variables to command line arguments negative cases tests
 * @group unit/utils/env-to-args-negative-cases
 */
describe('Environment variables to command line arguments negative cases', () => {
    /**
     * Convert environment variables to command line arguments
     */
    describe('Convert environment variables to command line arguments', () => {
        /**
         * Should be able to convert environment variables to command line arguments
         */
        test('Should be able to convert environment variables to command line arguments', () => {
            const args = getArgsFromEnv();

            expect(args).toEqual(['node', 'dist/index.js']);
        });
    });
});
