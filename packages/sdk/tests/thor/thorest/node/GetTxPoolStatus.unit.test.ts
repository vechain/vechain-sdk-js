import { describe, expect, jest, test } from '@jest/globals';
import { GetTxPoolStatus } from '@thor/thorest/node';
import { type HttpClient } from '@common/http';
import { Status } from '@thor/thorest/node/model';
import { type StatusJSON } from '@thor/thorest/json';
import fastJsonStableStringify from 'fast-json-stable-stringify';

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
 * @group unit/thor/node
 */
describe('GetTxPoolStatus UNIT tests', () => {
    test('ok <- askTo', async () => {
        const expected = {
            total: 42
        } satisfies StatusJSON;
        const actual = (
            await GetTxPoolStatus.of().askTo(
                mockHttpClient(mockResponse(expected, 200))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(Status);
        expect(actual?.toJSON()).toEqual(expected);
    });
});
