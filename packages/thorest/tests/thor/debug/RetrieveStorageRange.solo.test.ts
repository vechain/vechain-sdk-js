import { describe, expect, test } from '@jest/globals';
import { RetrieveStorageRange, type StorageRangeOptionJSON } from '@thor/debug';
import { FetchHttpClient } from '@http';
import { ThorError, ThorNetworks } from '@thor';

/**
 * @group integration/debug
 */
describe('RetrieveStorageRange UNIT tests', () => {
    const httpClient = FetchHttpClient.at(ThorNetworks.SOLONET);

    test('err <- not implemented in solo', async () => {
        const status = 500;
        const request: StorageRangeOptionJSON = {
            address: '0xd8ccdd85abdbf68dfec95f06c973e87b1b5a9997',
            keyStart:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
            maxResult: 10,
            target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
        } satisfies StorageRangeOptionJSON;
        try {
            await RetrieveStorageRange.of(request).askTo(httpClient);
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toBe(status);
        }
    });


});
