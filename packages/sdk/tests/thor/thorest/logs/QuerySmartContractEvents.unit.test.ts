import {
    EventLogsResponse,
    QuerySmartContractEvents,
    ThorError
} from '@thor/thorest';
import {
    type EventLogFilterRequestJSON,
    type EventLogsResponseJSON
} from '@thor/thorest/json';
import { expect, jest } from '@jest/globals';
import type { HttpClient } from '@common/http';
import fastJsonStableStringify from 'fast-json-stable-stringify';

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
 * group unit/logs
 */
describe('QuerySmartContractEvents UNIT tests', () => {
    test('err <- askTo - invalid request', async () => {
        const status = 400;
        // Pretend the request is invalid albeit not possible to build an invalid request from the SDK.
        const request: EventLogFilterRequestJSON =
            {} satisfies EventLogFilterRequestJSON;
        try {
            await QuerySmartContractEvents.of(request).askTo(
                mockHttpClient(mockResponse({}, status))
            );
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('ok <- askTo - not empty', async () => {
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
                    address: '0x0000000000000000000000000000456E65726779',
                    topic0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    topic1: '0x0000000000000000000000006d95e6dca01d109882fe1726a2fb9865fa41e7aa'
                }
            ],
            order: 'asc'
        } satisfies EventLogFilterRequestJSON;
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
        const actual = (
            await QuerySmartContractEvents.of(request).askTo(
                mockHttpClient(mockResponse(expected, 200))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(EventLogsResponse);
        expect(actual.toJSON()).toEqual(expected);
    });

    test('ok <- askTo -  empty', async () => {
        const request: EventLogFilterRequestJSON = {
            range: {
                unit: 'block',
                from: 0,
                to: 0
            },
            options: {}
        } satisfies EventLogFilterRequestJSON;
        const expected = [] satisfies EventLogsResponseJSON;
        const actual = (
            await QuerySmartContractEvents.of(request).askTo(
                mockHttpClient(mockResponse(expected, 200))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(EventLogsResponse);
        expect(actual.length).toEqual(0);
    });
});
