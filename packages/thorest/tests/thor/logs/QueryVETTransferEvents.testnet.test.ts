import { describe, test } from '@jest/globals';
import { type TransferLogFilterRequestJSON } from '../../../src/thor/logs/TransferLogFilterRequest';
import { QueryVETTransferEvents } from '../../../src/thor/logs/QueryVETTransferEvents';
import { FetchHttpClient, ThorNetworks } from '../../../src';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

const logger = log.getLogger(
    'TEST:UNIT!packages/thorest/tests/thor/logs/QueryVETTransferEvents.testnet.test.ts'
);

describe('QueryVETTransferEvents testnet tests', () => {
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
                    txOrigin: '0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa',
                    sender: '0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa',
                    recipient: '0x45429a2255e7248e57fce99e7239aed3f84b7a53'
                }
            ],
            order: 'asc'
        } satisfies TransferLogFilterRequestJSON;
        const r = await QueryVETTransferEvents.of(request).askTo(
            FetchHttpClient.at(ThorNetworks.TESTNET)
        );
        logger.debug(fastJsonStableStringify(r));
    });
});
