import {
    RetrieveHistoricalFeeData,
    SuggestPriorityFee,
    ThorError
} from '@thor/thorest';
import { type Address, HexUInt, Revision } from '@common/vcdm';
import { IllegalArgumentError, NoSuchElementError } from '@common/errors';
import { AbstractThorModule } from '@thor/thor-client/AbstractThorModule';
import { type FeeHistory } from '../model/gas/FeeHistory';
import {
    type ClauseSimulationResult,
    type SimulateTransactionOptions,
    type Clause
} from '@thor/thor-client/model/transactions';
import {
    type EstimateGasResult,
    type EstimateGasOptions
} from '@thor/thor-client/model/gas';
import { decodeRevertReason } from './helpers/decode-evm-error';

const FQP = 'packages/sdk/src/thor/thor-client/gas/gas-module.ts';

/**
 * The gas module of the VeChain Thor blockchain.
 * It provides methods for gas estimation, fee history, and priority fee suggestions.
 */
class GasModule extends AbstractThorModule {
    /**
     * A collection of constants used for gas calculations in transactions.
     *
     * Properties
     * - `TX_GAS` - The base gas cost for a transaction.
     * - `CLAUSE_GAS` - The gas cost for executing a clause in a transaction.
     * - `CLAUSE_GAS_CONTRACT_CREATION` - The gas cost for creating a contract via a clause.
     * - `ZERO_GAS_DATA` - The gas cost for transmitting zero bytes of data.
     * - `NON_ZERO_GAS_DATA` - The gas cost for transmitting non-zero bytes of data.
     */
    public static readonly GAS_CONSTANTS = {
        TX_GAS: 5000n,
        CLAUSE_GAS: 16000n,
        CLAUSE_GAS_CONTRACT_CREATION: 48000n,
        ZERO_GAS_DATA: 4n,
        NON_ZERO_GAS_DATA: 68n
    };

    private static readonly GAS_PADDING_SCALE = 1_000_000n; // 6 decimal places of precision

    /**
     * Calculates the intrinsic gas required for the given clauses.
     *
     * @param {TransactionClause[]} clauses - An array of transaction clauses to calculate the intrinsic gas for.
     * @return {bigint} The total intrinsic gas required for the provided clauses.
     * @throws {IllegalArgumentError} If clauses have invalid data as invalid addresses.
     */
    public static computeIntrinsicGas(clauses: Clause[]): bigint {
        if (clauses.length > 0) {
            const totalGas = clauses.reduce((sum: bigint, clause: Clause) => {
                if (clause.to !== null) {
                    sum += this.GAS_CONSTANTS.CLAUSE_GAS;
                } else {
                    sum += this.GAS_CONSTANTS.CLAUSE_GAS_CONTRACT_CREATION;
                }
                const data = clause.data;
                if (data !== null) {
                    sum +=
                        this.GAS_CONSTANTS.ZERO_GAS_DATA *
                        BigInt(data.countZeroBytes());
                    sum +=
                        this.GAS_CONSTANTS.NON_ZERO_GAS_DATA *
                        BigInt(data.countNonZeroBytes());
                }
                return sum;
            }, this.GAS_CONSTANTS.TX_GAS);
            return totalGas;
        }
        // No clauses.
        return this.GAS_CONSTANTS.TX_GAS + this.GAS_CONSTANTS.CLAUSE_GAS;
    }

