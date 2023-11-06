import { describe, test, expect } from '@jest/globals';
import { ThorClient } from '../../src/client/thor/thor-client';
import { network } from './fixture';

/**
 * SimpleNet class tests
 * @group integration/account
 */
describe('account', () => {
    test('account 1', async () => {
        const client = await ThorClient.connect(network);
        const account = await client.getAccount(
            '0xc3bE339D3D20abc1B731B320959A96A08D479583'
        );
        expect(account).toBeDefined();
    });
});
