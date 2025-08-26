import { describe, expect, test } from '@jest/globals';
import { THOR_SOLO_URL, ThorClient } from '../../../src';
import { Address, Clause, VTHO, Units, ZERO_ADDRESS } from '@vechain/sdk-core';

/**
 * Tests for the executeCall method in transactions module
 *
 *  @group integration/clients/thor-client/transactions
 */
describe('ThorClient - Transactions Module Execute Call', () => {
    let thorSoloClient: ThorClient;

    beforeAll(() => {
        thorSoloClient = ThorClient.at(THOR_SOLO_URL);
    });

    test('ok <- Can estimate gas with ContractClause from transferVTHOToken', async () => {
        const vthoTransferClauses = [
            Clause.transferVTHOToken(
                Address.of(ZERO_ADDRESS),
                VTHO.of(100, Units.wei)
            ),
            Clause.transferVTHOToken(
                Address.of(ZERO_ADDRESS),
                VTHO.of(200, Units.wei)
            )
        ];

        const gas =
            await thorSoloClient.transactions.estimateGas(vthoTransferClauses);
        expect(gas.totalGas).toBeGreaterThan(0);
    });
});
