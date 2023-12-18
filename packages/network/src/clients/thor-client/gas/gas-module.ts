import { DATA, assert } from '@vechainfoundation/vechain-sdk-errors';
import {
    type SimulateTransactionClause,
    type SimulateTransactionOptions,
    type ThorestClient
} from '../../thorest-client';
import { type EstimateGasResult } from './types';
import { TransactionUtils } from '@vechainfoundation/vechain-sdk-core';
import { decodeRevertReason } from './helpers/decode-evm-error';

/**
 * The `GasModule` handles gas related operations and provides
 * convenient methods for estimating the gas cost of a transaction.
 */
class GasModule {
    /**
     * Initializes a new instance of the `TransactionsModule` class.
     * @param httpClient - The HTTP client instance used for making HTTP requests.
     */
    constructor(readonly thorest: ThorestClient) {}

    /**
     * Simulates a transaction and returns an object containing information regarding the gas used and whether the transaction reverted.
     *
     * @param clauses - The clauses of the transaction to simulate.
     * @param options - Optional parameters for the request. Includes all options of the `simulateTransaction` method.
     *                  @see {@link TransactionsClient#simulateTransaction}
     *
     * @returns An object containing information regarding the gas used and whether the transaction reverted, together with the decoded revert reason and VM errors.
     *
     * @throws an error if the clauses are invalid or if an error occurs during the simulation.
     */
    public async estimateGas(
        clauses: SimulateTransactionClause[],
        options?: SimulateTransactionOptions
    ): Promise<EstimateGasResult> {
        // Clauses must be an array of clauses with at least one clause
        assert(
            clauses.length > 0,
            DATA.INVALID_DATA_TYPE,
            'Invalid clauses. Clauses must be an array of clauses with at least one clause.'
        );

        // Simulate the transaction to get the simulations of each clause
        const simulations = await this.thorest.transactions.simulateTransaction(
            clauses,
            options
        );

        // If any of the clauses reverted, then the transaction reverted
        const isReverted = simulations.some((simulation) => {
            return simulation.reverted;
        });

        // The intrinsic gas of the transaction
        const instrinsicGas = TransactionUtils.intrinsicGas(clauses);

        // totalSimulatedGas represents the summation of all clauses' gasUsed
        const totalSimulatedGas = simulations.reduce((sum, simulation) => {
            return sum + simulation.gasUsed;
        }, 0);

        // The total gas of the transaction
        const totalGas = instrinsicGas + totalSimulatedGas;

        return isReverted
            ? {
                  totalGas,
                  reverted: true,
                  revertReasons: simulations.map((simulation) => {
                      /**
                       * The decoded revert reason of the transaction.
                       * Solidity may revert with Error(string) or Panic(uint256).
                       *
                       * @link see [Error handling: Assert, Require, Revert and Exceptions](https://docs.soliditylang.org/en/latest/control-structures.html#error-handling-assert-require-revert-and-exceptions)
                       */
                      return decodeRevertReason(simulation.data) ?? '';
                  }),
                  vmErrors: simulations.map((simulation) => {
                      return simulation.vmError;
                  })
              }
            : {
                  totalGas,
                  reverted: false,
                  revertReasons: [],
                  vmErrors: []
              };
    }
}

export { GasModule };
