import {
    GetFeesPriorityResponse,
    type GetFeesPriorityResponseJSON,
    SuggestPriorityFee,
    ThorError
} from '@thor/thorest';
import { expect, jest } from '@jest/globals';
import type { HttpClient } from '@common/http';
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
 * @group unit/thor/fees
 */
describe('SuggestPriorityFee UNIT tests', () => {
    test('err <- server error', async () => {
        const status = 500;
        const expected = {
            maxPriorityFeePerGas: '0xDEAD'
        } satisfies GetFeesPriorityResponseJSON;
        try {
            await SuggestPriorityFee.of().askTo(
                mockHttpClient(mockResponse(expected, status))
            );
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('err <- illegal response body', async () => {
        const status = 200;
        const expected = {
            maxPriorityFeePerGas: 'illegal literal'
        } satisfies GetFeesPriorityResponseJSON;
        try {
            await SuggestPriorityFee.of().askTo(
                mockHttpClient(mockResponse(expected, status))
            );
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('ok <- ask', async () => {
        const expected = {
            maxPriorityFeePerGas: '0x98'
        } satisfies GetFeesPriorityResponseJSON;
        const actual = (
            await SuggestPriorityFee.of().askTo(
                mockHttpClient(mockResponse(expected, 200))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetFeesPriorityResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });
});
