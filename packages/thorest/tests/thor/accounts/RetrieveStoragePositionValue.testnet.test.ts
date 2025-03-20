import { describe, test } from '@jest/globals';
import { Address, BlockId } from '@vechain/sdk-core';
import {
    FetchHttpClient,
    RetrieveStoragePositionValue,
    ThorNetworks
} from '../../../src';
import log from 'loglevel';

const logger = log.getLogger(
    'TEST:UNIT!packages/thorest/tests/thor/accounts/RetrieveStoragePositionValue.testnet.test.ts'
);

describe('RetrieveStoragePositionValue testnet tests', () => {
    test('ok <- askTo', async () => {
        const r = await RetrieveStoragePositionValue.of(
            Address.of('0x93Ae8aab337E58A6978E166f8132F59652cA6C56'),
            BlockId.of(
                '0x0000000000000000000000000000000000000000000000000000000000000001'
            )
        ).askTo(FetchHttpClient.at(ThorNetworks.TESTNET));
        logger.debug(JSON.stringify(r, null, 2));
    });
});
