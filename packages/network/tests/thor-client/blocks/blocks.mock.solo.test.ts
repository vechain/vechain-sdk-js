import { describe, expect, jest, test } from '@jest/globals';
import { BlocksModule, HttpClient, ThorClient } from '../../../src';
import { soloUrl } from '../../fixture';
import { BlockGenesisNotFound } from '@vechain/sdk-errors';

/**
 * Blocks module tests with mocks.
 *
 * @group integration/clients/thor-client/blocks
 */
describe('ThorClient - Blocks Module mock tests', () => {
    test('getBlockCompressed should throw an error if null is returned from the api', async () => {
        const thorSoloClient = ThorClient.fromUrl(soloUrl);

        // Mock the getBlockCompressed method to return null
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce(null);

        await expect(
            thorSoloClient.blocks.getBlockCompressed('best')
        ).rejects.toThrowError();
    });

    test('getBlockExpanded should throw an error if null is returned from the api', async () => {
        const thorSoloClient = ThorClient.fromUrl(soloUrl);

        // Mock the getBlockExpanded method to return null
        jest.spyOn(HttpClient.prototype, 'http').mockResolvedValueOnce(null);

        await expect(
            thorSoloClient.blocks.getBlockExpanded('best')
        ).rejects.toThrowError();
    });

    test('getGenesisBlock should throw an error if genesis block is not found', async () => {
        const thorSoloClient = ThorClient.fromUrl(soloUrl);

        // Mock the getGenesisBlock method to return null
        jest.spyOn(
            BlocksModule.prototype,
            'getBlockCompressed'
        ).mockRejectedValue(BlockGenesisNotFound);

        await expect(
            thorSoloClient.blocks.getGenesisBlock()
        ).rejects.toThrowError();
    });
});
