import { expect } from '@jest/globals';
import { type Hex, Revision } from '@common/vcdm';
import { FetchHttpClient, HttpException } from '@common/http';
import {
    GetFeesHistoryResponse,
    RetrieveHistoricalFeeData,
    RetrieveRegularBlock,
    ThorError,
    ThorNetworks
} from '@thor/thorest';

/**
 * @group solo/thor/fees
 */
describe('RetrieveHistoricalFeeData SOLO tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));

    test('err <- of(not integer)', async () => {
        const blockCount = 1.2;
        try {
            await RetrieveHistoricalFeeData.of(blockCount).askTo(httpClient);
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            // Can receive either HttpException (direct from FetchHttpClient) or ThorError (wrapped)
            expect([HttpException, ThorError]).toContain(
                (error as Error).constructor
            );
            const errorStatus =
                error instanceof HttpException
                    ? error.status
                    : (error as ThorError).status;
            expect([0, 400]).toContain(errorStatus);
        }
    });

    test('err <- of(< 1)', async () => {
        const blockCount = 0;
        try {
            await RetrieveHistoricalFeeData.of(blockCount).askTo(httpClient);
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            // Can receive either HttpException (direct from FetchHttpClient) or ThorError (wrapped)
            expect([HttpException, ThorError]).toContain(
                (error as Error).constructor
            );
            const errorStatus =
                error instanceof HttpException
                    ? error.status
                    : (error as ThorError).status;
            expect([0, 400]).toContain(errorStatus);
        }
    });

    test('ok <- of(10)', async () => {
        const blockCount = 10;
        const actual = (
            await RetrieveHistoricalFeeData.of(blockCount).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetFeesHistoryResponse);
        expect(actual.baseFeePerGas.length).toBeGreaterThan(0);
        expect(actual.gasUsedRatio.length).toBeGreaterThan(0);
        expect(actual.reward.length).toEqual(0);
    });

    test('ok <- .withNewestBlock(hex)', async () => {
        const block = (
            await RetrieveRegularBlock.of(Revision.BEST).askTo(httpClient)
        ).response;
        expect(block?.id).toBeDefined();
        const blockCount = 10;
        const actual = (
            await RetrieveHistoricalFeeData.of(blockCount)
                .withNewestBlock(block?.id as Hex)
                .askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetFeesHistoryResponse);
    });

    test('ok <- .withNewestBlock(number)', async () => {
        const block = (
            await RetrieveRegularBlock.of(Revision.BEST).askTo(httpClient)
        ).response;
        expect(block?.number).toBeDefined();
        const newestBlock = Revision.of(block?.number as number);
        const blockCount = 10;
        const actual = (
            await RetrieveHistoricalFeeData.of(blockCount)
                .withNewestBlock(newestBlock)
                .askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetFeesHistoryResponse);
    });

    test('ok <- .withNewestBlock(BEST)', async () => {
        const blockCount = 10;
        const actual = (
            await RetrieveHistoricalFeeData.of(blockCount)
                .withNewestBlock(Revision.BEST)
                .askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetFeesHistoryResponse);
    });

    test('ok <- .withRewardPercentiles(25, 50, 75)', async () => {
        const percentiles = [25, 50, 75];
        const blockCount = 10;
        const actual = (
            await RetrieveHistoricalFeeData.of(blockCount)
                .withRewardPercentiles(percentiles)
                .askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(GetFeesHistoryResponse);
        expect(actual.reward.length).toBeGreaterThan(0);
        actual.reward.forEach((r) => {
            expect(r.length).toEqual(percentiles.length);
        });
    });
});
