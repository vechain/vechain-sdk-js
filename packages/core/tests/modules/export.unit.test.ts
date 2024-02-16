import { describe, expect, test } from '@jest/globals';
import { vechain_sdk_core_ethers } from '../../src/core';

/**
 * Test exporting of library
 * @group unit/modules/export
 */
describe('Test exporting', () => {
    /**
     * Should be able to export ethers module
     */
    test('Should be able to export ethers module', () => {
        expect(vechain_sdk_core_ethers).toBeDefined();
    });
});
