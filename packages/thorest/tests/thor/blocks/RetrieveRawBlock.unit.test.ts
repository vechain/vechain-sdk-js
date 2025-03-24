import { describe, test, expect, jest } from '@jest/globals';
import {
    type FetchHttpClient,
    type RawBlockResponseJSON,
    RawBlockResponse,
    RetrieveRawBlock
} from '../../../src';
import { IllegalArgumentError, Revision } from '@vechain/sdk-core';

const mockHttpClient = <T>(response: T): FetchHttpClient => {
    return {
        get: jest.fn().mockImplementation(() => {
            return {
                json: jest.fn().mockImplementation(() => {
                    return response;
                })
            };
        })
    } as unknown as FetchHttpClient;
};

/**
 * VeChain raw block - unit
 *
 * @group unit/block
 */
describe('RetrieveBlock unit tests', () => {
    test('should obtain raw block successfully', async () => {
        const mockRawBlock: RawBlockResponseJSON = {
            raw: '0x123'
        } satisfies RawBlockResponseJSON;

        const mockRawBlockResponse = await RetrieveRawBlock.of(
            Revision.BEST
        ).askTo(mockHttpClient<RawBlockResponseJSON>(mockRawBlock));
        expect(mockRawBlockResponse.response.toJSON()).toEqual(
            new RawBlockResponse(mockRawBlock).toJSON()
        );
    });

    test('should fail to obtain raw block with incomplete response', async () => {
        const mockIncompleteRawBlock: Partial<RawBlockResponseJSON> = {};

        await expect(
            RetrieveRawBlock.of(Revision.BEST).askTo(
                mockHttpClient<RawBlockResponseJSON>(
                    mockIncompleteRawBlock as RawBlockResponseJSON
                )
            )
        ).rejects.toThrowError(IllegalArgumentError);
    });
});
