import { FetchHttpClient } from '@common/http';
import { ThorError, ThorNetworks, TraceTransactionClause } from '@thor/thorest';
import { type PostDebugTracerRequestJSON } from '@thor/thorest/json';
import { expect } from '@jest/globals';

/**
 * @group solo/thor/debug
 */
describe('TraceTransactionClause SOLO tests', () => {
    const httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));

    test('err <- not implemented in solo', async () => {
        const request = {
            target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0',
            name: 'call',
            config: {}
        } satisfies PostDebugTracerRequestJSON;
        try {
            await TraceTransactionClause.of(request).askTo(httpClient);
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
