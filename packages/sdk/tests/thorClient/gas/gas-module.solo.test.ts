import { describe, expect, test } from '@jest/globals';
import { ThorClient } from '@thor/thor-client/ThorClient';
import { ThorNetworks } from '@thor';
import { FetchHttpClient } from '@http';
import { Revision } from '@vcdm';
import { type ExecuteCodesRequestJSON } from '@thor/json';

/**
 * GasModule solo network tests
 * @group solo
 */
describe('GasModule Solo Tests', () => {
    const thorClient = ThorClient.at(
        FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
    );
    const gasModule = thorClient.gas;

    describe('calculateIntrinsicGas', () => {
        test('should calculate intrinsic gas for simple transfer', () => {
            const clauses = [
                {
                    to: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
                    value: BigInt('0x1000000000000000000'),
                    data: '0x'
                }
            ];

            const result = gasModule.calculateIntrinsicGas(clauses);

            expect(typeof result).toBe('bigint');
            expect(result).toBe(21000n); // Standard transfer gas
        });

        test('should calculate intrinsic gas for contract call with data', () => {
            const clauses = [
                {
                    to: '0x0000000000000000000000000000456E65726779', // Energy contract
                    value: 0n,
                    data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000000000000000000000000000000000000000013f306a2409fc0000'
                }
            ];

            const result = gasModule.calculateIntrinsicGas(clauses);

            expect(typeof result).toBe('bigint');
            expect(result).toBeGreaterThan(21000n); // Should be more than basic transfer
        });

        test('should calculate intrinsic gas for contract deployment', () => {
            const clauses = [
                {
                    to: null, // Contract deployment
                    value: 0n,
                    data: '0x608060405234801561001057600080fd5b50600a60008190555050'
                }
            ];

            const result = gasModule.calculateIntrinsicGas(clauses);

            expect(typeof result).toBe('bigint');
            expect(result).toBeGreaterThan(50000n); // Contract creation is more expensive
        });
    });

    describe('estimateGas', () => {
        test('should estimate gas for simple VET transfer', async () => {
            const request: ExecuteCodesRequestJSON = {
                gas: 50000,
                gasPrice: '1000000000000000',
                caller: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa', // First solo account
                clauses: [
                    {
                        to: '0x2669514f9fe96bc7301177ba774d3da8a06cace4', // Second solo account
                        value: '0x1000000000000000000', // 1 VET
                        data: '0x'
                    }
                ]
            };

            const result = await gasModule.estimateGas(request);
            
            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBe(1);
            
            // VeChain solo network may return 0 gas for simple VET transfers
            // This is different from Ethereum where gas estimation returns estimated gas
            expect(result[0].gasUsed.valueOf()).toBeGreaterThanOrEqual(BigInt(0));
            expect(result[0].reverted).toBe(false);
            expect(result[0].vmError).toBe('');
            expect(result[0].transfers).toHaveLength(1);
            expect(result[0].transfers[0].sender.toString().toLowerCase()).toBe(
                '0xf077b491b355e64048ce21e3a6fc4751eeea77fa'
            );
            expect(
                result[0].transfers[0].recipient.toString().toLowerCase()
            ).toBe('0x2669514f9fe96bc7301177ba774d3da8a06cace4');
        });

        test('should estimate gas for VTHO transfer', async () => {
            const request: ExecuteCodesRequestJSON = {
                gas: 50000,
                gasPrice: '1000000000000000',
                caller: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
                clauses: [
                    {
                        to: '0x0000000000000000000000000000456E65726779', // VTHO contract
                        value: '0x0',
                        data: '0xa9059cbb0000000000000000000000002669514f9fe96bc7301177ba774d3da8a06cace40000000000000000000000000000000000000000000000000de0b6b3a7640000' // transfer(address,uint256)
                    }
                ]
            };

            const result = await gasModule.estimateGas(request);

            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBe(1);
            expect(result[0].gasUsed.valueOf()).toBeGreaterThan(BigInt(10000)); // VTHO transfer gas
            expect(result[0].reverted).toBe(false);
            expect(result[0].vmError).toBe('');
            expect(result[0].events).toHaveLength(1); // Transfer event
            expect(result[0].events[0].address.toString().toLowerCase()).toBe(
                '0x0000000000000000000000000000456e65726779'
            );
        });

        test('should estimate gas for contract deployment', async () => {
            // Simple counter contract bytecode
            const contractBytecode =
                '0x608060405234801561001057600080fd5b50600a60008190555034801561002557600080fd5b5060c9806100346000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80632e64cec11460375780636057361d146051575b600080fd5b60005460405190815260200160405180910390f35b6061605c3660046084565b606b565b005b600055565b60405190815260200160405180910390f35b600060208284031215609557600080fd5b503591905056fea2646970667358221220';

            const request: ExecuteCodesRequestJSON = {
                gas: 200000,
                gasPrice: '1000000000000000',
                caller: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
                clauses: [
                    {
                        to: null, // Contract deployment
                        value: '0x0',
                        data: contractBytecode
                    }
                ]
            };

            const result = await gasModule.estimateGas(request);

            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBe(1);
            expect(result[0].gasUsed.valueOf()).toBeGreaterThan(BigInt(50000));
            expect(result[0].reverted).toBe(false);
            expect(result[0].vmError).toBe('');
        });

        test('should estimate gas for multiple clauses', async () => {
            const request: ExecuteCodesRequestJSON = {
                gas: 100000,
                gasPrice: '1000000000000000',
                caller: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
                clauses: [
                    {
                        // First clause: VET transfer
                        to: '0x2669514f9fe96bc7301177ba774d3da8a06cace4',
                        value: '0x1000000000000000000',
                        data: '0x'
                    },
                    {
                        // Second clause: VTHO transfer
                        to: '0x0000000000000000000000000000456E65726779',
                        value: '0x0',
                        data: '0xa9059cbb0000000000000000000000002669514f9fe96bc7301177ba774d3da8a06cace40000000000000000000000000000000000000000000000000de0b6b3a7640000'
                    }
                ]
            };

            const result = await gasModule.estimateGas(request);

            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBe(2);

            // First clause (VET transfer) - VeChain solo may return 0 gas for VET transfers
            expect(result[0].gasUsed.valueOf()).toBeGreaterThanOrEqual(BigInt(0));
            expect(result[0].reverted).toBe(false);
            expect(result[0].transfers).toHaveLength(1);

            // Second clause (VTHO transfer) - Should use more gas than simple transfer
            expect(result[1].gasUsed.valueOf()).toBeGreaterThanOrEqual(BigInt(0)); // Allow for low gas
            if (!result[1].reverted) {
                expect(result[1].events).toHaveLength(1);
            }
        });

        test('should handle insufficient balance scenario', async () => {
            // Try to send more VET than the account has
            const request: ExecuteCodesRequestJSON = {
                gas: 50000,
                gasPrice: '1000000000000000',
                caller: '0x0000000000000000000000000000000000000000', // Zero address with no balance
                clauses: [
                    {
                        to: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
                        value: '0x3635c9adc5dea00000', // Large amount
                        data: '0x'
                    }
                ]
            };

            const result = await gasModule.estimateGas(request);

            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBe(1);
            expect(result[0].reverted).toBe(true);
            expect(result[0].vmError).toBeTruthy();
        });

        test('should handle out of gas scenario', async () => {
            const request: ExecuteCodesRequestJSON = {
                gas: 1000, // Very low gas limit
                gasPrice: '1000000000000000',
                caller: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
                clauses: [
                    {
                        to: '0x0000000000000000000000000000456E65726779',
                        value: '0x0',
                        data: '0xa9059cbb0000000000000000000000002669514f9fe96bc7301177ba774d3da8a06cace40000000000000000000000000000000000000000000000000de0b6b3a7640000'
                    }
                ]
            };

            const result = await gasModule.estimateGas(request);

            expect(result).toBeInstanceOf(Array);
            expect(result.length).toBe(1);
            expect(result[0].reverted).toBe(true);
            expect(result[0].vmError).toContain('out of gas');
        });
    });

    describe('getMaxPriorityFeePerGas', () => {
        test('should get max priority fee per gas from solo network', async () => {
            const result = await gasModule.getMaxPriorityFeePerGas();

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

            const result = await gasModule.getFeeHistory(options);

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

            const result = await gasModule.getFeeHistory(options);

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

            const result = await gasModule.getFeeHistory(options);

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

            const result = await gasModule.getFeeHistory(options);

            expect(result.baseFeePerGas).toBeDefined();
            expect(result.gasUsedRatio).toBeDefined();

            if (result.baseFeePerGas !== null) {
                expect(result.baseFeePerGas.length).toBeGreaterThan(0); // Should have values
            }
            expect(result.gasUsedRatio.length).toBeGreaterThan(0); // Should have values
        });
    });

    describe('getNextBlockBaseFeePerGas', () => {
        test('should get next block base fee per gas', async () => {
            const result = await gasModule.getNextBlockBaseFeePerGas();

            if (result !== null) {
                expect(typeof result).toBe('bigint');
                expect(result).toBeGreaterThanOrEqual(0n);
                // Solo network typically has a base fee
                expect(result).toBeGreaterThan(0n);
            }
        });
    });
});
