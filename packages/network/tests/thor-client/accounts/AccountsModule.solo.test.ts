import { describe, expect, test } from '@jest/globals';
import { THOR_SOLO_URL, ThorClient } from '../../../src';
import { Address, Hex } from '@vechain/sdk-core';
import { configData } from '../../fixture';
import { retryOperation } from '../../test-utils';

const CONTRACT_ADDRESS = configData.TESTING_CONTRACT_ADDRESS;

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

    test(
        'ok <- contract address',
        async () => {
            const expected = Hex.of(configData.TESTING_CONTRACT_BYTECODE);
            const actual = await retryOperation(async () => {
                return await thorClient.accounts.getBytecode(
                    Address.of(CONTRACT_ADDRESS)
                );
            });
            expect(actual).toEqual(expected);
        },
        TIMEOUT
    );
});
