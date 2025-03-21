import { describe, test, jest, expect } from '@jest/globals';
import { QuerySmartContractEvents } from '../../../src/thor/logs/QuerySmartContractEvents';
import { type EventLogFilterRequestJSON } from '../../../src/thor/logs/EventLogFilterRequest';
import { type FetchHttpClient } from '../../../src';
import {
    EventLogsResponse,
    type EventLogsResponseJSON
} from '../../../src/thor/logs';

const mockHttpClient = <T>(response: T): FetchHttpClient => {
    return {
        post: jest.fn().mockImplementation(() => {
            return {
                json: jest.fn().mockImplementation(() => {
                    return response;
                })
            };
        })
    } as unknown as FetchHttpClient;
};

/**
 *VeChain node - unit
 *
 * @group unit/logs
 */
describe('QuerySmartContractEvents unit tests', () => {
    test('ok <- askTo', async () => {
        const request: EventLogFilterRequestJSON = {
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
                    address: '0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa'
                }
            ],
            order: 'asc'
        };

        const mockResponse = [
            {
                address: '0x6d95E6dCa01D109882fe1726A2fb9865Fa41e7aA',
                topics: [
                    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
                ],
                data: '0x00',
                meta: {
                    clauseIndex: 10,
                    blockNumber: 10,
                    blockTimestamp: 10,
                    txID: '0x0000000000000000000000000000000000000000000000000000000000000000',
                    txOrigin: '0x0000000000000000000000000000000000000000',
                    blockID:
                        '0x0000000000000000000000000000000000000000000000000000000000000000',
                    logIndex: 10,
                    txIndex: 10
                }
            }
        ] as unknown as EventLogsResponseJSON;

        const mockClient = mockHttpClient<EventLogsResponseJSON>(mockResponse);

        const response =
            await QuerySmartContractEvents.of(request).askTo(mockClient);
        expect(response.response.toJSON()).toEqual(
            new EventLogsResponse(mockResponse).toJSON()
        );
    });

    test('empty response <- askTo', async () => {
        const request: EventLogFilterRequestJSON = {
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
                    address: '0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa',
                    topic0: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
                }
            ],
            order: 'asc'
        };

        const mockClient = mockHttpClient([]);

        const response =
            await QuerySmartContractEvents.of(request).askTo(mockClient);
        expect(response.response).toStrictEqual([]);
    });
});
