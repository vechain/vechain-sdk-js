import { describe, expect, jest, test } from '@jest/globals';
import { THOR_SOLO_URL, ThorClient } from '../../../src';
import { SimpleHttpClient } from '../../../src/http';
import { retryOperation } from '../../test-utils';

/**
 * Blocks module tests with mocks.
 *
 * @group integration/clients/thor-client/blocks
 */
describe('ThorClient - Blocks Module mock tests', () => {
    test('getBlockCompressed should return null if null is returned from the api', async () => {
        const thorSoloClient = ThorClient.at(THOR_SOLO_URL);

        // Mock the getBlockCompressed method to return null
        jest.spyOn(SimpleHttpClient.prototype, 'http').mockResolvedValueOnce(
            null
        );

        await expect(
            thorSoloClient.blocks.getBlockCompressed('best')
        ).resolves.toBeNull();
    });

    test('getBlockExpanded should return null if null is returned from the api', async () => {
        const thorSoloClient = ThorClient.at(THOR_SOLO_URL);

        // Mock the getBlockExpanded method to return null
        jest.spyOn(SimpleHttpClient.prototype, 'http').mockResolvedValueOnce(
            null
        );

        await expect(
            thorSoloClient.blocks.getBlockExpanded('best')
        ).resolves.toBeNull();
    });

    test('getBlockCompressed', async () => {
        const thorSoloClient = ThorClient.at(THOR_SOLO_URL);
        const block = await retryOperation(async () => {
            return await thorSoloClient.blocks.getBlockCompressed('best');
        });
        expect(block).toBeDefined();
    }, 15000);
});
