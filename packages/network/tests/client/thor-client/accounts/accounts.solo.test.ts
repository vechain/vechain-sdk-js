import { describe, expect, test } from '@jest/globals';
import { TEST_ACCOUNTS, thorSoloClient } from '../../../fixture';

/**
 * Prolong timeout due to block time which sometimes exceeds jest's default timeout of 5 seconds.
 */
const TIMEOUT = 10000;

/**
 * ThorClient class tests
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
                    TEST_ACCOUNTS.account.address
                );

                expect(accountBefore).toBeDefined();
                expect(accountBefore.balance).toEqual(
                    '0x19d971e4fe8401e74000000'
                );
                expect(Number(accountBefore.energy)).toBeGreaterThan(
                    500000000 * 10 ** 18
                );

                const currentBlock =
                    await thorSoloClient.blocks.getBlock('best');

                let latestBlock;

                // Wait for a block greater than currentBlock
                do {
                    latestBlock = await thorSoloClient.blocks.getBlock('best');
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                } while (currentBlock.number === latestBlock.number);

                const accountAfter = await thorSoloClient.accounts.getAccount(
                    TEST_ACCOUNTS.account.address
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
