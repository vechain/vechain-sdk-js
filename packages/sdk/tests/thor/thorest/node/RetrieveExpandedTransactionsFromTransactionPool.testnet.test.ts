import {
    RetrieveExpandedTransactionsFromTransactionPool,
    Transactions
} from '@thor/thorest';
import { log } from '@common/logging';
import { FetchHttpClient } from '@common/http';
import { HttpError } from '@common/errors';
import { expect } from '@jest/globals';
import { ThorNetworks } from '@thor/utils/const/network';

/**
 * @group testnet
 */
describe('RetrieveExpandedTransactionsFromTransactionPool TESTNET tests', () => {
    test('ok <- askTo', async () => {
        try {
            const actual = (
                await RetrieveExpandedTransactionsFromTransactionPool.of().askTo(
                    FetchHttpClient.at(new URL(ThorNetworks.TESTNET))
                )
            ).response;
            log.debug({ message: JSON.stringify(actual) });
            expect(actual).toBeDefined();
            expect(actual).toBeInstanceOf(Transactions);
        } catch (error) {
            // Endpoint is disabled
            expect(error).toBeInstanceOf(HttpError);
            const thorError = error as HttpError;
            expect(thorError.status).toEqual(404);
            log.debug({ message: JSON.stringify(thorError) });
        }
    });
});
