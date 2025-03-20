import { describe, test } from '@jest/globals';
import { Address } from '@vechain/sdk-core';
import {
    RetrieveContractBytecode,
    FetchHttpClient,
    ThorNetworks
} from '../../../src';
import log from 'loglevel';

const logger = log.getLogger(
    'TEST:UNIT!packages/thorest/tests/thor/accounts/RetrieveContractBytecode.testnet.test.ts'
);

describe('RetrieveContractBytecode testnet tests', () => {
    test('ok <- askTo', async () => {
        const r = await RetrieveContractBytecode.of(
            Address.of('0x0000000000000000000000000000456E65726779')
        ).askTo(FetchHttpClient.at(ThorNetworks.TESTNET));
        logger.debug(JSON.stringify(r, null, 2));
    });
});
