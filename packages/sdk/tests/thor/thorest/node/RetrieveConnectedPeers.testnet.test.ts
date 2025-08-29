import { describe, test } from '@jest/globals';
import { RetrieveConnectedPeers, ThorNetworks } from '@thor/thorest';
import { FetchHttpClient } from '@common/http';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

describe('RetrieveConnectedPeers TESTNET tests', () => {
    test('ok <- askTo', async () => {
        const actual = (
            await RetrieveConnectedPeers.of().askTo(
                FetchHttpClient.at(new URL(ThorNetworks.TESTNET))
            )
        ).response;
        log.debug(fastJsonStableStringify(actual));
    });
});
