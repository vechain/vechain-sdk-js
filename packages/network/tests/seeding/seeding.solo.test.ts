import { describe, test } from '@jest/globals';
import { seedThorSolo } from '../../solo-seeding';

/**
 * Test suite for seeding thor solo
 *
 * @group seeding
 */
describe('Seeding', () => {
    /**
     * Test case useful for invoking the seeding script manually.
     */
    test('Should seed thor solo', async () => {
        await seedThorSolo();
    }, 20000);
});
