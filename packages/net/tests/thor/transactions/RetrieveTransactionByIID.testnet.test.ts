import { describe, test } from '@jest/globals';
import { TxId } from '../../../../core';
import {
    FetchHttpClient,
    RetrieveTransactionByID,
    ThorNetworks
} from '../../../src';

describe('RetrieveTransactionByID testnet tests', () => {
    test('ok <- askTo', async () => {
        const txId = TxId.of(
            '0xb6b5b47a5eee8b14e5222ac1bb957c0bbdc3d489850b033e3e544d9ca0cef934'
        );
        const httpClient = FetchHttpClient.at(ThorNetworks.MAINNET);
        const r = await RetrieveTransactionByID.of(txId).askTo(httpClient);
        console.log(JSON.stringify(r, null, 2));
    });
});
