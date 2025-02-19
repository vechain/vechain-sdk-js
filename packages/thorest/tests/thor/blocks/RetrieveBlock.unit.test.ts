import { describe, test, expect } from '@jest/globals';
import {
    RetrieveBlock,
    RetrieveBlockPath
} from '../../../src/thor/blocks/RetrieveBlock';
import { type FetchHttpClient } from '../../../src/http';
import {
    ExpandedBlockResponse,
    type RegularBlockResponseJSON,
    type RawBlockResponseJSON,
    type ExpandedBlockResponseJSON,
    RawBlockResponse,
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
 * VeChain block - unit
 *
 * @group unit/block
 */
describe('RetrieveBlock unit tests', () => {
    test('ok <- askTo (expanded)', async () => {
        const mockExpandedBlock = {
            number: 123,
            id: '0x0000000000000000000000000000000000000000',
            size: 456,
            parentID: '0x0000000000000000000000000000000000000000',
            timestamp: 1739959316,
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
            transactions: [
                {
                    id: '0x0000000000000000000000000000000000000000',
                    origin: '0x0000000000000000000000000000000000000000',
                    delegator: '0x0000000000000000000000000000000000000000',
                    nonce: '1',
                    chainTag: 1,
                    blockRef: '0x0000000000000000000000000000000000000000',
                    expiration: 720,
                    clauses: [
                        {
                            to: '0x0000000000000000000000000000000000000000',
                            value: '0x1',
                            data: '0x0000000000000000000000000000000000000000'
                        }
                    ],
                    gasPriceCoef: 0,
                    gas: 21000,
                    dependsOn: null,
                    size: 123,
                    gasUsed: 21000,
                    gasPayer: '0x0000000000000000000000000000000000000000',
                    paid: '0x0000000000000000000000000000000000000000',
                    reward: '0x0000000000000000000000000000000000000000',
                    reverted: false,
                    outputs: [
                        {
                            contractAddress:
                                '0x0000000000000000000000000000000000000000',
                            events: [
                                {
                                    address:
                                        '0x0000000000000000000000000000000000000000',
                                    topics: [
                                        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000'
                                    ],
                                    data: '0x0000000000000000000000000000000000000000000000000000000000000000'
                                }
                            ],
                            transfers: [
                                {
                                    sender: '0x0000000000000000000000000000000000000000',
                                    recipient:
                                        '0x0000000000000000000000000000000000000000',
                                    amount: '0x1'
                                }
                            ]
                        }
                    ]
                }
            ]
        } satisfies ExpandedBlockResponseJSON;

        const response = await new RetrieveBlock(
            new RetrieveBlockPath(Revision.BEST),
            'expanded'
        ).askTo(mockHttpClient<ExpandedBlockResponseJSON>(mockExpandedBlock));
        expect(response.response.toJSON()).toEqual(
            new ExpandedBlockResponse(mockExpandedBlock).toJSON()
        );
    });

    test('ok <- askTo (raw)', async () => {
        const mockRawBlock: RawBlockResponseJSON = {
            raw: '0x123'
        } satisfies RawBlockResponseJSON;

        const mockRawBlockResponse = await new RetrieveBlock(
            new RetrieveBlockPath(Revision.BEST),
            'raw'
        ).askTo(mockHttpClient<RawBlockResponseJSON>(mockRawBlock));
        expect(mockRawBlockResponse.response).toEqual(
            new RawBlockResponse(mockRawBlock)
        );
    });

    test('ok <- askTo (regular)', async () => {
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

        const mockRegularBlockResponse = await new RetrieveBlock(
            new RetrieveBlockPath(Revision.BEST)
        ).askTo(mockHttpClient<RegularBlockResponseJSON>(mockRegularBlock));
        expect(mockRegularBlockResponse.response).toEqual(
            new RegularBlockResponse(mockRegularBlock)
        );
    });
});
