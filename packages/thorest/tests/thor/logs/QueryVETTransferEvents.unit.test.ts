import { describe, expect, test } from '@jest/globals';
import { QueryVETTransferEvents } from '../../../src/thor/logs/QueryVETTransferEvents';
import { type TransferLogFilterRequestJSON } from '../../../src/thor/logs/TransferLogFilterRequest';
import { type TransferLogsResponseJSON } from '../../../src/thor/logs';
import { mockHttpClient } from '../../utils/MockUnitTestClient';

/**
 *VeChain node - unit
 *
 * @group unit/logs
 */
describe('QueryVETTransferEvents unit tests', () => {
    test('ok <- askTo', async () => {
        const request: TransferLogFilterRequestJSON = {
            range: {
                unit: 'block',
                from: 17240365,
                to: 17289864
            },
            options: {
                offset: 0,
                limit: 100,
                includeIndexes: true
            },
            criteriaSet: [
                {
                    txOrigin: '0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa',
                    sender: '0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa',
                    recipient: '0x45429a2255e7248e57fce99e7239aed3f84b7a53'
                }
            ],
            order: 'asc'
        };

        const mockResponse = [
            {
                sender: '0x6d95E6dCa01D109882fe1726A2fb9865Fa41e7aA',
                recipient: '0x45429A2255e7248e57fce99E7239aED3f84B7a53',
                amount: '0x01',
                meta: {
                    clauseIndex: 10,
                    blockNumber: 17240365,
                    blockTimestamp: 1533267900,
                    txID: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    txOrigin: '0xDb4027477B2a8fE4c83C6daFe7f86678bb1B8a8d',
                    blockID:
                        '0x0000000000000000000000000000000000000000000000000000000000000000',
                    logIndex: 10,
                    txIndex: 10
                }
            }
        ] satisfies TransferLogsResponseJSON;

        const mockClient = mockHttpClient<TransferLogsResponseJSON>(
            mockResponse,
            'post'
        );

        const response =
            await QueryVETTransferEvents.of(request).askTo(mockClient);
        expect(response.response.toJSON()).toEqual(mockResponse);
    });

    test('empty response <- askTo', async () => {
        const request: TransferLogFilterRequestJSON = {
            range: {
                unit: 'block',
                from: 17240365,
                to: 17289864
            },
            options: {
                offset: 0,
                limit: 100
            },
            criteriaSet: [
                {
                    txOrigin: '0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa',
                    sender: '0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa',
                    recipient: '0x45429a2255e7248e57fce99e7239aed3f84b7a53'
                }
            ],
            order: 'asc'
        };

        const mockClient = mockHttpClient<TransferLogsResponseJSON>([], 'post');

        const response =
            await QueryVETTransferEvents.of(request).askTo(mockClient);
        expect(response.response.toJSON()).toEqual([]);
    });
});
