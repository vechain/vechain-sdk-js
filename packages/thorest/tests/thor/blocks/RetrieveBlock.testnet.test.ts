import { describe, expect, test } from '@jest/globals';
import {
    FetchHttpClient,
    RetrieveRawBlock,
    RetrieveExpandedBlock,
    RetrieveRegularBlock,
    ThorNetworks
} from '../../../src';
import { Revision } from '@vechain/sdk-core';

describe('RetrieveBlock testnet tests', () => {
    test('should retrieve the response correctly', async () => {
        const responseRaw = await RetrieveRawBlock.of(Revision.BEST).askTo(
            FetchHttpClient.at(ThorNetworks.TESTNET)
        );
        expect(responseRaw.response).toBeDefined();

        const responseExpanded = await RetrieveExpandedBlock.of(
            Revision.BEST
        ).askTo(FetchHttpClient.at(ThorNetworks.TESTNET));
        expect(responseExpanded.response).toBeDefined();

        const responseRegular = await RetrieveRegularBlock.of(
            Revision.BEST
        ).askTo(FetchHttpClient.at(ThorNetworks.TESTNET));
        expect(responseRegular.response).toBeDefined();
    });
});
