import { describe, expect, test } from '@jest/globals';
import { ThorError, ThorNetworks } from '@thor';
import { FetchHttpClient } from '@http';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { GetTxPoolStatus } from '@thor/node/GetTxPoolStatus';

/**
 * @grop unit/node
 */
describe('GetTxPoolStatus TESTNET tests', () => {
    test('ok|disabled <- askTo', async () => {
        try {
            const actual = await GetTxPoolStatus.of().askTo(
                FetchHttpClient.at(ThorNetworks.TESTNET)
            );
            log.debug(fastJsonStableStringify(actual));
        } catch (error) {
            // Endpoint is disabled
            expect(error).toBeInstanceOf(ThorError);
            expect((error as ThorError).status).toEqual(404);
        }
    });
});
