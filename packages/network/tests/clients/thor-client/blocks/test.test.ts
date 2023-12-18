import { describe, expect, test } from '@jest/globals';
import { HttpClient, ThorClient, ThorestClient } from '../../../../src';

/**
 * Blocks Module integration tests
 *
 * @group test
 */
// describe('test', () => {
//     let thorClientNew: ThorClient;
//     beforeEach(() => {
//         const httpClient = new HttpClient('http://testnet.veblocks.net');
//         const thorestClient = new ThorestClient(httpClient);
//         thorClientNew = new ThorClient(thorestClient);
//     });

//     afterEach(() => {
//         thorClientNew.blocks.destroy();
//     });
//     test('test', () => {
//         const bestBlock = thorClientNew.thorest.blocks.getBestBlock();
//         expect(bestBlock).toBeDefined();
//     });
// });

describe('test', () => {
    test('test', () => {
        const httpClient = new HttpClient('http://testnet.veblocks.net');
        const thorestClient = new ThorestClient(httpClient);
        const thorClientNew = new ThorClient(thorestClient);

        const account = thorClientNew.thorest.accounts.getAccount(
            '0x5034aa590125b64023a0262112b98d72e3c8e40e'
        );
        console.log(account);
        // thorClientNew.blocks.destroy();
        expect(account).toBeDefined();
    });
});
