import { describe, test } from '@jest/globals';
import { RetrieveConnectedPeers, ThorNetworks } from '@thor';
import { FetchHttpClient } from '@http';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

describe('RetrieveConnectedPeers TESTNET tests', () => {
    test('ok <- askTo', async () => {
        const r = await RetrieveConnectedPeers.of().askTo(
            FetchHttpClient.at(ThorNetworks.TESTNET)
        );
        log.debug(fastJsonStableStringify(r));
    });
});
