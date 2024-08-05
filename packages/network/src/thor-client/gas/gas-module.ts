import { InvalidDataType } from '@vechain/sdk-errors';
import type { SimulateTransactionClause } from '../transactions';
import { type EstimateGasOptions, type EstimateGasResult } from './types';
import { TransactionUtils } from '@vechain/sdk-core';
import { decodeRevertReason } from './helpers/decode-evm-error';
import { type ThorClient } from '../thor-client';

/**
 * The `GasModule` handles gas related operations and provides
 * convenient methods for estimating the gas cost of a transaction.
 */
class GasModule {
    /**
     * Initializes a new instance of the `Thor` class.
     * @param thor - The Thor instance used to interact with the VeChain blockchain API.
     */
    constructor(readonly thor: ThorClient) {}

    /**
     * Simulates a transaction and returns an object containing information regarding the gas used and whether the transaction reverted.
     *
     * @note The caller option is suggested as estimation without this parameter may not be accurate.
     *
     * @param clauses - The clauses of the transaction to simulate.
     * @param caller - The address of the account sending the transaction.
     * @param options - Optional parameters for the request. Includes all options of the `simulateTransaction` method excluding the `caller` option.
     *                  @see {@link TransactionsClient#simulateTransaction}
     *                  Also, includes the `gasPadding` option which is a percentage of gas to add on top of the estimated gas. The value must be between (0, 1].
     * @returns An object containing information regarding the gas used and whether the transaction reverted, together with the decoded revert reason and VM errors.
     * @throws{InvalidDataType}
     */
    public async estimateGas(
        clauses: SimulateTransactionClause[],
        caller?: string,
        options?: EstimateGasOptions
    ): Promise<EstimateGasResult> {
        // Clauses must be an array of clauses with at least one clause
        if (clauses.length <= 0) {
            throw new InvalidDataType(
                'GasModule.estimateGas()',
                'Invalid clauses. Clauses must be an array of clauses with at least one clause.',
                { clauses, caller, options }
            );
        }

        // gasPadding must be a number between (0, 1]
        if (
            options?.gasPadding !== undefined &&
            (options.gasPadding <= 0 || options.gasPadding > 1)
        ) {
            throw new InvalidDataType(
                'GasModule.estimateGas()',
                'Invalid gasPadding. gasPadding must be a number between (0, 1].',
                { gasPadding: options?.gasPadding }
            );
        }

        // Simulate the transaction to get the simulations of each clause
        const simulations = await this.thor.transactions.simulateTransaction(
            clauses,
            {
                caller,
                ...options
            }
        );

        // If any of the clauses reverted, then the transaction reverted
        const isReverted = simulations.some((simulation) => {
            return simulation.reverted;
        });

        // The intrinsic gas of the transaction
        const intrinsicGas = TransactionUtils.intrinsicGas(clauses);

        // totalSimulatedGas represents the summation of all clauses' gasUsed
        const totalSimulatedGas = simulations.reduce((sum, simulation) => {
            return sum + simulation.gasUsed;
        }, 0);

        // The total gas of the transaction
        // If the transaction involves contract interaction, a constant 15000 gas is added to the total gas
        const totalGas =
            (intrinsicGas +
                (totalSimulatedGas !== 0 ? totalSimulatedGas + 15000 : 0)) *
            (1 + (options?.gasPadding ?? 0)); // Add gasPadding if it is defined

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
