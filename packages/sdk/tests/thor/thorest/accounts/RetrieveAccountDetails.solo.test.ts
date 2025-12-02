import { describe, expect, test } from '@jest/globals';
import { RetrieveAccountDetails } from '@thor/thorest';
import { FetchHttpClient } from '@common/http';
import { Address, Hex, Revision } from '@common/vcdm';
import { VTHO_ADDRESS, ThorNetworks } from '@thor/utils/const/network';

/**
 * VeChain retrieve account details - solo
 *
 * @group solo/thor/accounts
 */
describe('RetrieveAccountDetails solo tests', () => {
    test('ok <- askTo (without revision)', async () => {
        const response = (
            await RetrieveAccountDetails.of(
                Address.of('0x0000000000000000000000000000456E65726779')
            ).askTo(FetchHttpClient.at(new URL(ThorNetworks.SOLONET)))
        ).response;
        expect(Hex.of(response.energy).toString()).toBe('0x0');
        expect(response.hasCode).toBe(true);
        expect(Hex.of(response.balance).toString()).toBe('0x0');
    });

    test('ok <- askTo with BEST revision', async () => {
        const response = (
            await RetrieveAccountDetails.of(
                Address.of(VTHO_ADDRESS),
                Revision.BEST
            ).askTo(FetchHttpClient.at(new URL(ThorNetworks.SOLONET)))
        ).response;
        expect(Hex.of(response.energy).toString()).toBe('0x0');
        expect(response.hasCode).toBe(true);
        expect(Hex.of(response.balance).toString()).toBe('0x0');
    });

    test('ok <- askTo with FINALIZED revision', async () => {
        const response = (
            await RetrieveAccountDetails.of(
                Address.of(VTHO_ADDRESS),
                Revision.FINALIZED
            ).askTo(FetchHttpClient.at(new URL(ThorNetworks.SOLONET)))
        ).response;
        expect(Hex.of(response.energy).toString()).toBe('0x0');
        expect(response.hasCode).toBe(true);
        expect(Hex.of(response.balance).toString()).toBe('0x0');
    });

    test('ok <- askTo with numeric revision', async () => {
        const response = (
            await RetrieveAccountDetails.of(
                Address.of(VTHO_ADDRESS),
                Revision.of(0)
            ).askTo(FetchHttpClient.at(new URL(ThorNetworks.SOLONET)))
        ).response;
        expect(Hex.of(response.energy).toString()).toBe('0x0');
        expect(response.hasCode).toBe(true);
        expect(Hex.of(response.balance).toString()).toBe('0x0');
    });
});
