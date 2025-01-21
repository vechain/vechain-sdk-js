import { describe, test } from '@jest/globals';
import {
    FetchHttpClient,
    RetrieveConnectedPeers,
    ThorNetworks
} from '../../../src';

describe('RetrieveConnectedPeers testnet tests', () => {
    test('ok <- askTo', async () => {
        const r = await new RetrieveConnectedPeers().askTo(
            FetchHttpClient.at(ThorNetworks.TESTNET)
        );
        console.log(JSON.stringify(r, null, 2));
    });
});
