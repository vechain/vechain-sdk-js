import { describe, expect, test } from '@jest/globals';
import { Address, HexUInt32 } from '@common/vcdm';
import { RetrieveStoragePositionValue, ThorNetworks, toURL } from '@thor';
import { FetchHttpClient } from '@http';

/**
 * VeChain retrieve storage position value - solo
 *
 * @group integration/accounts
 */
describe('RetrieveStoragePositionValue testnet tests', () => {
    test('ok <- askTo', async () => {
        const response = (
            await RetrieveStoragePositionValue.of(
                Address.of('0x93Ae8aab337E58A6978E166f8132F59652cA6C56'),
                HexUInt32.of(
                    '0x0000000000000000000000000000000000000000000000000000000000000001'
                )
            ).askTo(FetchHttpClient.at(new URL(ThorNetworks.SOLONET)))
        ).response;

        expect(response.value.toString()).toBe(
            '0x0000000000000000000000000000000000000000000000000000000000000000'
        );
    });
});
