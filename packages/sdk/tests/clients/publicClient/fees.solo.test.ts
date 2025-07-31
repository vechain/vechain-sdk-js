import { describe, expect, test } from '@jest/globals';
import { createPublicClient } from '@clients';
import { ThorNetworks } from '@thor';
import { type ExecuteCodesRequestJSON } from '@json';

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
 * @group integration/clients
 */
describe('PublicClient - Fee Estimation Methods', () => {
    const publicClient = createPublicClient({
        network: ThorNetworks.SOLONET
    });
    // Sample contract call for gas estimation (ExecuteCodesRequestJSON format)
    const sampleContractCall: ExecuteCodesRequestJSON = {
        clauses: [
            {
                to: '0x0000000000000000000000000000456E65726779', // VTHO contract
                value: '0x0',
                data: '0x70a08231000000000000000000000000f077b491b355e64048ce21e3a6fc4751eeea77fa' // balanceOf function
            }
        ],
        caller: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
        gas: 21000
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

            console.log('Fee History (1 block):');
            console.log(
                'Base Fee Per Gas Array Length: ' +
                    feeHistory.baseFeePerGas.length
            );
            console.log(
                'Gas Used Ratio Array Length: ' + feeHistory.gasUsedRatio.length
            );
            console.log('Oldest Block: ' + feeHistory.oldestBlock.toString());
        }, 10000);

        test('should retrieve fee history for multiple blocks', async () => {
            const blockCount = 5;
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

            console.log('Fee History (' + blockCount + ' blocks):');
            console.log(
                'Data retrieved successfully for ' + blockCount + ' blocks'
            );
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
                console.log('Gas Price [' + index + ']: ' + price.toString());
            });

            console.log('Gas Price Array Length: ' + gasPrice.length);
        }, 10000);
    });

    describe('estimateFeePerGas', () => {
        test('should estimate fee per gas', async () => {
            const feePerGas = await publicClient.estimateFeePerGas();

            expect(feePerGas).toBeDefined();
            if (feePerGas !== undefined) {
                expect(typeof feePerGas).toBe('bigint');
                expect(feePerGas).toBeGreaterThan(0n);

                console.log(
                    'Estimated Fee Per Gas: ' + feePerGas.toString() + ' wei'
                );
                console.log(
                    'Fee in VTHO: ' +
                        (Number(feePerGas) / 1e18).toFixed(8) +
                        ' VTHO'
                );
            } else {
                console.log('Fee per gas estimation returned undefined');
            }
        }, 10000);
    });

    describe('estimateGas', () => {
        test('should estimate gas for contract call', async () => {
            const gasEstimate =
                await publicClient.estimateGas(sampleContractCall);

            expect(gasEstimate).toBeDefined();
            expect(Array.isArray(gasEstimate)).toBe(true);
            expect(gasEstimate.length).toBeGreaterThan(0);

            // Check first clause result
            const firstResult = gasEstimate[0];
            expect(firstResult).toHaveProperty('gasUsed');
            expect(firstResult).toHaveProperty('reverted');
            expect(firstResult).toHaveProperty('data');
            expect(typeof firstResult.gasUsed).toBe('bigint');
            expect(typeof firstResult.reverted).toBe('boolean');

            console.log(
                'Gas estimate results: ' + gasEstimate.length + ' clauses'
            );
            console.log(
                'First clause gas used: ' + firstResult.gasUsed.toString()
            );
            console.log('First clause reverted: ' + firstResult.reverted);
        }, 10000);

        test('should estimate gas for transfer transaction', async () => {
            // Use a simple transfer with valid addresses and reasonable gas limit
            const transferTransaction: ExecuteCodesRequestJSON = {
                clauses: [
                    {
                        to: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                        value: '0x16345785d8a0000', // 0.1 VET
                        data: '0x'
                    }
                ],
                caller: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                gas: 21000
            };

            const estimate =
                await publicClient.estimateGas(transferTransaction);

            expect(estimate).toBeDefined();
            expect(Array.isArray(estimate)).toBe(true);
            expect(estimate.length).toBe(1);

            const result = estimate[0];
            // Check if the transaction would succeed or fail
            expect(result.gasUsed).toBeGreaterThanOrEqual(0n);

            console.log('Transfer Gas estimate: ' + result.gasUsed.toString());
            console.log('Transfer reverted: ' + result.reverted);

            // If it reverted, it might be due to insufficient balance, which is expected in test
            if (result.reverted) {
                console.log(
                    'Transfer reverted (likely due to insufficient balance in test environment)'
                );
            }
        }, 10000);
    });

    describe('estimateMaxPriorityFeePerGas', () => {
        test('should estimate max priority fee per gas', async () => {
            const priorityFeeResponse =
                await publicClient.estimateMaxPriorityFeePerGas();

            expect(priorityFeeResponse).toBeDefined();
            expect(typeof priorityFeeResponse).toBe('object');
            expect(priorityFeeResponse.maxPriorityFeePerGas).toBeDefined();
            expect(typeof priorityFeeResponse.maxPriorityFeePerGas).toBe(
                'bigint'
            );
            expect(
                priorityFeeResponse.maxPriorityFeePerGas
            ).toBeGreaterThanOrEqual(0n);

            console.log(
                'Priority Fee: ' +
                    priorityFeeResponse.maxPriorityFeePerGas.toString()
            );
        }, 10000);
    });

    describe('fee calculation helpers', () => {
        test('should calculate transaction costs', async () => {
            const gasEstimate =
                await publicClient.estimateGas(sampleContractCall);
            const feePerGas = await publicClient.estimateFeePerGas();

            const firstClauseGas = gasEstimate[0].gasUsed;

            expect(firstClauseGas).toBeGreaterThan(0n);
            expect(feePerGas).toBeDefined();

            if (feePerGas !== undefined) {
                const totalCost = feePerGas * firstClauseGas;
                expect(feePerGas).toBeGreaterThan(0n);
                expect(totalCost).toBeGreaterThan(0n);

                console.log('Base Fee: ' + feePerGas.toString() + ' wei');
                console.log('Gas Used: ' + firstClauseGas.toString());
                console.log('Total Cost: ' + totalCost.toString() + ' wei');
                console.log(
                    'Total Cost in VET: ' +
                        (Number(totalCost) / 1e18).toFixed(8) +
                        ' VET'
                );
            } else {
                console.log(
                    'Fee per gas estimation returned undefined, cannot calculate total cost'
                );
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

            console.log('Invalid fee history request handled correctly');
        }, 10000);

        test('should handle invalid gas estimation', async () => {
            const invalidRequest: ExecuteCodesRequestJSON = {
                clauses: [
                    {
                        to: 'invalid-address',
                        value: 'invalid-value',
                        data: 'invalid-data'
                    }
                ],
                caller: 'invalid-caller',
                gas: -1
            };

            // The SDK should throw an error for invalid input format
            await expect(async () => {
                await publicClient.estimateGas(invalidRequest);
            }).rejects.toThrow();

            console.log('Invalid gas estimation handled correctly');
        }, 10000);
    });
});
