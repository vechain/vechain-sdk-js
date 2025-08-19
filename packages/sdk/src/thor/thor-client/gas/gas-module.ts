import { AbstractThorModule } from '../AbstractThorModule';
import { type HttpClient } from '../../../http';
import {
    RetrieveHistoricalFeeData,
    SuggestPriorityFee,
    type GetFeesHistoryResponse,
    type GetFeesPriorityResponse
} from '../../fees';
import { InspectClauses } from '../../accounts/methods';
import { type ExecuteCodesResponse } from '../../accounts/response';
import { Revision, HexUInt, Quantity } from '../../../vcdm';
import { Transaction, type TransactionClause } from '../../transactions';
import { IllegalArgumentError } from '../../../errors';
import { type ExecuteCodesRequestJSON } from '../../accounts/json/ExecuteCodesRequestJSON';

/**
 * Options for retrieving fee history.
 */
interface FeeHistoryOptions {
    /**
     * The number of blocks to return fee history for.
     */
    blockCount: number;

    /**
     * The newest block to include in the fee history.
     * Can be a block number, block ID, or special values like "best", "finalized", "next".
     */
    newestBlock?: Revision | null;

    /**
     * Array of percentiles (0-100) to calculate reward values for.
     */
    rewardPercentiles?: number[];
}

/**
 * Options for gas estimation.
 */
interface EstimateGasOptions {
    /**
     * The revision (block) to estimate gas at.
     */
    revision?: Revision;

    /**
     * Gas padding percentage to add on top of estimated gas (0, 1].
     */
    gasPadding?: number;
}

/**
 * The gas module of the VeChain Thor blockchain.
 * It provides methods for gas estimation, fee history, and priority fee suggestions.
 */
class GasModule extends AbstractThorModule {
    /**
     * Calculates the intrinsic gas required for the given transaction clauses.
     * This is the minimum gas required for a transaction.
     *
     * @param clauses - The transaction clauses to calculate intrinsic gas for.
     * @returns The intrinsic gas required.
     * @throws {IllegalArgumentError} If clauses contain invalid data.
     */
    public calculateIntrinsicGas(clauses: TransactionClause[]): bigint {
        return Transaction.intrinsicGas(clauses);
    }

    /**
     * Estimates the gas required for executing the given request.
     * This method follows the same pattern as PublicClient.estimateGas.
     *
     * @param request - The execute codes request containing transaction details.
     * @returns The execution response containing gas usage and other details.
     */
    public async estimateGas(
        request: ExecuteCodesRequestJSON
    ): Promise<ExecuteCodesResponse> {
        const inspectClause = await InspectClauses.of(request).askTo(
            this.httpClient
        );
        return inspectClause.response;
    }

    /**
     * Returns the suggested priority fee per gas.
     * This is calculated based on the current base fee and network conditions.
     *
     * @returns The suggested priority fee per gas as a bigint.
     */
    public async getMaxPriorityFeePerGas(): Promise<bigint> {
        const query = SuggestPriorityFee.of();
        const response = (await query.askTo(this.httpClient)).response;
        return response.maxPriorityFeePerGas;
    }

    /**
     * Returns fee history for the specified block range.
     *
     * @param options - The options for the fee history request.
     * @returns Fee history containing base fees, gas used ratios, and rewards.
     * @throws {IllegalArgumentError} If options are invalid.
     */
    public async getFeeHistory(
        options: FeeHistoryOptions
    ): Promise<GetFeesHistoryResponse> {
        // Validate blockCount
        if (
            options?.blockCount === null ||
            options?.blockCount === undefined ||
            typeof options.blockCount !== 'number' ||
            !Number.isFinite(options.blockCount) ||
            options.blockCount <= 0
        ) {
            throw new IllegalArgumentError(
                'GasModule.getFeeHistory()',
                'Invalid blockCount parameter. Must be a positive finite number.',
                { options }
            );
        }

        // Create and execute the query
        let query = RetrieveHistoricalFeeData.of(options.blockCount);

        if (options.newestBlock !== null && options.newestBlock !== undefined) {
            query = query.withNewestBlock(options.newestBlock);
        }

        if (options.rewardPercentiles && options.rewardPercentiles.length > 0) {
            query = query.withRewardPercentiles(options.rewardPercentiles);
        }

        const response = (await query.askTo(this.httpClient)).response;
        return response;
    }

    /**
     * Returns the base fee per gas of the next block.
     *
     * @returns The base fee per gas of the next block, or null if not available.
     */
    public async getNextBlockBaseFeePerGas(): Promise<bigint | null> {
        const options: FeeHistoryOptions = {
            blockCount: 1,
            newestBlock: Revision.of('next')
        };

        const feeHistory = await this.getFeeHistory(options);

        if (
            feeHistory.baseFeePerGas === null ||
            feeHistory.baseFeePerGas === undefined ||
            feeHistory.baseFeePerGas.length === 0
        ) {
            return null;
        }

        return feeHistory.baseFeePerGas[0];
    }
}

export { GasModule, type FeeHistoryOptions, type EstimateGasOptions };
