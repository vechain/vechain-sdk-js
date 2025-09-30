import { RetrieveHistoricalFeeData, SuggestPriorityFee } from '@thor/thorest';
import { type Address, Revision } from '@common/vcdm';
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
        const gasPadding =
            options?.gasPadding !== undefined ? BigInt(options.gasPadding) : 0n;
        // total gas used
        const totalGasUsed = evmGasUsed * (1n + gasPadding) + intrinsicGas;
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
}

export { GasModule };
