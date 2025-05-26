import { describe, expect, test } from '@jest/globals';
import { THOR_SOLO_URL, ThorClient } from '../../../src';
import { Address, Hex } from '@vechain/sdk-core';
import { configData } from '../../fixture';

const CONTRACT_ADDRESS = configData.TESTING_CONTRACT_ADDRESS;

/**
 * Prolong timeout due to block time which sometimes exceeds jest's default timeout of 5 seconds.
 */
const TIMEOUT = 30000;

/**
 * Test AccountsModule class.
 *
 * @group integration/network/thor-client
 */
describe('AccountsModule solo tests', () => {
    // Add retry configuration for all tests in this suite
    jest.retryTimes(3, { logErrorsBeforeRetry: true });

    const thorClient = ThorClient.at(THOR_SOLO_URL);

    describe('getByteCode method tests', () => {
        test(
            'ok <- contract address',
            async () => {
                const actual = await thorClient.accounts.getBytecode(
                    Address.of(CONTRACT_ADDRESS)
                );
                expect(
                    actual.isEqual(Hex.of(configData.TESTING_CONTRACT_BYTECODE))
                ).toBe(true);
            },
            TIMEOUT
        );
    });
});
