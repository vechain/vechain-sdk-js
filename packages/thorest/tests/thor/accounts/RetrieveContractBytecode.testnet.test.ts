import { describe, test } from '@jest/globals';
import { Address } from '@vechain/sdk-core';
import {
    RetrieveContractBytecode,
    ThorNetworks
} from '@thor';
import { FetchHttpClient } from '@http';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

describe('RetrieveContractBytecode testnet tests', () => {
    test('ok <- askTo', async () => {
        const r = await RetrieveContractBytecode.of(
            Address.of('0x0000000000000000000000000000456E65726779')
        ).askTo(FetchHttpClient.at(ThorNetworks.TESTNET));
        log.debug(fastJsonStableStringify(r));
    });
});
