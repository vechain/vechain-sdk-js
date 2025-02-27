import { describe, test, expect } from '@jest/globals';
import {
    type RawBlockResponseJSON,
    RawBlockResponse,
    RetrieveRawBlock
} from '../../../src/thor/blocks';
import { Revision } from '@vechain/sdk-core';
import { mockHttpClient } from '../../utils/MockUnitTestClient';

/**
 * VeChain raw block - unit
 *
 * @group unit/block
 */
describe('RetrieveBlock unit tests', () => {
    test('should obtain raw block successfully 2', async () => {
        const mockRawBlock: RawBlockResponseJSON = {
            raw: '0x123'
        } satisfies RawBlockResponseJSON;

        const mockRawBlockResponse = await RetrieveRawBlock.of(
            Revision.BEST
        ).askTo(mockHttpClient(mockRawBlock, 'get'));
        expect(mockRawBlockResponse.response.toJSON()).toEqual(
            new RawBlockResponse(mockRawBlock).toJSON()
        );
    });

    test('should fail to obtain raw block with incomplete response', async () => {
        const mockIncompleteRawBlock: Partial<RawBlockResponseJSON> = {};

        await expect(
            RetrieveRawBlock.of(Revision.BEST).askTo(
                mockHttpClient(
                    mockIncompleteRawBlock as RawBlockResponseJSON,
                    'get'
                )
            )
        ).rejects.toThrowError(
            /Method 'Hex.of' failed.\s*-Reason: 'not an hexadecimal expression'\s*-Parameters:\s*{\s*"exp": "undefined"\s*}\s*-Internal error:\s*Uint8Array expected/
        );
    });
});
