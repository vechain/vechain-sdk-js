import { FetchHttpClient } from '@common/http';
import { Address, Revision } from '@common/vcdm';
import { describe, expect, test } from '@jest/globals';
import { Clause, ThorClient } from '@thor/thor-client';
import { TransactionBuilder } from '@thor/thor-client/transactions/TransactionBuilder';
import { ThorNetworks } from '@thor/thorest/utils';

/**
 * @group solo
 */
describe('TransactionBuilder SOLO tests', () => {
    test('create transaction with all defaults', async () => {
        const thorClient = ThorClient.at(
            FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
        );
        // receiver is 1st solo account
        // sender is 2nd solo account
        const sender = Address.of('0x435933c8064b4ae76be665428e0307ef2ccfbd68');
        const receiver = Address.of(
            '0xf077b491b355e64048ce21e3a6fc4751eeea77fa'
        );
        // send 1 wei VET to receiver
        const clauses = [new Clause(receiver, 1n)];
        const builder = TransactionBuilder.create(thorClient);
        const transaction = await builder
            .withClauses(clauses)
            .withDynFeeTxDefaults()
            .withEstimatedGas(sender, {
                revision: Revision.BEST
            })
            .build();
        // expect all defaults
        expect(transaction.clauses).toHaveLength(1);
        expect(transaction.clauses[0].to).toEqual(receiver);
        expect(transaction.clauses[0].value).toEqual(1n);
        expect(transaction.blockRef.bi).toBeGreaterThan(0n);
        expect(transaction.chainTag).toBeGreaterThan(0);
        expect(transaction.expiration).toBe(
            TransactionBuilder.DEFAULT_EXPIRATION
        );
        expect(transaction.gasPriceCoef).toBeUndefined(); // defaults to dynamic fee
        expect(transaction.maxFeePerGas).toBeGreaterThan(0n);
        expect(transaction.maxPriorityFeePerGas).toBeGreaterThanOrEqual(0n);
        expect(transaction.nonce).toBeGreaterThan(0);
        expect(transaction.isIntendedToBeSponsored).toBe(false);
        expect(transaction.gas).toBeGreaterThanOrEqual(21000n); // VET transfer is >= 21000 gas
    });
});
