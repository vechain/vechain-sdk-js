import { InvalidTransactionField } from '@common/errors';
import { FetchHttpClient } from '@common/http';
import { Address, Revision } from '@common/vcdm';
import { beforeAll, describe, expect, test } from '@jest/globals';
import { Clause, ThorClient } from '@thor/thor-client';
import { TransactionBuilder } from '@thor/thor-client/transactions/TransactionBuilder';
import { ThorNetworks } from '@thor/utils/const/network';

/**
 * @group solo
 */
describe('TransactionBuilder SOLO tests', () => {
    let httpClient: FetchHttpClient;
    let sender: Address;
    let receiver: Address;
    let clauses: Clause[];
    let thorClient: ThorClient;

    beforeAll(() => {
        httpClient = FetchHttpClient.at(new URL(ThorNetworks.SOLONET));
        // sender is 2nd solo account
        sender = Address.of('0x435933c8064b4ae76be665428e0307ef2ccfbd68');
        // receiver is 1st solo account
        receiver = Address.of('0xf077b491b355e64048ce21e3a6fc4751eeea77fa');
        clauses = [new Clause(receiver, 1n)];
        thorClient = ThorClient.fromHttpClient(httpClient);
    });

    test('create transaction with all defaults', async () => {
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
    test('create transaction without calling withDynFeeTxDefaults or withLegacyFeeTxDefaults', async () => {
        const builder = TransactionBuilder.create(thorClient);
        const transaction = await builder
            .withClauses(clauses)
            .withEstimatedGas(sender, {
                revision: Revision.BEST
            })
            .build();
        // expect dynamic fee defaults
        expect(transaction.gasPriceCoef).toBeUndefined(); // defaults to dynamic fee
        expect(transaction.maxFeePerGas).toBeGreaterThan(0n);
        expect(transaction.maxPriorityFeePerGas).toBeGreaterThanOrEqual(0n);
    });
    test('create transaction with block ref not set by the user', async () => {
        const builder = TransactionBuilder.create(thorClient);
        const transaction = await builder
            .withClauses(clauses)
            .withEstimatedGas(sender, {
                revision: Revision.BEST
            })
            .build();
        // expect block ref to be set by the builder
        expect(transaction.blockRef.bi).toBeGreaterThan(0n);
    });
    test('create transaction with chain tag not set by the user', async () => {
        const builder = TransactionBuilder.create(thorClient);
        const transaction = await builder
            .withClauses(clauses)
            .withEstimatedGas(sender, {
                revision: Revision.BEST
            })
            .build();
        // expect chain tag to be set by the builder
        expect(transaction.chainTag).toBeGreaterThan(0);
    });
    test('create transaction with nonce not set by the user', async () => {
        const builder = TransactionBuilder.create(thorClient);
        const transaction = await builder
            .withClauses(clauses)
            .withEstimatedGas(sender, {
                revision: Revision.BEST
            })
            .build();
        // expect nonce to be set by the builder
        expect(transaction.nonce).toBeGreaterThan(0);
    });
    test('create transaction with gas estimation not set by the user', async () => {
        const builder =
            TransactionBuilder.create(thorClient).withClauses(clauses);
        // expect error on build as user did not call withEstimatedGas
        await expect(async () => await builder.build()).rejects.toThrow(
            new InvalidTransactionField(
                'TransactionBuilder.build',
                'Gas estimation was not called, cannot build transaction'
            )
        );
    });
});
