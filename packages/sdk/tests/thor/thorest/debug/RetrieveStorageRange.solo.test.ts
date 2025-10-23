import { describe, expect, test } from '@jest/globals';
import { RetrieveStorageRange, ThorNetworks, ThorError } from '@thor/thorest';
import { FetchHttpClient } from '@common/http';
import { type StorageRangeOptionJSON } from '@thor/thorest/json';

/**
 * @group solo/thor/debug
 */
describe('RetrieveStorageRange SOLO tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));

    test('err <- not implemented in solo', async () => {
        const request = {
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
            // Now we expect status 0 for network errors (when server is not running)
            // or status 500 for HTTP errors (when server is running but endpoint not implemented)
            const thorError = error as ThorError;
            expect([0, 500]).toContain(thorError.status);
        }
    });
});
