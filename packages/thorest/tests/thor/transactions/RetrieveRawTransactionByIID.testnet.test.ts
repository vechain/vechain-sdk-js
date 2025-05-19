import { describe, test } from '@jest/globals';
import { TxId } from '@vechain/sdk-core';
import {
    RetrieveRawTransactionByID,
    ThorNetworks
} from '@thor';
import { FetchHttpClient } from '@http';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

describe('RetrieveRawTransactionByID testnet tests', () => {
    test('ok <- askTo', async () => {
        const txId = TxId.of(
            '0xb6b5b47a5eee8b14e5222ac1bb957c0bbdc3d489850b033e3e544d9ca0cef934'
        );
        const httpClient = FetchHttpClient.at(ThorNetworks.MAINNET);
        const r = await RetrieveRawTransactionByID.of(txId).askTo(httpClient);
        log.debug(fastJsonStableStringify(r));
    });
});
