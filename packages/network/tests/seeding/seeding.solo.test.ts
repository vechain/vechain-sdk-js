import { describe, test } from '@jest/globals';
import { seedThorSolo } from '../../solo-seeding';

/**
 * Prolong timeout due to block time which sometimes exceeds jest's default timeout of 5 seconds.
 */
const TIMEOUT = 20000;

/**
 * Test suite for seeding thor solo
 *
 * @group seeding
 */
describe('Seeding', () => {
    /**
     * Test case useful for invoking the seeding script manually.
     */
    test(
        'Should seed thor solo',
        async () => {
            await seedThorSolo();
        },
        TIMEOUT
    );
});
