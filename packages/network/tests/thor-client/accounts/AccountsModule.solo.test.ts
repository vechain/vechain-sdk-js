import { describe, expect, test } from '@jest/globals';
import { THOR_SOLO_ACCOUNTS, THOR_SOLO_URL, ThorClient } from '../../../src';
import { Address, VET, VTHO } from '@vechain/sdk-core';
import { access } from 'fs-extra';

const ACCOUNT_ADDRESS = Address.of(THOR_SOLO_ACCOUNTS[0].address);

/**
 * Prolong timeout due to block time which sometimes exceeds jest's default timeout of 5 seconds.
 */
const TIMEOUT = 20000;

/**
 * Test AccountsModule class.
 *
 * @group integration/network/thor-client
 */
describe('AccountsModule solo tests', () => {
    const thorClient = ThorClient.at(THOR_SOLO_URL);

    describe('getAccount method tests', () => {
        test(
            'x',
            async () => {
                const expected = {
                    vet: VET.of(500000000n),
                    vtho: VTHO.of(500000000n)
                };
                const beforeAccountDetail =
                    await thorClient.accounts.getAccount(ACCOUNT_ADDRESS);
                expect(beforeAccountDetail.vet).toEqual(expected.vet);
                expect(beforeAccountDetail.vtho).toEqual(expected.vtho);
            },
            TIMEOUT
        );
    });

    describe('getByteCode method tests', () => {});

    describe('getStorageAt method tests', () => {});
});
