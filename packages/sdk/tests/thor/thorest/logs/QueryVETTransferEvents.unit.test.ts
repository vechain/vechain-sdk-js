import {
    QueryVETTransferEvents,
    ThorError,
    TransferLogsResponse
} from '@thor/thorest';
import {
    type TransferLogFilterRequestJSON,
    type TransferLogsResponseJSON
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
describe('QueryVERTransferEvents UNIT tests', () => {
    test('err <- askTo - invalid request', async () => {
        const status = 400;
        // Pretend the request is invalid albeit not possible to build an invalid request from the SDK.
        const request: TransferLogFilterRequestJSON =
            {} satisfies TransferLogFilterRequestJSON;
        try {
            await QueryVETTransferEvents.of(request).askTo(
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
                    txOrigin: '0xDb4027477B2a8fE4c83C6daFe7f86678bb1B8a8d',
                    sender: '0x5034Aa590125b64023a0262112b98d72e3C8E40e',
                    recipient: '0x6d95E6dCa01D109882fe1726A2fb9865Fa41e7aA'
                }
            ],
            order: 'asc'
        } satisfies TransferLogFilterRequestJSON;
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
        const actual = (
            await QueryVETTransferEvents.of(request).askTo(
                mockHttpClient(mockResponse(expected, 200))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(TransferLogsResponse);
        expect(actual.toJSON()).toEqual(expected);
    });

    test('ok <- askTo -  empty', async () => {
        const request: TransferLogFilterRequestJSON = {
            range: {
                unit: 'block',
                from: 0,
                to: 0
            },
            options: {}
        } satisfies TransferLogFilterRequestJSON;
        const expected = [] satisfies TransferLogsResponseJSON;
        const actual = (
            await QueryVETTransferEvents.of(request).askTo(
                mockHttpClient(mockResponse(expected, 200))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(TransferLogsResponse);
        expect(actual.length).toEqual(0);
    });
});
