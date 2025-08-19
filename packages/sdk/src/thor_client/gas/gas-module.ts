import {
    type FeesPriorityResponse,
    type FeeHistoryResponse,
    type FeeHistoryOptions,
    type EstimateGasOptions,
    type EstimateGasResult
} from './types';
import { IllegalArgumentError } from '@errors';
import { type HttpClient } from '@http';
import { HexUInt, Revision } from '@vcdm';
import { thorest } from '../utils';
import { type SimulateTransactionClause } from '../transactions/types';

const FQP = 'packages/sdk/src/thor_client/gas/gas-module';

interface TransactionModuleInterface {
    estimateGas: (
        clauses: SimulateTransactionClause[],
        caller?: string,
        options?: EstimateGasOptions
    ) => Promise<EstimateGasResult>;
}

/**
 * The `GasModule` handles gas related operations and provides
 * convenient methods for estimating the gas cost of a transaction.
 */
class GasModule {
    readonly httpClient: HttpClient;
    protected transactionsModule: TransactionModuleInterface | null;

    constructor(httpClient: HttpClient) {
        this.httpClient = httpClient;
        this.transactionsModule = null;
    }

    /**
     * Sets the transactions module.
     *
     * @param transactionsModule - The transactions module to set.
     */
    public setTransactionsModule(
        transactionsModule: TransactionModuleInterface
    ): void {
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
     * @throws{IllegalArgumentError}
     */
    public async estimateGas(
        clauses: SimulateTransactionClause[],
        caller?: string,
        options?: EstimateGasOptions
    ): Promise<EstimateGasResult> {
        if (this.transactionsModule == null) {
            throw new IllegalArgumentError(
                `${FQP}.estimateGas()`,
                'Transactions module not set',
                {}
            );
        }
        return await this.transactionsModule.estimateGas(
            clauses,
            caller,
            options
        );
    }

    /**
     * Returns the suggested priority fee per gas in wei.
     * This is calculated based on the current base fee and network conditions.
     *
     * @returns Suggested priority fee per gas in wei (hex string)
     * @throws {IllegalArgumentError}
     */
    public async getMaxPriorityFeePerGas(): Promise<string> {
        const response = await this.httpClient.get(
            { path: '/fees/priority' },
            { query: '' }
        );
        const responseData = (await response.json()) as FeesPriorityResponse;

        // Validate response
        if (
            responseData === null ||
            responseData === undefined ||
            typeof responseData !== 'object'
        ) {
            throw new IllegalArgumentError(
                `${FQP}.getMaxPriorityFeePerGas()`,
                'Invalid response format from /fees/priority endpoint',
                { responseData }
            );
        }

        if (
            responseData.maxPriorityFeePerGas === undefined ||
            responseData.maxPriorityFeePerGas === null ||
            responseData.maxPriorityFeePerGas === '' ||
            typeof responseData.maxPriorityFeePerGas !== 'string'
        ) {
            throw new IllegalArgumentError(
                'getMaxPriorityFeePerGas()',
                'Missing or invalid maxPriorityFeePerGas in response',
                { responseData }
            );
        }

        return responseData.maxPriorityFeePerGas;
    }

    /**
     * Returns fee history for the returned block range.
     *
     * @param options - The options for the fee history request
     * @returns Fee history for the returned block range
     * @throws {IllegalArgumentError}
     */
    public async getFeeHistory(
        options: FeeHistoryOptions
    ): Promise<FeeHistoryResponse> {
        if (
            options === null ||
            options === undefined ||
            typeof options.blockCount !== 'number' ||
            !Number.isFinite(options.blockCount) ||
            options.blockCount <= 0
        ) {
            throw new IllegalArgumentError(
                `${FQP}.getFeeHistory()`,
                'Invalid blockCount parameter',
                { options }
            );
        }

        if (
            options.newestBlock !== null &&
            options.newestBlock !== undefined &&
            !Revision.isValid(options.newestBlock)
        ) {
            throw new IllegalArgumentError(
                `${FQP}.getFeeHistory()`,
                'Invalid revision. The revision must be a string representing a block number or block id (also "best" is accepted which represents the best block & "finalized" for the finalized block).',
                { options }
            );
        }

        const response = await this.httpClient.get(
            { path: thorest.fees.get.FEES_HISTORY() },
            {
                query: `?blockCount=${options.blockCount}${options.newestBlock ? `&newestBlock=${options.newestBlock}` : ''}${options.rewardPercentiles ? `&rewardPercentiles=${options.rewardPercentiles.join(',')}` : ''}`
            }
        );
        const responseData = await response.json();
        if (
            responseData === null ||
            responseData === undefined ||
            typeof responseData !== 'object'
        ) {
            throw new IllegalArgumentError(
                `${FQP}.getFeeHistory()`,
                'Invalid response format from /fees/history endpoint',
                { responseData }
            );
        }

        return responseData as FeeHistoryResponse;
    }

    /**
     * Returns the base fee per gas of the next block.
     * @returns The base fee per gas of the next block.
     */
    public async getNextBlockBaseFeePerGas(): Promise<bigint | null> {
        const options: FeeHistoryOptions = {
            blockCount: 1,
            newestBlock: 'next'
        };
        const feeHistory = await this.getFeeHistory(options);
        if (
            feeHistory.baseFeePerGas === null ||
            feeHistory.baseFeePerGas === undefined ||
            feeHistory.baseFeePerGas.length === 0
        ) {
            return null;
        }
        return HexUInt.of(feeHistory.baseFeePerGas[0]).bi;
    }
}

export { GasModule };
