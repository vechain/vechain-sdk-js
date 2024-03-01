import { describe, expect, test } from '@jest/globals';
import { HardhatPluginError } from 'hardhat/plugins';
import { buildHardhatError } from '../../../src';

/**
 * Hardhat build error tests
 * @group unit/errors/utils/hardhat-error-builder
 */
describe('Hardhat error builder tests', () => {
    /**
     * Should build hardhat error
     */
    test('Should be able to build HardhatError', () => {
        const result = buildHardhatError(
            'Some error message',
            new Error('Some inner error')
        );
        // Assert
        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(HardhatPluginError);
    });
});
