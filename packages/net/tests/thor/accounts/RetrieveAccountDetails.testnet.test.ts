import { describe, test } from '@jest/globals';
import {
    FetchHttpClient,
    RetrieveAccountDetails,
    ThorNetworks
} from '../../../src';
import { Address } from '@vechain/sdk-core';

describe('RetrieveAccountDetails testnet tests', () => {
    test('ok <- askTo', async () => {
        const r = await RetrieveAccountDetails.of(
            Address.of('0x0000000000000000000000000000456E65726779')
        ).askTo(new FetchHttpClient(ThorNetworks.TESTNET));
        console.log(JSON.stringify(r, null, 2));
    });
});
