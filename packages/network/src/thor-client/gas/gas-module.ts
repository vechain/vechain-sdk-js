import { type EstimateGasOptions, type EstimateGasResult } from './types';
import { type SimulateTransactionClause } from '../transactions/types';
import { type TransactionsModule } from '../transactions';

/**
 * The `GasModule` handles gas related operations and provides
 * convenient methods for estimating the gas cost of a transaction.
 */
class GasModule {
    readonly transactionsModule: TransactionsModule;

    constructor(transactionsModule: TransactionsModule) {
        this.transactionsModule = transactionsModule;
    }

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
        return await this.transactionsModule.estimateGas(
            clauses,
            caller,
            options
        );
    }
}

export { GasModule };
