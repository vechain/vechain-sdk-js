import { type EstimateGasOptions, type EstimateGasResult, type FeesPriorityResponse, type FeeHistoryResponse, type FeeHistoryOptions } from './types';
import { type SimulateTransactionClause } from '../transactions/types';
import { type TransactionsModule } from '../transactions';
import { JSONRPCInternalError, JSONRPCInvalidParams, stringifyData } from '@vechain/sdk-errors';
import { type HttpClient } from '../../http';
import { RPC_DOCUMENTATION_URL } from '../../utils';

/**
 * The `GasModule` handles gas related operations and provides
 * convenient methods for estimating the gas cost of a transaction.
 */
class GasModule {
    readonly transactionsModule: TransactionsModule;
    readonly httpClient: HttpClient;

    constructor(transactionsModule: TransactionsModule, httpClient: HttpClient) {
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
     * @throws {JSONRPCInternalError}
     */
    public async getMaxPriorityFeePerGas(): Promise<string> {
        try {
            const response = (await this.httpClient.get(
                '/fees/priority'
            )) as FeesPriorityResponse;

            // Validate response
            if (
                response === null ||
                response === undefined ||
                typeof response !== 'object'
            ) {
                throw new JSONRPCInternalError(
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
                throw new JSONRPCInternalError(
                    'getMaxPriorityFeePerGas()',
                    'Missing or invalid maxPriorityFeePerGas in response',
                    { response }
                );
            }

            return response.maxPriorityFeePerGas;
        } catch (e) {
            if (e instanceof JSONRPCInternalError) {
                throw e;
            }
            throw new JSONRPCInternalError(
                'getMaxPriorityFeePerGas()',
                'Method "getMaxPriorityFeePerGas" failed.',
                {
                    url: this.httpClient.baseURL,
                    innerError: stringifyData(e)
                }
            );
        }
    }

    /**
     * Returns fee history for the returned block range.
     * 
     * @param options - The options for the fee history request
     * @returns Fee history for the returned block range
     * @throws {JSONRPCInvalidParams}
     */
    public getFeeHistory(options: FeeHistoryOptions): Promise<FeeHistoryResponse> {
        if (!options || typeof options.blockCount !== 'number' || options.blockCount <= 0) {
            throw new JSONRPCInvalidParams(
                'getFeeHistory()',
                `Invalid blockCount parameter. See ${RPC_DOCUMENTATION_URL} for details.`,
                { options }
            );
        }

        if (!options.newestBlock) {
            throw new JSONRPCInvalidParams(
                'getFeeHistory()',
                `Missing newestBlock parameter. See ${RPC_DOCUMENTATION_URL} for details.`,
                { options }
            );
        }

        // For now, return a mock response
        // In a real implementation, this would call the appropriate endpoint
        return Promise.resolve({
            oldestBlock: '0x0',
            baseFeePerGas: [],
            gasUsedRatio: [],
            reward: []
        });
    }
}

export { GasModule };
