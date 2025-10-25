import {
    RetrieveTransactionsFromTransactionPool,
    ThorError,
    ThorNetworks,
    TransactionsIDs
} from '@thor/thorest';
import { FetchHttpClient } from '@common/http';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { expect } from '@jest/globals';

/**
 * @group quarantine
 */
describe('RetrieveTransactionsFromTransactionPool TESTNET tests', () => {
    test('ok <- askTo', async () => {
        try {
            const actual = (
                await RetrieveTransactionsFromTransactionPool.of().askTo(
                    FetchHttpClient.at(new URL(ThorNetworks.TESTNET))
                )
            ).response;
            log.debug(fastJsonStableStringify(actual));
            expect(actual).toBeDefined();
            expect(actual).toBeInstanceOf(TransactionsIDs);
        } catch (error) {
            // Endpoint is disabled
            expect(error).toBeInstanceOf(ThorError);
            const thorError = error as ThorError;
            expect(thorError.status).toEqual(404);
            log.debug(fastJsonStableStringify(thorError));
        }
    });
});
