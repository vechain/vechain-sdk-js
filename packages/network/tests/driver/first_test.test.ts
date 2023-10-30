import { describe, expect, test } from '@jest/globals';
import { Driver } from '../../src/driver/driver';
import { network } from './fixture';
/**
 * Driver class tests
 * @group integration/driver
 */
describe('Driver', () => {
    // this is just an example, to be completed
    test('test', async () => {
        const driver = await Driver.connect(network);
        const block = await driver.getBlock(1);
        expect(block).toBeDefined();
    });
});
