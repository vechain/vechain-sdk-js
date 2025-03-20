import { describe, test } from '@jest/globals';
import {
    FetchHttpClient,
    RetrieveAccountDetails,
    ThorNetworks
} from '../../../src';
import { Address } from '@vechain/sdk-core';
import log from 'loglevel';

const logger = log.getLogger(
    'TEST:UNIT!packages/thorest/tests/thor/accounts/RetrieveAccountDetails.testnet.test.ts'
);

describe('RetrieveAccountDetails testnet tests', () => {
    test('ok <- askTo', async () => {
        const r = await RetrieveAccountDetails.of(
            Address.of('0x0000000000000000000000000000456E65726779')
        ).askTo(FetchHttpClient.at(ThorNetworks.TESTNET));
        logger.debug(JSON.stringify(r, null, 2));
    });
});
