import { describe, test } from '@jest/globals';

import {
    type EventLogFilterRequestJSON,
    QuerySmartContractEvents
} from '../../../src/thor/logs';
import { FetchHttpClient, ThorNetworks } from '../../../src';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

describe('QuerySmartContractEvents testnet tests', () => {
    test('ok <- askTo', async () => {
        const request = {
            range: {
                unit: 'block',
                from: 17240365,
                to: 17289864
            },
            options: {
                offset: 0,
                limit: 100
            },
            criteriaSet: [
                {
                    address: '0x0000000000000000000000000000456E65726779',
                    topic0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    topic1: '0x0000000000000000000000006d95e6dca01d109882fe1726a2fb9865fa41e7aa'
                }
            ],
            order: 'asc'
        } satisfies EventLogFilterRequestJSON;
        const r = await QuerySmartContractEvents.of(request).askTo(
            FetchHttpClient.at(ThorNetworks.TESTNET)
        );
        log.debug(fastJsonStableStringify(r));
    });
});
