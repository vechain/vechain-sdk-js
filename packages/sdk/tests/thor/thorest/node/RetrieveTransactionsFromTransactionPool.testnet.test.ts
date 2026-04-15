import {
    RetrieveTransactionsFromTransactionPool,
    TransactionsIDs
} from '@thor/thorest';
import { FetchHttpClient } from '@common/http';
import { log } from '@common/logging';
import { expect } from '@jest/globals';
import { ThorNetworks } from '@thor/utils/const';
import { HttpError } from '@common/errors';

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
            log.debug({ message: JSON.stringify(actual) });
            expect(actual).toBeDefined();
            expect(actual).toBeInstanceOf(TransactionsIDs);
        } catch (error) {
            // Endpoint is disabled
            expect(error).toBeInstanceOf(HttpError);
            const thorError = error as HttpError;
            expect(thorError.status).toEqual(404);
            log.debug({ message: JSON.stringify(thorError) });
        }
    });
});
