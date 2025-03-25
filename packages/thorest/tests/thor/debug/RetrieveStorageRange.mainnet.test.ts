import { describe, test } from '@jest/globals';
import {
    RetrieveStorageRange,
    type StorageRangeOptionJSON
} from '../../../src/thor/debug';
import { FetchHttpClient, ThorNetworks } from '../../../src';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

describe('RetrieveStorageRange mainnet tests', () => {
    test('ok <- askTo', async () => {
        const request = {
            address: '0xd8ccdd85abdbf68dfec95f06c973e87b1b5a9997',
            keyStart:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
            maxResult: 10,
            target: '0x010709463c1f0c9aa66a31182fb36d1977d99bfb6526bae0564a0eac4006c31a/0/0'
        } satisfies StorageRangeOptionJSON;
        const r = await RetrieveStorageRange.of(request).askTo(
            FetchHttpClient.at(ThorNetworks.MAINNET)
        );
        log.debug(fastJsonStableStringify(r));
    });
});
