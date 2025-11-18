import { describe, expect, test, beforeAll } from '@jest/globals';
import { ThorClient } from '@thor/thor-client/ThorClient';
import { Address, Hex, Revision } from '@common/vcdm';
import { GasModule } from '@thor/thor-client/gas/gas-module';
import { Clause, type EstimateGasOptions } from '@thor/thor-client/model';
import {
    AccountDispatcher,
    type ThorSoloAccount
} from '@vechain/sdk-solo-setup';
import { IllegalArgumentError } from '@common/errors';
import { ThorNetworks } from '@thor/utils/const/network';

/**
 * GasModule solo network tests
 * @group solo
 */
describe('GasModule Solo Tests', () => {
    const thorClient = ThorClient.at(ThorNetworks.SOLONET);
    const gasModule = thorClient.gas;

    describe('calculateIntrinsicGas', () => {
        test('should calculate intrinsic gas for simple transfer', () => {
            const clauses: Clause[] = [
                new Clause(
                    Address.of('0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa'),
                    BigInt('0x1000000000000000000'),
                    Hex.of('0x')
                )
            ];

            const result = GasModule.computeIntrinsicGas(clauses);

            expect(typeof result).toBe('bigint');
            expect(result).toBe(21000n); // Standard transfer gas
        });

        test('should calculate intrinsic gas for contract call with data', () => {
            const clauses: Clause[] = [
                new Clause(
                    Address.of('0x0000000000000000000000000000456E65726779'), // Energy contract
                    0n,
                    Hex.of(
                        '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000000000000000000000000000000000000000013f306a2409fc0000'
                    )
                )
            ];

            const result = GasModule.computeIntrinsicGas(clauses);

            expect(typeof result).toBe('bigint');
            expect(result).toBeGreaterThan(21000n); // Should be more than basic transfer
        });

        test('should calculate intrinsic gas for contract deployment', () => {
            const clauses: Clause[] = [
                new Clause(
                    null,
                    0n,
                    Hex.of(
                        '0x608060405234801561001057600080fd5b50600a60008190555050'
                    )
                )
            ];

            const result = GasModule.computeIntrinsicGas(clauses);

            expect(typeof result).toBe('bigint');
            expect(result).toBeGreaterThan(50000n); // Contract creation is more expensive
        });
    });

    describe('estimateGas', () => {
        // get a random funded test account
        let testAccount: ThorSoloAccount;
        beforeAll(() => {
            testAccount = AccountDispatcher.getInstance().getNextAccount();
        });
        test('should estimate gas for simple VET transfer', async () => {
            const clauses: Clause[] = [
                new Clause(
                    Address.of('0x435933c8064b4ae76be665428e0307ef2ccfbd68'),
                    BigInt('0x1'),
                    null
                ) // 1 wei VET transfer
            ];
            const result = await gasModule.estimateGas(
                clauses,
                Address.of(testAccount.address)
            );
            expect(result.totalGas).toBeGreaterThanOrEqual(21000n);
            expect(result.reverted).toBe(false);
            expect(result.revertReasons).toHaveLength(0);
            expect(result.vmErrors).toHaveLength(0);
        });

        test('should estimate gas for simple VET transfer with gas padding', async () => {
            const clauses: Clause[] = [
                new Clause(
                    Address.of('0x435933c8064b4ae76be665428e0307ef2ccfbd68'),
                    BigInt('0x1'),
                    null
                ) // 1 wei VET transfer
            ];
            const result = await gasModule.estimateGas(
                clauses,
                Address.of(testAccount.address),
                {
                    gasPadding: 0.1
                }
            );
            expect(result.totalGas).toBeGreaterThanOrEqual(23000n);
            expect(result.reverted).toBe(false);
            expect(result.revertReasons).toHaveLength(0);
            expect(result.vmErrors).toHaveLength(0);
        });

        test('should estimate gas for VTHO transfer', async () => {
            // transfer 1 wei VTHO to the test account
            const clauses: Clause[] = [
                new Clause(
                    Address.of('0x0000000000000000000000000000456E65726779'),
                    BigInt(0n),
                    Hex.of(
                        '0xa9059cbb000000000000000000000000f077b491b355e64048ce21e3a6fc4751eeea77fa0000000000000000000000000000000000000000000000000000000000000001'
                    )
                )
            ];
            const result = await gasModule.estimateGas(
                clauses,
                Address.of(testAccount.address)
            );
            expect(result.totalGas).toBeGreaterThan(1000n);
            expect(result.reverted).toBe(false);
            expect(result.revertReasons).toHaveLength(0);
            expect(result.vmErrors).toHaveLength(0);
        });

        test('should estimate gas for contract deployment', async () => {
            // Simple counter contract bytecode
            const contractBytecode =
                '0x608060405234801561001057600080fd5b50600a60008190555034801561002557600080fd5b5060c9806100346000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80632e64cec11460375780636057361d146051575b600080fd5b60005460405190815260200160405180910390f35b6061605c3660046084565b606b565b005b600055565b60405190815260200160405180910390f35b600060208284031215609557600080fd5b503591905056fea2646970667358221220';

            const clauses: Clause[] = [
                new Clause(null, BigInt('0x0'), Hex.of(contractBytecode))
            ];
            const result = await gasModule.estimateGas(
                clauses,
                Address.of(testAccount.address)
            );
            expect(result.totalGas).toBeGreaterThan(48000n);
            expect(result.reverted).toBe(false);
            expect(result.revertReasons).toHaveLength(0);
            expect(result.vmErrors).toHaveLength(0);
        });

        test('should estimate gas for multiple clauses', async () => {
            // contract deploy and vtho transfer
            const clauses: Clause[] = [
                new Clause(null, BigInt('0x1'), Hex.of('0x')),
                new Clause(
                    Address.of('0x0000000000000000000000000000456E65726779'),
                    BigInt(0n),
                    Hex.of(
                        '0xa9059cbb000000000000000000000000f077b491b355e64048ce21e3a6fc4751eeea77fa0000000000000000000000000000000000000000000000000000000000000001'
                    )
                )
            ];

            const result = await gasModule.estimateGas(
                clauses,
                Address.of(testAccount.address)
            );
            expect(result.totalGas).toBeGreaterThan(80000n);
            expect(result.reverted).toBe(false);
            expect(result.revertReasons).toHaveLength(0);
            expect(result.vmErrors).toHaveLength(0);
        });

        test('should handle insufficient balance scenario', async () => {
            // Try to send more VET than the account has
            const clauses: Clause[] = [
                new Clause(
                    Address.of('0x435933c8064b4ae76be665428e0307ef2ccfbd68'),
                    BigInt(400000000000000000000000005n),
                    null
                )
            ];
            const result = await gasModule.estimateGas(
                clauses,
                Address.of(testAccount.address)
            );
            expect(result.reverted).toBe(true);
            expect(result.revertReasons).toHaveLength(1);
            expect(result.revertReasons[0]).toBe('');
            expect(result.vmErrors).toHaveLength(1);
            expect(result.vmErrors[0]).toContain(
                'insufficient balance for transfer'
            );
        });

        test('should handle insufficient gas scenario', async () => {
            // Simple counter contract bytecode
            const contractBytecode =
                '0x608060405234801561001057600080fd5b50600a60008190555034801561002557600080fd5b5060c9806100346000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80632e64cec11460375780636057361d146051575b600080fd5b60005460405190815260200160405180910390f35b6061605c3660046084565b606b565b005b600055565b60405190815260200160405180910390f35b600060208284031215609557600080fd5b503591905056fea2646970667358221220';
            const clauses: Clause[] = [
                new Clause(null, BigInt('0x0'), Hex.of(contractBytecode))
            ];
            const addresswithZeroVTHO = Address.of(
                '0x15c4cD94a5dE2ecE0185d057128daDfd9f54dc11'
            );
            // override the offered gas to be smaller than the intrinsic gas
            const options: EstimateGasOptions = {
                gas: BigInt(1n)
            };
            const result = await gasModule.estimateGas(
                clauses,
                addresswithZeroVTHO,
                options
            );
            expect(result.reverted).toBe(true);
            expect(result.revertReasons).toHaveLength(1);
            expect(result.vmErrors).toHaveLength(1);
            expect(result.vmErrors[0]).toContain('out of gas');
        });
    });

    describe('getMaxPriorityFeePerGas', () => {
        test('should get max priority fee per gas from solo network', async () => {
            const result = await gasModule.getSuggestedMaxPriorityFeePerGas();

            expect(typeof result).toBe('bigint');
            expect(result).toBeGreaterThanOrEqual(0n);
            // Solo network typically has a specific priority fee
            expect(result).toBeGreaterThan(0n); // Should be positive
        });
    });

    describe('getFeeHistory', () => {
        test('should get fee history for recent blocks', async () => {
            const options = {
                blockCount: 5,
                newestBlock: Revision.of('best')
            };

            const result = await gasModule.getFeeHistory(
                options.blockCount,
                options.newestBlock
            );

            expect(result.baseFeePerGas).toBeDefined();
            expect(result.gasUsedRatio).toBeDefined();
            expect(result.oldestBlock).toBeDefined();

            if (result.baseFeePerGas !== null) {
                expect(result.baseFeePerGas.length).toBeGreaterThan(0); // Should have at least some values
                result.baseFeePerGas.forEach((fee) => {
                    expect(typeof fee).toBe('bigint');
                    expect(fee).toBeGreaterThanOrEqual(0n);
                });
            }

            expect(result.gasUsedRatio.length).toBeGreaterThan(0); // Should have at least some values
            result.gasUsedRatio.forEach((ratio) => {
                expect(typeof ratio).toBe('number');
                expect(ratio).toBeGreaterThanOrEqual(0);
                expect(ratio).toBeLessThanOrEqual(1);
            });
        });

        test('should get fee history with reward percentiles', async () => {
            const options = {
                blockCount: 3,
                newestBlock: Revision.of('best'),
                rewardPercentiles: [25, 50, 75]
            };

            const result = await gasModule.getFeeHistory(
                options.blockCount,
                options.newestBlock,
                options.rewardPercentiles
            );

            expect(result.baseFeePerGas).toBeDefined();
            expect(result.gasUsedRatio).toBeDefined();
            expect(result.reward).toBeDefined();

            if (result.reward !== null) {
                expect(result.reward).toHaveLength(3); // blockCount
                result.reward.forEach((blockRewards) => {
                    expect(blockRewards).toHaveLength(3); // rewardPercentiles length
                    blockRewards.forEach((reward) => {
                        expect(typeof reward).toBe('bigint');
                        expect(reward).toBeGreaterThanOrEqual(0n);
                    });
                });
            }
        });

        test('should get fee history for specific block range', async () => {
            const options = {
                blockCount: 2,
                newestBlock: Revision.of('best') // Use best block instead of fixed number
            };

            const result = await gasModule.getFeeHistory(
                options.blockCount,
                options.newestBlock
            );

            expect(result.baseFeePerGas).toBeDefined();
            expect(result.gasUsedRatio).toBeDefined();
            expect(result.oldestBlock).toBeDefined();

            if (result.baseFeePerGas !== null) {
                expect(result.baseFeePerGas.length).toBeGreaterThan(0); // Should have values
            }
            expect(result.gasUsedRatio.length).toBeGreaterThan(0); // Should have values
        });

        test('should get fee history for single block', async () => {
            const options = {
                blockCount: 1
            };

            const result = await gasModule.getFeeHistory(options.blockCount);

            expect(result.baseFeePerGas).toBeDefined();
            expect(result.gasUsedRatio).toBeDefined();

            if (result.baseFeePerGas !== null) {
                expect(result.baseFeePerGas.length).toBeGreaterThan(0); // Should have values
            }
            expect(result.gasUsedRatio.length).toBeGreaterThan(0); // Should have values
        });
    });

    describe('getBaseFeePerGas', () => {
        test('should get best block base fee per gas', async () => {
            const result = await gasModule.getBaseFeePerGas(Revision.BEST);
            expect(typeof result).toBe('bigint');
            expect(result).toBeGreaterThanOrEqual(10000n);
        });

        test('should throw IllegalArgumentError for NEXT revision', async () => {
            await expect(
                gasModule.getBaseFeePerGas(Revision.NEXT)
            ).rejects.toThrow(IllegalArgumentError);
        });
    });

    describe('getNextBlockBaseFeePerGas', () => {
        test('should get next block base fee per gas', async () => {
            const result = await gasModule.getNextBlockBaseFeePerGas();
            expect(typeof result).toBe('bigint');
            expect(result).toBeGreaterThanOrEqual(10000n);
        });
    });

    describe('computeMaxFeePrices', () => {
        test('should compute max fee prices', async () => {
            const result = await gasModule.computeMaxFeePrices();
            expect(typeof result).toBe('object');
            expect(result.maxFeePerGas).toBeGreaterThanOrEqual(0n);
            expect(result.maxPriorityFeePerGas).toBeGreaterThanOrEqual(0n);
        });
    });
});
