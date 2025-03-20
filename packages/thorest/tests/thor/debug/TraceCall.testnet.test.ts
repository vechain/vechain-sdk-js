import { describe, test } from '@jest/globals';
import {
    type PostDebugTracerCallRequestJSON,
    TraceCall
} from '../../../src/thor/debug';
import { FetchHttpClient, ThorNetworks } from '../../../src';
import log from 'loglevel';
import fastJsonStableStringify from 'fast-json-stable-stringify';

const logger = log.getLogger(
    'TEST:UNIT!packages/thorest/tests/thor/debug/TraceCall.testnet.test.ts'
);

describe('TraceCall testnet tests', () => {
    test('ok <- askTo', async () => {
        const request = {
            value: '0x0',
            to: '0x0000000000000000000000000000456E65726779',
            data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000',
            gas: 50000,
            gasPrice: '1000000000000000',
            caller: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            provedWork: '1000',
            gasPayer: '0xd3ae78222beadb038203be21ed5ce7c9b1bff602',
            expiration: 1000,
            blockRef: '0x00000000851caf3c',
            name: 'call'
        } satisfies PostDebugTracerCallRequestJSON;
        const r = await TraceCall.of(request).askTo(
            FetchHttpClient.at(ThorNetworks.TESTNET)
        );
        logger.debug(fastJsonStableStringify(r));
    });
});
