import {
    Account,
    type AccountPoll
} from '../../../../src/thor-client/accounts/experimental/Account';
import { THOR_SOLO_URL, ThorClient } from '../../../../src';
import { beforeEach, describe, test } from '@jest/globals';

describe('Account class tests', () => {
    // ThorClient instance
    let thorSoloClient: ThorClient;

    beforeEach(() => {
        thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL);
    });

    test('x', async () => {
        const account = new Account(
            '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa'
        );
        const accountPoll: AccountPoll = await account.poll(thorSoloClient);
        console.log(accountPoll);
    });
});
