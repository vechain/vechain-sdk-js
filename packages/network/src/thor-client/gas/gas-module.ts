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
     * This method is going to be deprecated in next release.
     * Use {@link TransactionsModule.estimateGas} instead.
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
