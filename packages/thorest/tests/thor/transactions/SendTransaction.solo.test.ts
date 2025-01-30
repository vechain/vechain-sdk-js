import { describe, test } from '@jest/globals';

import { THOR_SOLO_URL, ThorClient } from '../../../../network/src';
import {
    transfer1VTHOClause,
    transferTransactionBody
} from '../../../../network/tests/thor-client/transactions/fixture';
import { TEST_ACCOUNTS } from '../../../../network/tests/fixture';
import { HexUInt, Transaction } from '@vechain/sdk-core';
import { FetchHttpClient, SendTransaction } from '../../../src';

describe('SendTransaction solo tests', () => {
    test('ok <- askTo', async () => {
        const thorSoloClient = ThorClient.at(THOR_SOLO_URL);
        const gasResult = await thorSoloClient.gas.estimateGas(
            [transfer1VTHOClause],
            TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address
        );
        console.log(gasResult);
        const tx = Transaction.of({
            ...transferTransactionBody,
            gas: gasResult.totalGas,
            nonce: 10000000
        }).sign(
            HexUInt.of(TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey)
                .bytes
        ).encoded;
        console.log(tx);
        const r = await SendTransaction.of(tx).askTo(
            FetchHttpClient.at(THOR_SOLO_URL)
        );
        console.log(r);
    });
});
