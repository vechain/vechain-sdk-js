import { describe, expect, jest, test } from '@jest/globals';
import { THOR_SOLO_URL, ThorClient } from '../../../src';
import { SimpleHttpClient } from '../../../src/http';

/**
 * Blocks module tests with mocks.
 *
 * @group integration/clients/thor-client/blocks
 */
describe('ThorClient - Blocks Module mock tests', () => {
    test('getBlockCompressed should return null if null is returned from the api', async () => {
        const thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL);

        // Mock the getBlockCompressed method to return null
        jest.spyOn(SimpleHttpClient.prototype, 'http').mockResolvedValueOnce(
            null
        );

        await expect(
            thorSoloClient.blocks.getBlockCompressed('best')
        ).resolves.toBeNull();
    });

    test('getBlockExpanded should return null if null is returned from the api', async () => {
        const thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL);

        // Mock the getBlockExpanded method to return null
        jest.spyOn(SimpleHttpClient.prototype, 'http').mockResolvedValueOnce(
            null
        );

        await expect(
            thorSoloClient.blocks.getBlockExpanded('best')
        ).resolves.toBeNull();
    });
});
