import { describe, test } from '@jest/globals';
import { TxId } from '../../../../core';
import {
    FetchHttpClient,
    RetrieveTransactionReceipt,
    ThorNetworks
} from '../../../src';
import log from 'loglevel';

const logger = log.getLogger(
    'TEST:UNIT!packages/thorest/tests/thor/transactions/RetrieveTransactionReceipt.testnet.test.ts'
);

describe('RetrieveTransactionReceipt testnet tests', () => {
    test('ok <- askTo', async () => {
        const txId = TxId.of(
            '0xb6b5b47a5eee8b14e5222ac1bb957c0bbdc3d489850b033e3e544d9ca0cef934'
        );
        const httpClient = FetchHttpClient.at(ThorNetworks.MAINNET);
        const r = await RetrieveTransactionReceipt.of(txId).askTo(httpClient);
        logger.debug(JSON.stringify(r, null, 2));
    });
});
