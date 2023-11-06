import { describe, test, expect } from '@jest/globals';
import { ThorClient } from '../../src/client/thor/thor-client';
import { network, testAccount, revision } from './fixture';

/**
 * Integration tests for account-related functionality.
 *
 * @group integration/account
 */
describe('Account', () => {
    test('Should retrieve account information successfully', async () => {
        const client = await ThorClient.connect(network);
        const account = await client.getAccount(testAccount);
        expect(account).toBeDefined();
    });

    test('Should retrieve account information successfully with revision', async () => {
        const client = await ThorClient.connect(network);
        const account = await client.getAccount(testAccount, revision);
        expect(account).toBeDefined();
    });

    test('Should give an error for passing wrong address', async () => {
        const client = await ThorClient.connect(network);

        await expect(client.getAccount('wrong-address')).rejects.toThrowError(
            '400 get /accounts/wrong-address: address: invalid length'
        );
    });

    test('Should retrieve account code successfully', async () => {
        const client = await ThorClient.connect(network);
        const accountCode = await client.getCode(testAccount);
        expect(accountCode).toBeDefined();
    });

    test('Should retrieve account storage successfully', async () => {
        const client = await ThorClient.connect(network);
        const storageKey =
            '0x0000000000000000000000000000000000000000000000000000000000000001';
        const accountStorage = await client.getStorage(testAccount, storageKey);
        expect(accountStorage).toBeDefined();
    });
});
