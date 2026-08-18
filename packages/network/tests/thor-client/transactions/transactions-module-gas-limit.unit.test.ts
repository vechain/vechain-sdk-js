import { describe, expect, jest, test } from '@jest/globals';
import { Transaction, type TransactionClause } from '@vechain/sdk-core';
import { InvalidTransactionField } from '@vechain/sdk-errors';
import { TESTNET_URL, ThorClient } from '../../../src';

/**
 * TransactionsModule.buildTransactionBody() gas limit cap unit tests.
 *
 * The *Interstellar* hard fork adopts EIP-7825, which caps the gas limit of a
 * single transaction to 2^24. The module refuses to build such a body instead of
 * letting the node reject the broadcast.
 *
 * @group unit/clients/thor-client/transactions
 */
describe('buildTransactionBody() gas limit cap (EIP-7825) unit tests', () => {
    const clauses: TransactionClause[] = [
        {
            to: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
            value: 0,
            data: '0x'
        }
    ];

    test('exception <- gas argument above the EIP-7825 cap', async () => {
        const client = ThorClient.at(TESTNET_URL);
        const spy = jest.spyOn(client.blocks, 'getBlockCompressed');
        await expect(
            client.transactions.buildTransactionBody(
                clauses,
                Transaction.MAX_GAS_LIMIT + 1
            )
        ).rejects.toThrow(InvalidTransactionField);
        // The cap is checked before any network call is made.
        expect(spy).not.toHaveBeenCalled();
    });

    test('exception <- options.gas above the EIP-7825 cap', async () => {
        const client = ThorClient.at(TESTNET_URL);
        await expect(
            client.transactions.buildTransactionBody(clauses, 21000, {
                gas: Transaction.MAX_GAS_LIMIT + 1
            })
        ).rejects.toThrow(InvalidTransactionField);
    });

    test('transaction body <- gas exactly at the EIP-7825 cap', async () => {
        const client = ThorClient.at(TESTNET_URL);
        jest.spyOn(client.blocks, 'getBlockCompressed').mockResolvedValue({
            id: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127'
        } as unknown as Awaited<
            ReturnType<typeof client.blocks.getBlockCompressed>
        >);
        jest.spyOn(client.blocks, 'getBestBlockRef').mockResolvedValue(
            '0x00000000aabbccdd'
        );
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(
            false
        );
        const body = await client.transactions.buildTransactionBody(
            clauses,
            Transaction.MAX_GAS_LIMIT
        );
        expect(body.gas).toBe(Transaction.MAX_GAS_LIMIT);
    });
});
