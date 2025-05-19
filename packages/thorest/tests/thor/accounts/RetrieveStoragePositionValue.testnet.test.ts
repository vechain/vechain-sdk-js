import { describe, test } from '@jest/globals';
import { Address, BlockId } from '@vechain/sdk-core';
import {
    RetrieveStoragePositionValue,
    ThorNetworks
} from '@thor';
import { FetchHttpClient } from '@http';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

describe('RetrieveStoragePositionValue testnet tests', () => {
    test('ok <- askTo', async () => {
        const r = await RetrieveStoragePositionValue.of(
            Address.of('0x93Ae8aab337E58A6978E166f8132F59652cA6C56'),
            BlockId.of(
                '0x0000000000000000000000000000000000000000000000000000000000000001'
            )
        ).askTo(FetchHttpClient.at(ThorNetworks.TESTNET));
        log.debug(fastJsonStableStringify(r));
    });
});
