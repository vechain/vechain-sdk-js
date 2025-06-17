import { describe, test } from '@jest/globals';
import { RetrieveAccountDetails, ThorNetworks } from '@thor';
import { FetchHttpClient } from '@http';
import { Address } from '@vechain/sdk-core';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

/**
 * VeChain retrieve account details - solo
 * @group integration/accounts
 */
describe('RetrieveAccountDetails solo tests', () => {
    test('ok <- askTo', async () => {
        const r = await RetrieveAccountDetails.of(
            Address.of('0x0000000000000000000000000000456E65726779')
        ).askTo(FetchHttpClient.at(ThorNetworks.SOLONET));
        log.debug(fastJsonStableStringify(r));
    });
});
