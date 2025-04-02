import { describe, expect, jest, test } from '@jest/globals';
import {
    type FetchHttpClient,
    type RawBlockResponseJSON,
    RawTx,
    type RawTxJSON,
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
        const mockRawBlock: RawTxJSON = {
            raw: '0x123'
        } satisfies RawTxJSON;

        const mockRawBlockResponse = await RetrieveRawBlock.of(
            Revision.BEST
        ).askTo(mockHttpClient<RawBlockResponseJSON>(mockRawBlock));
        expect(mockRawBlockResponse.response?.toJSON()).toEqual(
            new RawTx(mockRawBlock).toJSON()
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
