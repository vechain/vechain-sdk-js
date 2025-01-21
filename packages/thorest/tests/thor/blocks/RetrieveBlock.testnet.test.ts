import { describe, test } from '@jest/globals';
import { FetchHttpClient, RetrieveBlock, ThorNetworks } from '../../../src';
import { Revision } from '@vechain/sdk-core';

describe('RetrieveBlock testnet tests', () => {
    test('ok <- askTo', async () => {
        const r = await RetrieveBlock.of(Revision.BEST).askTo(
            FetchHttpClient.at(ThorNetworks.TESTNET)
        );
        console.log(JSON.stringify(r, null, 2));
    });
});
