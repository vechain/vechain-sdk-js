import { describe, expect, test } from '@jest/globals';
import { transactionFixtures } from './fixture';
import { transactionsFormatter } from '../../../src';

/**
 * Transactions formatter unit test
 * @group unit/provider/formatter/transactions
 */
describe('Transactions formatter unit test', () => {
    /**
     * Should be able to format a block
     */
    transactionFixtures.forEach((transactionFixture) => {
        test(transactionFixture.testName, () => {
            const formattedTransaction =
                transactionsFormatter.formatToRPCStandard(
                    transactionFixture.transaction,
                    '0x0',
                    0
                );
            expect(formattedTransaction).toStrictEqual(
                transactionFixture.expected
            );
        });
    });
});
