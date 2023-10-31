import { describe, expect, test } from '@jest/globals';
import { Driver } from '../../src/driver/driver';
import { network } from './fixture';

/**
 * Block tests
 * @group integration/block
 */
describe('Block integration tests', () => {
    test('Should get the requested block ', async () => {
        const driver = await Driver.connect(network);
        // Should fetch the block
        const block = await driver.getBlock(
            '0x000000019015bbd98fc1c9088d793ba9add53896a29cd9aa3a4dcabd1f561c38'
        );
        expect(block).toBeDefined();
        // Should fetch the block from the cache
        const cacheBlock = await driver.getBlock(
            '0x000000019015bbd98fc1c9088d793ba9add53896a29cd9aa3a4dcabd1f561c38'
        );
        expect(cacheBlock).toBeDefined();
    });
});
