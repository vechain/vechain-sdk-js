import {
    FilterOptionsRequest,
    FilterRangeRequest,
    QueryVETTransferEvents,
    ThorError,
    TransferCriteriaRequest,
    TransferLogFilterRequest,
    TransferLogsResponse
} from '@thor/thorest';
import { expect, jest } from '@jest/globals';
import type { HttpClient } from '@common/http';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { Address } from '@common/vcdm';
import { LogSort } from '@thor/thor-client/model/logs/LogSort';
import { type TransferLogsResponseJSON } from '@thor/thorest/json';
import { FilterRangeUnits } from '@thor/thorest/logs/response/FilterRangeRequestUnits';

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
describe('QueryVERTransferEvents UNIT tests', () => {
    test('err <- askTo - invalid request', async () => {
        const status = 400;
        // Valid request, mock error response.
        const request = new TransferLogFilterRequest(
            new FilterRangeRequest(FilterRangeUnits.block, 0, 0)
        );
        try {
            const query = new QueryVETTransferEvents(request);
            await query.askTo(mockHttpClient(mockResponse({}, status)));
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('ok <- askTo - not empty', async () => {
        const filter = new TransferLogFilterRequest(
            new FilterRangeRequest(FilterRangeUnits.block, 17240365, 17289864),
            new FilterOptionsRequest(0, 100, true),
            [
                new TransferCriteriaRequest(
                    Address.of('0xDb4027477B2a8fE4c83C6daFe7f86678bb1B8a8d'),
                    Address.of('0x5034Aa590125b64023a0262112b98d72e3C8E40e'),
                    Address.of('0x6d95E6dCa01D109882fe1726A2fb9865Fa41e7aA')
                )
            ],
            LogSort.asc
        );
        const expected = [
            {
                sender: '0x5034Aa590125b64023a0262112b98d72e3C8E40e',
                recipient: '0x6d95E6dCa01D109882fe1726A2fb9865Fa41e7aA',
                amount: '0x47fdb3c3f456c0000',
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
        ] satisfies TransferLogsResponseJSON;
        const query = new QueryVETTransferEvents(filter);
        const actual = (
            await query.askTo(mockHttpClient(mockResponse(expected, 200)))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(TransferLogsResponse);
        expect(actual.toJSON()).toEqual(expected);
    });

    test('ok <- askTo -  empty', async () => {
        const filter = new TransferLogFilterRequest(
            new FilterRangeRequest(FilterRangeUnits.block, 0, 0)
        );
        const expected = [] satisfies TransferLogsResponseJSON;
        const query = new QueryVETTransferEvents(filter);
        const actual = (
            await query.askTo(mockHttpClient(mockResponse(expected, 200)))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(TransferLogsResponse);
        expect(actual.length).toEqual(0);
    });
});
