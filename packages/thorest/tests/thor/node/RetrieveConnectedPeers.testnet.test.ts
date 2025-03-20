import { describe, test } from '@jest/globals';
import {
    FetchHttpClient,
    RetrieveConnectedPeers,
    ThorNetworks
} from '../../../src';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

const logger = log.getLogger(
    'TEST:UNIT!packages/thorest/tests/thor/node/RetrieveConnectedPeers.testnet.test.ts'
);

describe('RetrieveConnectedPeers testnet tests', () => {
    test('ok <- askTo', async () => {
        const r = await new RetrieveConnectedPeers().askTo(
            FetchHttpClient.at(ThorNetworks.TESTNET)
        );
        logger.debug(fastJsonStableStringify(r));
    });
});
