import {
    EventCriteriaRequest,
    EventLogFilterRequest,
    EventLogsResponse,
    FilterOptionsRequest,
    FilterRangeRequest,
    QuerySmartContractEvents,
    ThorError
} from '@thor/thorest';
import { type EventLogsResponseJSON } from '@thor/thorest/json';
import { expect, jest } from '@jest/globals';
import type { HttpClient } from '@common/http';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { Address, Hex } from '@common/vcdm';
import { LogSortRequest } from '@thor/thorest/logs/response/LogSortRequest';
import { FilterRangeRequestUnits } from '@thor/thorest/logs/response/FilterRangeRequestUnits';

const mockHttpClient = <T>(response: T): HttpClient => {
    return {
        post: jest.fn().mockReturnValue(response)
    } as unknown as HttpClient;
};

const mockResponse = <T>(body: T, status: number): Response => {
    const init: ResponseInit = {
        status,
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    };
    return new Response(fastJsonStableStringify(body), init);
};

/**
 * @group unit
 */
describe('QuerySmartContractEvents UNIT tests', () => {
    test('err <- askTo - invalid request', async () => {
        const status = 400;
        // Valid request, mock error response.
        const request = new EventLogFilterRequest(
            new FilterRangeRequest(FilterRangeRequestUnits.block, 0, 0)
        );
        try {
            const query = new QuerySmartContractEvents(request);
            await query.askTo(mockHttpClient(mockResponse({}, status)));
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('ok <- askTo - not empty', async () => {
        const filter = new EventLogFilterRequest(
            new FilterRangeRequest(
                FilterRangeRequestUnits.block,
                17240365,
                17289864
            ),
            new FilterOptionsRequest(0, 100, true),
            [
                new EventCriteriaRequest(
                    Address.of('0x0000000000000000000000000000456E65726779'),
                    Hex.of(
                        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
                    ),
                    Hex.of(
                        '0x0000000000000000000000006d95e6dca01d109882fe1726a2fb9865fa41e7aa'
                    )
                )
            ],
            LogSortRequest.asc
        );
        const expected = [
            {
                address: '0x0000000000000000000000000000456E65726779',
                topics: [
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    '0x000000000000000000000000435933c8064b4ae76be665428e0307ef2ccfbd68'
                ],
                data: '0x4de71f2d588aa8a1ea00fe8312d92966da424d9939a511fc0be81e65fad52af8',
                meta: {
                    blockID:
                        '0x0004f6cc88bb4626a92907718e82f255b8fa511453a78e8797eb8cea3393b215',
                    blockNumber: 325324,
                    blockTimestamp: 1533267900,
                    txID: '0x284bba50ef777889ff1a367ed0b38d5e5626714477c40de38d71cedd6f9fa477',
                    txOrigin: '0xDb4027477B2a8fE4c83C6daFe7f86678bb1B8a8d',
                    clauseIndex: 0,
                    txIndex: 1,
                    logIndex: 1
                }
            }
        ] satisfies EventLogsResponseJSON;
        const query = new QuerySmartContractEvents(filter);
        const actual = (
            await query.askTo(mockHttpClient(mockResponse(expected, 200)))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(EventLogsResponse);
        expect(actual.toJSON()).toEqual(expected);
    });

    test('ok <- askTo -  empty', async () => {
        const filter = new EventLogFilterRequest(
            new FilterRangeRequest(FilterRangeRequestUnits.block, 0, 0)
        );
        const expected = [] satisfies EventLogsResponseJSON;
        const query = new QuerySmartContractEvents(filter);
        const actual = (
            await query.askTo(mockHttpClient(mockResponse(expected, 200)))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(EventLogsResponse);
        expect(actual.length).toEqual(0);
    });
});
