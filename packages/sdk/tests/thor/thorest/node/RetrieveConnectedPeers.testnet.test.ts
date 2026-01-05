import { describe, test } from '@jest/globals';
import { RetrieveConnectedPeers } from '@thor/thorest';
import { FetchHttpClient } from '@common/http';
import { log } from '@common/logging';
import { ThorNetworks } from '@thor/utils/const/network';

describe('RetrieveConnectedPeers TESTNET tests', () => {
    test('ok <- askTo', async () => {
        const actual = (
            await RetrieveConnectedPeers.of().askTo(
                FetchHttpClient.at(new URL(ThorNetworks.TESTNET))
            )
        ).response;
        log.debug({ message: JSON.stringify(actual) });
    });
});
