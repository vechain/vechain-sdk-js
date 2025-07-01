import {
    RetrieveTransactionsFromTransactionPool,
    ThorError,
    ThorNetworks,
    TransactionsIDs
} from '@thor';
import { FetchHttpClient } from '@http';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { expect } from '@jest/globals';

describe('RetrieveTransactionsFromTransactionPool TESTNET tests', () => {
    test('ok <- askTo', async () => {
        try {
            const actual = (
                await RetrieveTransactionsFromTransactionPool.of().askTo(
                    FetchHttpClient.at(ThorNetworks.TESTNET)
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
