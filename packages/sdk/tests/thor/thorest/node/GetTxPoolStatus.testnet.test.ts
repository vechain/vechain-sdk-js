import { describe, expect, test } from '@jest/globals';
import { Status, ThorError, ThorNetworks } from '@thor/thorest';
import { FetchHttpClient } from '@common/http';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { GetTxPoolStatus } from '@thor/thorest/node';

/**
 * @group quarantine
 */
describe('GetTxPoolStatus TESTNET tests', () => {
    test('ok|disabled <- askTo', async () => {
        try {
            const actual = await GetTxPoolStatus.of().askTo(
                FetchHttpClient.at(new URL(ThorNetworks.TESTNET))
            );
            log.debug(fastJsonStableStringify(actual));
            expect(actual).toBeDefined();
            expect(actual).toBeInstanceOf(Status);
        } catch (error) {
            // Endpoint is disabled
            expect(error).toBeInstanceOf(ThorError);
            const thorError = error as ThorError;
            expect(thorError.status).toEqual(404);
            log.debug(fastJsonStableStringify(thorError));
        }
    });
});
