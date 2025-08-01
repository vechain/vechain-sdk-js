import type { HttpClient } from '@common/http';
import { expect, jest } from '@jest/globals';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import {
    GetFeesHistoryResponse,
    type GetFeesHistoryResponseJSON,
    RetrieveHistoricalFeeData,
    ThorError
} from '@thor/thorest';
import { HexUInt32, Revision } from '@common/vcdm';

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
 * @group unit/fees
 */
describe('RetrieveHistoricalFeeData UNIT tests', () => {
    test('err <- of(not integer)', async () => {
        const status = 400;
        const blockCount = 1.2;
        try {
            await RetrieveHistoricalFeeData.of(blockCount).askTo(
                mockHttpClient(
                    mockResponse(
                        'invalid blockCount, it should represent an integer: strconv.ParseUint: parsing "1.2": invalid syntax',
                        status
                    )
                )
            );
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('err <- of(< 1)', async () => {
        const status = 400;
        const blockCount = 0;
        try {
            await RetrieveHistoricalFeeData.of(blockCount).askTo(
                mockHttpClient(
                    mockResponse(
                        'invalid blockCount, it should not be 0',
                        status
                    )
                )
            );
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });

    test('ok <- of(10)', async () => {
        const expected = {
            oldestBlock:
                '0x0000008a658e4e31ef6e42d2241645f1228fec429100b0586688fde3590e9cd9',
            baseFeePerGas: [
                '0x9184e72a000',
                '0x9184e72a000',
                '0x9184e72a000',
                '0x9184e72a000',
                '0x9184e72a000',
                '0x9184e72a000',
                '0x9184e72a000',
                '0x9184e72a000',
                '0x9184e72a000',
                '0x9184e72a000'
            ],
            gasUsedRatio: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        } satisfies GetFeesHistoryResponseJSON;
        const blockCount = 10;
        const actual = (
            await RetrieveHistoricalFeeData.of(blockCount).askTo(
                mockHttpClient(mockResponse(expected, 200))
            )
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetFeesHistoryResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('ok <- .withNewestBlock(hex)', async () => {
        const expected = {
            oldestBlock:
                '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6',
            baseFeePerGas: ['0x0', '0x9184e72a000'],
            gasUsedRatio: [0, 0.00029862666666666666]
        } satisfies GetFeesHistoryResponseJSON;
        const newestBlock = HexUInt32.of(
            '0x000004108e6fe2b6426157dbe03775365f39a6e6125d7393c1e9c25c3fdbaf77'
        );
        const blockCount = 10;
        const actual = (
            await RetrieveHistoricalFeeData.of(blockCount)
                .withNewestBlock(newestBlock)
                .askTo(mockHttpClient(mockResponse(expected, 200)))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetFeesHistoryResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('ok <- .withNewestBlock(num)', async () => {
        const expected = {
            oldestBlock:
                '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6',
            baseFeePerGas: ['0x0', '0x9184e72a000'],
            gasUsedRatio: [0, 0.00029862666666666666]
        } satisfies GetFeesHistoryResponseJSON;
        const newestBlock = Revision.of(
            '0x000004108e6fe2b6426157dbe03775365f39a6e6125d7393c1e9c25c3fdbaf77'
        );
        const blockCount = 1;
        const actual = (
            await RetrieveHistoricalFeeData.of(blockCount)
                .withNewestBlock(newestBlock)
                .askTo(mockHttpClient(mockResponse(expected, 200)))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetFeesHistoryResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('ok <- .withNewestBlock(BEST)', async () => {
        const expected = {
            oldestBlock:
                '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6',
            baseFeePerGas: ['0x0'],
            gasUsedRatio: [0]
        } satisfies GetFeesHistoryResponseJSON;
        const blockCount = 1;
        const actual = (
            await RetrieveHistoricalFeeData.of(blockCount)
                .withNewestBlock(Revision.BEST)
                .askTo(mockHttpClient(mockResponse(expected, 200)))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetFeesHistoryResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });

    test('ok <- .withRewardPercentiles(25, 50, 75)', async () => {
        const percentiles = [25, 50, 75];
        const expected = {
            oldestBlock:
                '0x000003e518c482f04e78621218d5494f299effa50e700ea3613f08cc6233af61',
            baseFeePerGas: ['0x9184e72a000'],
            gasUsedRatio: [0],
            reward: [['0x0', '0x0', '0x0']]
        } satisfies GetFeesHistoryResponseJSON;
        const blockCount = 1;
        const actual = (
            await RetrieveHistoricalFeeData.of(blockCount)
                .withRewardPercentiles(percentiles)
                .askTo(mockHttpClient(mockResponse(expected, 200)))
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetFeesHistoryResponse);
        expect(actual?.toJSON()).toEqual(expected);
    });
});