    /**
     * Estimates the gas required for executing the given request.
     *
     * @param request - The execute codes request containing transaction details.
     * @returns The execution response containing gas usage and other details.
     */
    public async estimateGas(
        clauses: Clause[],
        caller: Address,
        options?: EstimateGasOptions
    ): Promise<EstimateGasResult> {
        // check if clauses are empty
        if (clauses.length === 0) {
            throw new IllegalArgumentError(
                `${FQP}.estimateGas()`,
                'Clauses cannot be empty.',
                { clauses }
            );
        }
        // check if options are valid
        if (options !== undefined) {
            if (options.gasPadding !== undefined) {
                if (options.gasPadding > 1 || options.gasPadding <= 0) {
                    throw new IllegalArgumentError(
                        `${FQP}.estimateGas()`,
                        'Gas padding must be between 0 and 1.',
                        { gasPadding: options.gasPadding }
                    );
                }
            }
        }
        // simulate the clauses
        const simulationOptions: SimulateTransactionOptions = {
            caller,
            revision: options?.revision,
            gas: options?.gas,
            gasPrice: options?.gasPrice
        };
        const simulationResult =
            await this.thorClient.transactions.simulateTransaction(
                clauses,
                simulationOptions
            );
        // sum the gas used of each clause
        const evmGasUsed = simulationResult.reduce(
            (sum: bigint, item: ClauseSimulationResult) => {
                return sum + item.gasUsed;
            },
            0n
        );
        // add the intrinsic gas
        const intrinsicGas = GasModule.computeIntrinsicGas(clauses);
        // add the gas padding
        const totalGasUsed = GasModule._computeGasWithPadding(
            options?.gasPadding ?? 0,
            evmGasUsed,
            intrinsicGas
        );
        // aggregate the reverted flag for all clauses
        const reverted = simulationResult.some(
            (item: ClauseSimulationResult) => item.reverted
        );
        // return the result, if reverted, return the reverted reason and vm errors
        const result = reverted
            ? {
                  totalGas: totalGasUsed,
                  reverted: true,
                  revertReasons: simulationResult.map((simulation) => {
                      return decodeRevertReason(simulation.data) ?? '';
                  }),
                  vmErrors: simulationResult.map((simulation) => {
                      return simulation.vmError;
                  })
              }
            : {
                  totalGas: totalGasUsed,
                  reverted: false,
                  revertReasons: [],
                  vmErrors: []
              };
        return result;
    }

    /**
     * Computes the total gas with gas padding for the given gas padding percentage and EVM gas used.
     *
     * @param gasPadding - The gas padding percentage.
     * @param evmGasUsed - The EVM gas used.
     * @param intrinsicGas - The intrinsic gas.
     * @returns The total gas with gas padding.
     */
    public static _computeGasWithPadding(
        gasPadding: number,
        evmGasUsed: bigint,
        intrinsicGas: bigint
    ): bigint {
        const totalGas = evmGasUsed + intrinsicGas;
        const gasPaddingBigInt = BigInt(
            gasPadding * Number(GasModule.GAS_PADDING_SCALE)
        );
        return (
            (totalGas * (GasModule.GAS_PADDING_SCALE + gasPaddingBigInt)) /
            GasModule.GAS_PADDING_SCALE
        );
    }

    /**
     * Returns the suggested priority fee per gas.
     * This comes directly from the /fees/priority endpoint.
     * And represents the maximum priority fee to be included in the next block.
     *
     * @returns The suggested priority fee per gas as a bigint.
     */
    public async getSuggestedMaxPriorityFeePerGas(): Promise<bigint> {
        const query = SuggestPriorityFee.of();
        const response = (await query.askTo(this.httpClient)).response;
        return response.maxPriorityFeePerGas;
    }

    /**
     * Computes maxFeePerGas and maxPriorityFeePerGas for a transaction.
     * This is based on the current block base fee and fee history.
     *
     * @returns {MaxFeePrices} The maximum fee prices
     */
    public async computeMaxFeePrices(): Promise<{
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
    }> {
        // get next block base fee
        const nextBlockBaseFee = await this.getNextBlockBaseFeePerGas();
        if (nextBlockBaseFee === null) {
            throw new IllegalArgumentError(
                `${FQP}.computeMaxFeePrices()`,
                'Next block base fee is not available.',
                { newestBlock: 'next' }
            );
        }
        const maxPriorityFeePerGas =
            await this.calculateMaxPriorityFeePerGas(nextBlockBaseFee);
        // maxFeePerGas = 1.12 * baseFeePerGas + maxPriorityFeePerGas
        const maxFeePerGas =
            (112n * nextBlockBaseFee) / 100n + maxPriorityFeePerGas;
        return {
            maxFeePerGas,
            maxPriorityFeePerGas
        };
    }

