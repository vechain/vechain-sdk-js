import {
    RetrieveExpandedTransactionsFromTransactionPool,
    ThorError,
    ThorNetworks,
    Transactions
} from '@thor/thorest';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { FetchHttpClient } from '@common/http';
import { expect } from '@jest/globals';

describe('RetrieveExpandedTransactionsFromTransactionPool TESTNET tests', () => {
    test('ok <- askTo', async () => {
        try {
            const actual = (
                await RetrieveExpandedTransactionsFromTransactionPool.of().askTo(
                    FetchHttpClient.at(new URL(ThorNetworks.TESTNET))
                )
            ).response;
            log.debug(fastJsonStableStringify(actual));
            expect(actual).toBeDefined();
            expect(actual).toBeInstanceOf(Transactions);
        } catch (error) {
            // Endpoint is disabled
            expect(error).toBeInstanceOf(ThorError);
            const thorError = error as ThorError;
            expect(thorError.status).toEqual(404);
            log.debug(fastJsonStableStringify(thorError));
        }
    });
});
