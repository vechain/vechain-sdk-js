import {
    GetFeesPriorityResponse,
    type GetFeesPriorityResponseJSON,
    SuggestPriorityFee
} from '@thor/thorest';
import { expect, jest } from '@jest/globals';
import type { HttpClient } from '@common/http';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { HttpError, InvalidThorestResponseError } from '@common/errors';

const mockHttpClient = (response: Response): HttpClient =>
    ({
        get: jest.fn().mockImplementation(async () => {
            if (!response.ok) {
                throw new HttpError(
                    'mock',
                    `HTTP ${response.status}`,
                    response.status,
                    response.statusText,
                    await response.text(),
                    response.url,
                    {}
                );
            }
            return response;
        })
    }) as unknown as HttpClient;

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
            console.log('DEBUG');
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(HttpError);
            expect((error as HttpError).status).toBe(status);
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
            expect(error).toBeInstanceOf(InvalidThorestResponseError);
            expect((error as InvalidThorestResponseError).message).toBe(
                'Bad parse'
            );
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