    /**
     * Calculates the default max priority fee per gas based on the current base fee
     * and historical 75th percentile rewards.
     *
     * Uses the FAST (HIGH) speed threshold: min(0.046*baseFee, 75_percentile)
     *
     * @param baseFee - The current base fee per gas
     * @returns A promise that resolves to the default max priority fee per gas as a hex string
     */
    private async calculateMaxPriorityFeePerGas(
        baseFee: bigint
    ): Promise<bigint> {
        // Get fee history for recent blocks
        const feeHistory = await this.getFeeHistory(
            10,
            Revision.BEST,
            [25, 50, 75]
        );

        // Get the 75th percentile reward from the most recent block
        let percentile75: bigint;

        if (
            feeHistory.reward !== null &&
            feeHistory.reward !== undefined &&
            feeHistory.reward.length > 0
        ) {
            const latestBlockRewards =
                feeHistory.reward[feeHistory.reward.length - 1];
            const equalRewardsOnLastBlock =
                new Set(latestBlockRewards).size === 3;

            // If rewards are equal in the last block, use the first one (75th percentile)
            // Otherwise, calculate the average of 75th percentiles across blocks
            if (equalRewardsOnLastBlock) {
                percentile75 = HexUInt.of(latestBlockRewards[2]).bi; // 75th percentile at index 2
            } else {
                // Calculate average of 75th percentiles across blocks
                let sum = 0n;
                let count = 0;

                for (const blockRewards of feeHistory.reward) {
                    if (
                        blockRewards.length !== null &&
                        blockRewards.length > 2 &&
                        blockRewards[2] !== null &&
                        blockRewards[2] !== undefined
                    ) {
                        sum += HexUInt.of(blockRewards[2]).bi;
                        count++;
                    }
                }

                percentile75 = count > 0 ? sum / BigInt(count) : 0n;
            }
        } else {
            // Fallback to getMaxPriorityFeePerGas if fee history is not available
            percentile75 = HexUInt.of(
                await this.getSuggestedMaxPriorityFeePerGas()
            ).bi;
        }

        // Calculate 4.6% of base fee (HIGH speed threshold)
        const baseFeeCap = (baseFee * 46n) / 1000n; // 0.046 * baseFee

        // Use the minimum of the two values
        const priorityFee =
            baseFeeCap < percentile75 ? baseFeeCap : percentile75;

        return HexUInt.of(priorityFee).bi;
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

        if (
            rewardPercentiles !== null &&
            rewardPercentiles !== undefined &&
            rewardPercentiles.length > 0
        ) {
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

    /**
     * Returns the base fee per gas of the given revision.
     *
     * @param {Revision} revision - The revision to get the base fee per gas for.
     * @returns {bigint} The base fee per gas of the given revision.
     * @throws {IllegalArgumentError} If the revision is NEXT
     */
    public async getBaseFeePerGas(
        revision: Revision = Revision.BEST
    ): Promise<bigint> {
        if (revision === Revision.NEXT) {
            throw new IllegalArgumentError(
                `${FQP}.getBaseFeePerGas()`,
                'Next block base fee is not available.',
                { revision }
            );
        }
        // this needs changing eventually to use the blocks module
        const response = await this.httpClient.get(
            { path: `/blocks/${revision}` },
            { query: '' }
        );
        if (!response.ok) {
            throw new ThorError(
                'GasModule.getBaseFeePerGas()',
                'Network error: failed to get base fee per gas',
                { revision },
                undefined,
                response.status
            );
        }
        const blockData = await response.json();
        return BigInt(blockData.baseFeePerGas);
    }

    /**
     * Returns the base fee per gas of the next block.
     * This is a convenience method that calls getFeeHistory
     * @returns The base fee per gas of the next block.
     */
    public async getNextBlockBaseFeePerGas(): Promise<bigint | null> {
        const feeHistory = await this.getFeeHistory(1, Revision.NEXT);
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
