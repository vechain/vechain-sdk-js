import { describe, test, expect } from '@jest/globals';
import {
    type RawBlockResponseJSON,
    RawBlockResponse,
    RetrieveRawBlock
} from '../../../src';
import { IllegalArgumentError, Revision } from '@vechain/sdk-core';
import { mockHttpClient } from '../../utils/MockUnitTestClient';

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
        ).askTo(
            mockHttpClient<RawBlockResponse>(
                new RawBlockResponse(mockRawBlock),
                'get'
            )
        );
        expect(mockRawBlockResponse.response.toJSON()).toEqual(
            new RawBlockResponse(mockRawBlock).toJSON()
        );
    });

    test('should fail to obtain raw block with incomplete response', async () => {
        const mockIncompleteRawBlock: Partial<RawBlockResponseJSON> = {};

        await expect(
            RetrieveRawBlock.of(Revision.BEST).askTo(
                mockHttpClient<RawBlockResponse>(
                    new RawBlockResponse(
                        mockIncompleteRawBlock as RawBlockResponseJSON
                    ),
                    'get'
                )
            )
        ).rejects.toThrowError(IllegalArgumentError);
    });
});
