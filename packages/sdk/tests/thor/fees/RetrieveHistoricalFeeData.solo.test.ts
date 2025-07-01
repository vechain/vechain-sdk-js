import { expect } from '@jest/globals';
import { type Hex, Revision } from '@vechain/sdk-core';
import { FetchHttpClient } from '@http';
import {
    GetFeesHistoryResponse,
    RetrieveHistoricalFeeData,
    RetrieveRegularBlock,
    ThorError,
    ThorNetworks
} from '@thor';

/**
 * @group integration/fees
 */
describe('RetrieveHistoricalFeeData SOLO tests', () => {
    const httpClient = FetchHttpClient.at(ThorNetworks.SOLONET);

    test('err <- of(not integer)', async () => {
        const status = 400;
        const blockCount = 1.2;
        try {
            await RetrieveHistoricalFeeData.of(blockCount).askTo(httpClient);
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
            await RetrieveHistoricalFeeData.of(blockCount).askTo(httpClient);
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
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
            await RetrieveRegularBlock.of(Revision.of(0)).askTo(httpClient)
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
            await RetrieveRegularBlock.of(Revision.of(0)).askTo(httpClient)
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
