import { describe, test, expect } from '@jest/globals';
import {
    ExpandedBlockResponse,
    type ExpandedBlockResponseJSON,
    RetrieveExpandedBlock
} from '@thor';
import { Revision } from '@vechain/sdk-core';
import { mockHttpClient } from '../../utils/MockUnitTestClient';

/**
 * VeChain expanded block - unit
 *
 * @group unit/block
 */
describe('RetrieveBlock unit tests', () => {
    test('should obtain expanded block successfully', async () => {
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
                    nonce: '0x01',
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

        const response = await RetrieveExpandedBlock.of(Revision.BEST).askTo(
            mockHttpClient<ExpandedBlockResponseJSON>(mockExpandedBlock, 'get')
        );
        expect(response.response.toJSON()).toEqual(
            new ExpandedBlockResponse(mockExpandedBlock).toJSON()
        );
    });

    test('should fail to obtain expanded block with incomplete response', async () => {
        const mockIncompleteExpandedBlock: Partial<ExpandedBlockResponseJSON> =
            {
                number: 123,
                id: '0x0000000000000000000000000000000000000000'
            };

        await expect(
            RetrieveExpandedBlock.of(Revision.BEST).askTo(
                mockHttpClient<ExpandedBlockResponseJSON>(
                    mockIncompleteExpandedBlock as ExpandedBlockResponseJSON,
                    'get'
                )
            )
        )
            .rejects.toThrowError
            // /Method 'UInt.of' failed.\s*-Reason: 'not an unsigned integer expression'\s*-Parameters:\s*{\s*"exp": "undefined"\s*}/
            ();
    });
});
