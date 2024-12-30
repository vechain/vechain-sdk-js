import { describe, test } from '@jest/globals';
import { seedThorSolo, seedVnsSolo } from '../../solo-seeding';

/**
 * Test suite for seeding thor solo
 *
 * @group unit/seeding
 */
describe('Seeding', () => {
    /**
     * Test case useful for invoking the seeding script manually.
     */
    test('Should seed thor solo', async () => {
        await seedThorSolo();
    }, 20000);

    test('Should seed vns for thor solo', async () => {
        await seedVnsSolo();
    }, 30000);
});
