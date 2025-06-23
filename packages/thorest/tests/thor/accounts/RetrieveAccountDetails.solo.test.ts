import { describe, expect, test } from '@jest/globals';
import { RetrieveAccountDetails, ThorNetworks } from '@thor';
import { FetchHttpClient } from '@http';
import { Address, Hex } from '@vechain/sdk-core';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

/**
 * VeChain retrieve account details - solo
 *
 * @group integration/accounts
 */
describe('RetrieveAccountDetails solo tests', () => {
    test('ok <- askTo', async () => {
        const response = (
            await RetrieveAccountDetails.of(
                Address.of('0x0000000000000000000000000000456E65726779')
            ).askTo(FetchHttpClient.at(ThorNetworks.SOLONET))
        ).response;
        expect(Hex.of(response.energy).toString()).toBe('0x00');
        expect(response.hasCode).toBe(true);
        expect(Hex.of(response.balance).toString()).toBe('0x00');
    });
});
