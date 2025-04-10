import {
    type EstimateGasOptions,
    type EstimateGasResult,
    type FeesPriorityResponse,
    type FeeHistoryResponse,
    type FeeHistoryOptions
} from './types';
import { type SimulateTransactionClause } from '../transactions/types';
import { type TransactionsModule } from '../transactions';
import { InvalidDataType } from '@vechain/sdk-errors';
import { HttpMethod, type HttpClient } from '../../http';
import { Revision } from '@vechain/sdk-core';
import { thorest } from '../../utils';

/**
 * The `GasModule` handles gas related operations and provides
 * convenient methods for estimating the gas cost of a transaction.
 */
class GasModule {
    readonly transactionsModule: TransactionsModule;
    readonly httpClient: HttpClient;

    constructor(
        transactionsModule: TransactionsModule,
        httpClient: HttpClient
    ) {
        this.transactionsModule = transactionsModule;
        this.httpClient = httpClient;
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

    /**
     * Returns the suggested priority fee per gas in wei.
     * This is calculated based on the current base fee and network conditions.
     *
     * @returns Suggested priority fee per gas in wei (hex string)
     * @throws {InvalidDataType}
     */
    public async getMaxPriorityFeePerGas(): Promise<string> {
        const response = (await this.httpClient.get(
            '/fees/priority'
        )) as FeesPriorityResponse;

        // Validate response
        if (
            response === null ||
            response === undefined ||
            typeof response !== 'object'
        ) {
            throw new InvalidDataType(
                'getMaxPriorityFeePerGas()',
                'Invalid response format from /fees/priority endpoint',
                { response }
            );
        }

        if (
            response.maxPriorityFeePerGas === undefined ||
            response.maxPriorityFeePerGas === null ||
            response.maxPriorityFeePerGas === '' ||
            typeof response.maxPriorityFeePerGas !== 'string'
        ) {
            throw new InvalidDataType(
                'getMaxPriorityFeePerGas()',
                'Missing or invalid maxPriorityFeePerGas in response',
                { response }
            );
        }

        return response.maxPriorityFeePerGas;
    }

    /**
     * Returns fee history for the returned block range.
     *
     * @param options - The options for the fee history request
     * @returns Fee history for the returned block range
     * @throws {InvalidDataType}
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
            throw new InvalidDataType(
                'getFeeHistory()',
                'Invalid blockCount parameter',
                { options }
            );
        }

        if (
            options.newestBlock !== null &&
            options.newestBlock !== undefined &&
            !Revision.isValid(options.newestBlock)
        ) {
            throw new InvalidDataType(
                'getFeeHistory()',
                'Invalid revision. The revision must be a string representing a block number or block id (also "best" is accepted which represents the best block & "finalized" for the finalized block).',
                { options }
            );
        }

        const response = await this.httpClient.http(
            HttpMethod.GET,
            thorest.fees.get.FEES_HISTORY(
                options.blockCount,
                options.newestBlock,
                options.rewardPercentiles
            )
        );
        if (
            response === null ||
            response === undefined ||
            typeof response !== 'object'
        ) {
            throw new InvalidDataType(
                'getFeeHistory()',
                'Invalid response format from /fee_history endpoint',
                { response }
            );
        }

        return response as FeeHistoryResponse;
    }
}

export { GasModule };
