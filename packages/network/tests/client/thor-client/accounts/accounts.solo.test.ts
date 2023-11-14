import { describe, expect, test } from '@jest/globals';
import { TEST_ACCOUNTS, thorSoloClient } from '../../../fixture';
import { unitsUtils } from '@vechain-sdk/core';

/**
 * Prolong timeout due to block time which sometimes exceeds jest's default timeout of 5 seconds.
 */
const TIMEOUT = 20000;

/**
 * ThorClient - AccountClient class tests
 *
 * @group integration/client/thor/accounts
 */
describe('ThorClient - Accounts', () => {
    /**
     * getAccount tests
     */
    describe('getAccount', () => {
        /**
         * Tests VET balance and VTHO balance of test account
         * Checks also if VTHO is generated after a block is produced due to positive VET balance
         */
        test(
            'Get account returns fixed VET balance and increased VTHO balance with block number increase',
            async () => {
                const accountBefore = await thorSoloClient.accounts.getAccount(
                    TEST_ACCOUNTS.ACCOUNT.SIMPLE_ACCOUNT.address
                );

                expect(accountBefore).toBeDefined();

                // Thor-solo is being initialized with 500000000 VET
                // And at least 500000000 VTHO
                expect(unitsUtils.formatVET(accountBefore.balance)).toEqual(
                    '500000000.0'
                );
                expect(Number(accountBefore.energy)).toBeGreaterThan(
                    unitsUtils.parseVET('500000000')
                );

                const currentBlock =
                    await thorSoloClient.blocks.getBlock('best');

                if (currentBlock !== null) {
                    let latestBlock;

                    // Wait for a block greater than currentBlock
                    do {
                        latestBlock =
                            await thorSoloClient.blocks.getBlock('best');
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                        );
                    } while (
                        latestBlock !== null &&
                        currentBlock.number === latestBlock.number
                    );
                }

                const accountAfter = await thorSoloClient.accounts.getAccount(
                    TEST_ACCOUNTS.ACCOUNT.SIMPLE_ACCOUNT.address
                );

                expect(accountAfter).toBeDefined();
                expect(accountAfter.balance).toEqual(accountBefore.balance);
                expect(Number(accountAfter.energy)).toBeGreaterThan(
                    Number(accountBefore.energy)
                );
            },
            TIMEOUT
        );
    });
});
