import { RetrieveHistoricalFeeData, SuggestPriorityFee } from '@thor/thorest';
import { InspectClauses } from '@thor/thorest';
import { Revision } from '@common/vcdm';
import { Transaction, type TransactionClause } from '@thor/thorest';
import { IllegalArgumentError, NoSuchElementError } from '@common/errors';
import { AbstractThorModule } from '@thor/thor-client/AbstractThorModule';
import { FeeHistory } from '../model/gas/FeeHistory';
import { EstimatedGas } from '../model/gas/EstimatedGas';
import { EstimateGas } from '../model/gas/EstimateGas';

const FQP = 'packages/sdk/src/thor/thor-client/gas/gas-module.ts';

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
     *
     * @param request - The execute codes request containing transaction details.
     * @returns The execution response containing gas usage and other details.
     */
    public async estimateGas(
        estimateGas: EstimateGas
    ): Promise<EstimatedGas[]> {
        const inspectClause = await InspectClauses.of(estimateGas).askTo(
            this.httpClient
        );
        return Array.from(inspectClause.response);
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
        blockCount: number,
        newestBlock?: Revision,
        rewardPercentiles?: number[]
    ): Promise<FeeHistory> {
        // Validate blockCount
        if (
            blockCount === null ||
            blockCount === undefined ||
            typeof blockCount !== 'number' ||
            !Number.isFinite(blockCount) ||
            blockCount <= 0
        ) {
            throw new IllegalArgumentError(
                `${FQP}.getFeeHistory()`,
                'Invalid blockCount parameter. Must be a positive finite number.',
                { blockCount }
            );
        }

        // Create and execute the query
        let query = RetrieveHistoricalFeeData.of(blockCount);

        if (newestBlock !== null && newestBlock !== undefined) {
            query = query.withNewestBlock(newestBlock);
        }

        if (rewardPercentiles && rewardPercentiles.length > 0) {
            query = query.withRewardPercentiles(rewardPercentiles);
        }

        const response = (await query.askTo(this.httpClient)).response;
        return response;
    }

    /**
     * Returns the base fee per gas of the next block.
     *
     * @returns The base fee per gas of the next block, or null if not available.
     */
    public async suggestPriorityFeeRequest(): Promise<bigint> {
        const feeHistory = await this.getFeeHistory(1, Revision.of('next'));

        if (
            feeHistory.baseFeePerGas === null ||
            feeHistory.baseFeePerGas === undefined ||
            feeHistory.baseFeePerGas.length === 0
        ) {
            throw new NoSuchElementError(
                `${FQP}.suggestPriorityFeeRequest()`,
                'Base fee per gas for next block is not available.',
                { newestBlock: 'next' }
            );
        }

        return feeHistory.baseFeePerGas[0];
    }
}

export { GasModule };
