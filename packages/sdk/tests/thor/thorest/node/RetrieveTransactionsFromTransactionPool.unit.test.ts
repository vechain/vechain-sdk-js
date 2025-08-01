import {
    RetrieveTransactionsFromTransactionPool,
    TransactionsIDs
} from '@thor/thorest';
import { type TransactionsIDsJSON } from '@thor/thorest/json';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { expect, jest } from '@jest/globals';
import type { HttpClient } from '@common/http';

const mockHttpClient = <T>(response: T): HttpClient => {
    return {
        get: jest.fn().mockReturnValue(response)
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
 * @group unit/node
 */
describe('RetrieveTransactionsFromTransactionPool UNIT tests', () => {
    test('ok <- askTo', async () => {
        const expected = [
            '0x284bba50ef777889ff1a367ed0b38d5e5626714477c40de38d71cedd6f9fa477',
            '0x4de71f2d588aa8a1ea00fe8312d92966da424d9939a511fc0be81e65fad52af8'
        ] satisfies TransactionsIDsJSON;
        const actual = (
            await RetrieveTransactionsFromTransactionPool.of().askTo(
                mockHttpClient(mockResponse(expected, 200))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toEqual(new TransactionsIDs(expected));
    });
});
