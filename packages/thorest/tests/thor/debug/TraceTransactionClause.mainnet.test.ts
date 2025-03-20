import { describe, test } from '@jest/globals';
import {
    type PostDebugTracerRequestJSON,
    TraceTransactionClause
} from '../../../src/thor/debug';
import { FetchHttpClient, ThorNetworks } from '../../../src';
import log from 'loglevel';

const logger = log.getLogger(
    'TEST:UNIT!packages/thorest/tests/thor/debug/TraceTransactionClause.mainnet.test.ts'
);

describe('TraceTransactionClause mainnet tests', () => {
    test('ok <- askTo', async () => {
        const request = {
            target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0',
            name: 'call',
            config: {}
        } satisfies PostDebugTracerRequestJSON;
        const r = await TraceTransactionClause.of(request).askTo(
            FetchHttpClient.at(ThorNetworks.MAINNET)
        );
        logger.debug(JSON.stringify(r, null, 2));
    });
});
