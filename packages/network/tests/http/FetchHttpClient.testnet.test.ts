import { describe, expect, test } from '@jest/globals';
import { FetchHttpClient } from '../../src/http';
import { TESTNET_URL } from '../../src';
import { ZERO_ADDRESS } from '../fixture';
import { stringifyData } from '@vechain/sdk-errors';

const TIMEOUT = 10000;

const GENESIS_BLOCK = {
    number: 0,
    id: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
    size: 170,
    parentID:
        '0xffffffff00000000000000000000000000000000000000000000000000000000',
    timestamp: 1530014400,
    gasLimit: 10000000,
    beneficiary: ZERO_ADDRESS,
    gasUsed: 0,
    totalScore: 0,
    txsRoot:
        '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    txsFeatures: 0,
    stateRoot:
        '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
    receiptsRoot:
        '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    com: false,
    signer: ZERO_ADDRESS,
    isTrunk: true,
    isFinalized: true,
    transactions: []
};

/**
 * Test FetchHttpClient class.
 *
 * @group integration/network
 */
describe('FetchHttpClient testnet tests', () => {
    describe('GET method tests', () => {
        test(
            'ok <- GET /block/latest',
            async () => {
                const httpClient = new FetchHttpClient(TESTNET_URL);
                const response = await httpClient.get(
                    '/blocks/0?expanded=false'
                );
                const expected = stringifyData(GENESIS_BLOCK);
                const actual = stringifyData(response);
                expect(actual).toEqual(expected);
            },
            TIMEOUT
        );

        /*
        NOTE: this test doesn't succeed in CI/CD.
        Enable locally to challenge a real time-out calling testnet.
         */
        // test('timeout <- GET in 1 ms', async () => {
        //     const httpClient = new FetchHttpClient(TESTNET_URL, 0);
        //     try {
        //         await httpClient.get('/blocks/0?expanded=false');
        //         fail();
        //     } catch (error) {
        //         expect(error).toBeInstanceOf(InvalidHTTPRequest);
        //         const innerError = (error as InvalidHTTPRequest).innerError;
        //         expect(innerError).toBeInstanceOf(DOMException);
        //         expect((innerError as DOMException).name).toBe('AbortError');
        //     }
        // });
    });
});
