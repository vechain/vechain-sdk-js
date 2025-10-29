import { describe, expect, test } from '@jest/globals';
import { createPublicClient } from '@viem/clients';
import { ThorNetworks } from '@thor/thorest';
import { log } from '@common/logging';
import { Clause, type EstimateGasOptions } from '@thor/thor-client/model';
import { Address, Hex } from '@common/vcdm';

/**
 * Test suite for PublicClient fee estimation functionality
 *
 * Tests fee-related methods:
 * - getFeeHistory
 * - getGasPrice
 * - estimateFeePerGas
 * - estimateGas
 * - estimateMaxPriorityFeePerGas
 *
 * @group solo/viem/clients
 */
describe('PublicClient - Fee Estimation Methods', () => {
    const publicClient = createPublicClient({
        network: ThorNetworks.SOLONET
    });
    const clauses: Clause[] = [
        new Clause(
            Address.of('0x0000000000000000000000000000456E65726779'), // VTHO contract
            0n,
            Hex.of(
                '0x70a08231000000000000000000000000f077b491b355e64048ce21e3a6fc4751eeea77fa'
            ) // balanceOf function
        )
    ];
    const caller = Address.of('0xf077b491b355e64048ce21e3a6fc4751eeea77fa');
    const estimateGasOptions: EstimateGasOptions = {
        gas: 21000n
    };

    describe('getFeeHistory', () => {
        test('should retrieve fee history for 1 block', async () => {
            const blockCount = 1;
            const feeHistory = await publicClient.getFeeHistory(blockCount);

            expect(feeHistory).toBeDefined();
            expect(feeHistory).toHaveProperty('baseFeePerGas');
            expect(feeHistory).toHaveProperty('gasUsedRatio');
            expect(feeHistory).toHaveProperty('reward');
            expect(feeHistory).toHaveProperty('oldestBlock');

            // Verify data types
            expect(Array.isArray(feeHistory.baseFeePerGas)).toBe(true);
            expect(Array.isArray(feeHistory.gasUsedRatio)).toBe(true);
            expect(Array.isArray(feeHistory.reward)).toBe(true);

            // VeChain returns exactly blockCount elements, not blockCount + 1
            expect(feeHistory.baseFeePerGas.length).toBe(blockCount);
            expect(feeHistory.gasUsedRatio.length).toBe(blockCount);

            log.debug({
                message: 'Fee History (1 block)',
                context: { data: feeHistory }
            });
            log.debug({
                message: 'Base Fee Per Gas Array Length',
                context: { data: feeHistory.baseFeePerGas.length }
            });
            log.debug({
                message: 'Gas Used Ratio Array Length',
                context: { data: feeHistory.gasUsedRatio.length }
            });
            log.debug({
                message: 'Oldest Block',
                context: { data: feeHistory.oldestBlock.toString() }
            });
        }, 10000);

        test('should retrieve fee history for multiple blocks', async () => {
            // Get current block number first to ensure we don't request more blocks than available
            const currentBlock = await publicClient.getBlockNumber();
            const blockCount = Math.min(2, Number(currentBlock) + 1); // Use 2 blocks or available blocks, whichever is smaller

            const feeHistory = await publicClient.getFeeHistory(blockCount);

            expect(feeHistory).toBeDefined();
            expect(
                feeHistory.baseFeePerGas.length > 0 &&
                    feeHistory.baseFeePerGas.length <= blockCount
            ).toBe(true);
            expect(
                feeHistory.gasUsedRatio.length > 0 &&
                    feeHistory.gasUsedRatio.length <= blockCount
            ).toBe(true);

            log.debug({
                message: 'Fee History (' + blockCount + ' blocks)',
                context: { data: feeHistory }
            });
            log.debug({
                message:
                    'Data retrieved successfully for ' + blockCount + ' blocks',
                context: { data: blockCount }
            });
        }, 10000);
    });

    describe('getGasPrice', () => {
        test('should retrieve current gas price array', async () => {
            const gasPrice = await publicClient.getGasPrice();

            expect(gasPrice).toBeDefined();
            expect(Array.isArray(gasPrice)).toBe(true);
            expect(gasPrice.length).toBeGreaterThan(0);

            // All gas prices should be bigint values
            gasPrice.forEach((price, index) => {
                expect(typeof price).toBe('bigint');
                expect(price).toBeGreaterThanOrEqual(0n);
                log.debug({
                    message: 'Gas Price [' + index + ']: ' + price.toString(),
                    context: { data: price.toString() }
                });
            });

            log.debug({
                message: 'Gas Price Array Length: ' + gasPrice.length,
                context: { data: gasPrice.length }
            });
        }, 10000);
    });

    describe('estimateFeePerGas', () => {
        test('should estimate fee per gas', async () => {
            const feePerGas = await publicClient.estimateFeePerGas();

            expect(feePerGas).toBeDefined();
            if (feePerGas !== undefined) {
                expect(typeof feePerGas).toBe('bigint');
                expect(feePerGas).toBeGreaterThan(0n);

                log.debug({
                    message:
                        'Estimated Fee Per Gas: ' +
                        feePerGas.toString() +
                        ' wei',
                    context: { data: feePerGas.toString() }
                });
                log.debug({
                    message:
                        'Fee in VTHO: ' +
                        (Number(feePerGas) / 1e18).toFixed(8) +
                        ' VTHO',
                    context: { data: (Number(feePerGas) / 1e18).toFixed(8) }
                });
            } else {
                log.debug({
                    message: 'Fee per gas estimation returned undefined'
                });
            }
        }, 10000);
    });

    describe('estimateGas', () => {
        test('should estimate gas for contract call', async () => {
            const gasEstimate = await publicClient.estimateGas(
                clauses,
                caller,
                estimateGasOptions
            );

            expect(gasEstimate).toBeDefined();
            expect(gasEstimate.totalGas).toBeGreaterThan(0n);

            log.debug({
                message:
                    'Gas estimate results: ' + gasEstimate.totalGas.toString(),
                context: { data: gasEstimate.totalGas.toString() }
            });
            log.debug({
                message: 'Total gas used: ' + gasEstimate.totalGas.toString(),
                context: { data: gasEstimate.totalGas.toString() }
            });
            log.debug({
                message: 'First clause reverted: ' + gasEstimate.reverted,
                context: { data: gasEstimate.reverted }
            });
        }, 10000);

        test('should estimate gas for transfer transaction', async () => {
            const clauses: Clause[] = [
                new Clause(
                    Address.of('0xf077b491b355e64048ce21e3a6fc4751eeea77fa'),
                    BigInt('0x16345785d8a0000'), // 0.1 VET
                    Hex.of('0x')
                )
            ];
            const caller = Address.of(
                '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'
            );
            const estimateGasOptions: EstimateGasOptions = {
                gas: 21000n
            };

            const estimate = await publicClient.estimateGas(
                clauses,
                caller,
                estimateGasOptions
            );

            expect(estimate).toBeDefined();
            // Check if the transaction would succeed or fail
            expect(estimate.totalGas).toBeGreaterThanOrEqual(0n);

            log.debug({
                message:
                    'Transfer Gas estimate: ' + estimate.totalGas.toString(),
                context: { data: estimate.totalGas.toString() }
            });
            log.debug({
                message: 'Transfer reverted: ' + estimate.reverted,
                context: { data: estimate.reverted }
            });

            // If it reverted, it might be due to insufficient balance, which is expected in test
            if (estimate.reverted) {
                log.warn({
                    message:
                        'Transfer reverted (likely due to insufficient balance in test environment)'
                });
            }
        }, 10000);
    });

    describe('estimateMaxPriorityFeePerGas', () => {
        test('should estimate max priority fee per gas', async () => {
            const priorityFeeResponse =
                await publicClient.suggestPriorityFeeRequest();

            expect(priorityFeeResponse).toBeDefined();
            expect(typeof priorityFeeResponse).toBe('bigint');
            expect(priorityFeeResponse).toBeDefined();
            expect(priorityFeeResponse).toBeGreaterThanOrEqual(0n);

            log.debug({
                message: 'Priority Fee: ' + priorityFeeResponse.toString(),
                context: {
                    data: priorityFeeResponse.toString()
                }
            });
        }, 10000);
    });

    describe('fee calculation helpers', () => {
        test('should calculate transaction costs', async () => {
            const gasEstimate = await publicClient.estimateGas(
                clauses,
                caller,
                estimateGasOptions
            );
            const feePerGas = await publicClient.estimateFeePerGas();

            const firstClauseGas = gasEstimate.totalGas;

            expect(firstClauseGas).toBeGreaterThan(0n);
            expect(feePerGas).toBeDefined();

            if (feePerGas !== undefined) {
                const totalCost = feePerGas * firstClauseGas;
                expect(feePerGas).toBeGreaterThan(0n);
                expect(totalCost).toBeGreaterThan(0n);

                log.debug({
                    message: 'Base Fee: ' + feePerGas.toString() + ' wei',
                    context: { data: feePerGas.toString() }
                });
                log.debug({
                    message: 'Gas Used: ' + firstClauseGas.toString(),
                    context: { data: firstClauseGas.toString() }
                });
                log.debug({
                    message: 'Total Cost: ' + totalCost.toString() + ' wei',
                    context: { data: totalCost.toString() }
                });
                log.debug({
                    message:
                        'Total Cost in VET: ' +
                        (Number(totalCost) / 1e18).toFixed(8) +
                        ' VET',
                    context: { data: (Number(totalCost) / 1e18).toFixed(8) }
                });
            } else {
                log.debug({
                    message:
                        'Fee per gas estimation returned undefined, cannot calculate total cost'
                });
            }
        }, 15000);
    });

    describe('error handling', () => {
        test('should handle invalid fee history request', async () => {
            // Test with invalid block count
            const invalidBlockCount = 0;

            await expect(async () => {
                await publicClient.getFeeHistory(invalidBlockCount);
            }).rejects.toThrow();

            log.debug({
                message: 'Invalid fee history request handled correctly'
            });
        }, 10000);
    });
});
