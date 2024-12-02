import { describe, test } from '@jest/globals';
import {
    FetchHttpClient,
    RetrieveConnectedPeers,
    ThorNetworks
} from '../../../src';

describe('RetrieveConnectedPeers', () => {
    test('GetPeersResponse <- askTo', async () => {
        const r = await new RetrieveConnectedPeers().askTo(
            new FetchHttpClient(ThorNetworks.TESTNET)
        );
        console.log(JSON.stringify(r, null, 2));
    });
});
