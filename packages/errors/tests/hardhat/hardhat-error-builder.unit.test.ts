/**
 * Hardhat build error tests
 * @group unit/hardhat/hardhat-error-builder
 */
import { buildHardhatError } from '../../src';
import { expect } from '@jest/globals';
import { HardhatPluginError } from 'hardhat/plugins';

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
