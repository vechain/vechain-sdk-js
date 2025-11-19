import { type FeeHistoryResponse, type FeeHistoryOptions, type EstimateGasOptions, type EstimateGasResult } from './types';
import { type HttpClient } from '../../http';
import { ContractClause } from '@vechain/sdk-core';
import { type SimulateTransactionClause } from '../transactions/types';
interface TransactionModuleInterface {
    estimateGas: (clauses: (SimulateTransactionClause | ContractClause)[], caller?: string, options?: EstimateGasOptions) => Promise<EstimateGasResult>;
}
/**
 * The `GasModule` handles gas related operations and provides
 * convenient methods for estimating the gas cost of a transaction.
 */
declare class GasModule {
    readonly httpClient: HttpClient;
    protected transactionsModule: TransactionModuleInterface | null;
    constructor(httpClient: HttpClient);
    /**
     * Sets the transactions module.
     *
     * @param transactionsModule - The transactions module to set.
     */
    setTransactionsModule(transactionsModule: TransactionModuleInterface): void;
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
    estimateGas(clauses: (SimulateTransactionClause | ContractClause)[], caller?: string, options?: EstimateGasOptions): Promise<EstimateGasResult>;
    /**
     * Returns the suggested priority fee per gas in wei.
     * This is calculated based on the current base fee and network conditions.
     *
     * @returns Suggested priority fee per gas in wei (hex string)
     * @throws {InvalidDataType}
     */
    getMaxPriorityFeePerGas(): Promise<string>;
    /**
     * Returns fee history for the returned block range.
     *
     * @param options - The options for the fee history request
     * @returns Fee history for the returned block range
     * @throws {InvalidDataType}
     */
    getFeeHistory(options: FeeHistoryOptions): Promise<FeeHistoryResponse>;
    /**
     * Returns the base fee per gas of the next block.
     * @returns The base fee per gas of the next block.
     */
    getNextBlockBaseFeePerGas(): Promise<bigint | null>;
}
export { GasModule };
//# sourceMappingURL=gas-module.d.ts.map