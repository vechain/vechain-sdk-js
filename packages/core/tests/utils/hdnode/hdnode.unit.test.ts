import { describe, expect, test } from '@jest/globals';
import { correctValidationPaths, incorrectValidationPaths } from './fixture';
import { isDerivationPathValid } from '../../../src';

/**
 * HDNode utils test
 * @group unit/utils-hdnode
 */
describe('HDNode utils', () => {
    /**
     * Invalid clauses data
     */
    test('Should be able to check validation paths', () => {
        // Correct validation paths
        correctValidationPaths.forEach((path) => {
            expect(isDerivationPathValid(path)).toEqual(true);
        });

        // Incorrect validation paths
        incorrectValidationPaths.forEach((path) => {
            expect(isDerivationPathValid(path)).toEqual(false);
        });
    });
});
