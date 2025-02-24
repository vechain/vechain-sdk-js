import { describe, test, expect } from '@jest/globals';
import { type FetchHttpClient } from '../../../src/http';
import {
    RetrieveRegularBlock,
    type RegularBlockResponseJSON,
    RegularBlockResponse
} from '../../../src/thor/blocks';
import { Revision } from '@vechain/sdk-core';

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
 * VeChain regular block - unit
 *
 * @group unit/block
 */
describe('RetrieveBlock unit tests', () => {
    test('should obtain regular block successfully', async () => {
        const mockRegularBlock = {
            number: 123,
            id: '0x0000000000000000000000000000000000000000',
            size: 456,
            parentID: '0x0000000000000000000000000000000000000000',
            timestamp: 789,
            gasLimit: 1000,
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: 500,
            totalScore: 100,
            txsRoot: '0x0000000000000000000000000000000000000000',
            txsFeatures: 1,
            stateRoot: '0x0000000000000000000000000000000000000000',
            receiptsRoot: '0x0000000000000000000000000000000000000000',
            com: true,
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            isFinalized: true,
            transactions: ['0x0000000000000000000000000000000000000000']
        } satisfies RegularBlockResponseJSON;

        const mockRegularBlockResponse = await RetrieveRegularBlock.of(
            Revision.BEST
        ).askTo(mockHttpClient<RegularBlockResponseJSON>(mockRegularBlock));
        expect(mockRegularBlockResponse.response).toEqual(
            new RegularBlockResponse(mockRegularBlock)
        );
    });

    test('should fail to obtain regular block with incomplete response', async () => {
        const mockIncompleteRegularBlock: Partial<RegularBlockResponseJSON> = {
            number: 123,
            id: '0x0000000000000000000000000000000000000000'
        };

        await expect(
            RetrieveRegularBlock.of(Revision.BEST).askTo(
                mockHttpClient<RegularBlockResponseJSON>(
                    mockIncompleteRegularBlock as RegularBlockResponseJSON
                )
            )
        ).rejects.toThrow();
    });
});
