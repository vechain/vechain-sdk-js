import { describe, expect, test } from '@jest/globals';
import { createPublicClient } from '@viem';
import { ThorNetworks } from '@thor/thorest';
import { ExecuteCodesRequestJSON } from '@thor/thorest/json';

/**
 * Test suite for PublicClient contract/call-related functionality
 *
 * Tests all contract interaction methods:
 * - call
 * - simulateCalls
 *
 * @group integration/clients
 */
describe('PublicClient - Contract/Call Methods', () => {
    const publicClient = createPublicClient({
        network: ThorNetworks.SOLONET
    });
    // Sample contract calls for testing
    const vthoBalanceCall: ExecuteCodesRequestJSON = {
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

    const multiClauseCall: ExecuteCodesRequestJSON = {
        clauses: [
            {
                to: '0x0000000000000000000000000000456E65726779', // VTHO contract
                value: '0x0',
                data: '0x18160ddd' // totalSupply function
            },
            {
                to: '0x0000000000000000000000000000456E65726779', // VTHO contract
                value: '0x0',
                data: '0x70a08231000000000000000000000000f077b491b355e64048ce21e3a6fc4751eeea77fa' // balanceOf function
            }
        ],
        caller: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
        gas: 50000
    };

    const transferCall: ExecuteCodesRequestJSON = {
        clauses: [
            {
                to: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                value: '0x1', // 1 wei
                data: '0x'
            }
        ],
        caller: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
        gas: 21000
    };

    describe('call', () => {
        test('should execute contract call successfully', async () => {
            const result = await publicClient.call(vthoBalanceCall);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);

            // Check first result
            const firstResult = result[0];
            expect(firstResult).toHaveProperty('data');
            expect(firstResult).toHaveProperty('gasUsed');
            expect(firstResult).toHaveProperty('reverted');

            console.log('Contract call result:', {
                data: firstResult.data,
                gasUsed: firstResult.gasUsed,
                reverted: firstResult.reverted
            });
        });

        test('should execute multi-clause contract call', async () => {
            const result = await publicClient.call(multiClauseCall);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2); // Should match number of clauses

            // Check both results
            result.forEach((clauseResult: any, index: number) => {
                expect(clauseResult).toHaveProperty('data');
                expect(clauseResult).toHaveProperty('gasUsed');
                expect(clauseResult).toHaveProperty('reverted');

                console.log(`Clause ${index} result:`, {
                    data: clauseResult.data,
                    gasUsed: clauseResult.gasUsed,
                    reverted: clauseResult.reverted
                });
            });
        });

        test('should handle transfer transaction call', async () => {
            const result = await publicClient.call(transferCall);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);

            const firstResult = result[0];
            expect(firstResult).toHaveProperty('data');
            expect(firstResult).toHaveProperty('gasUsed');
            expect(firstResult).toHaveProperty('reverted');

            // Transfer might revert in test environment due to insufficient balance
            console.log('Transfer call result:', {
                data: firstResult.data,
                gasUsed: firstResult.gasUsed,
                reverted: firstResult.reverted
            });
        });
    });

    describe('simulateCalls', () => {
        test('should simulate contract call successfully', async () => {
            const result = await publicClient.simulateCalls(vthoBalanceCall);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);

            // Check first result
            const firstResult = result[0];
            expect(firstResult).toHaveProperty('data');
            expect(firstResult).toHaveProperty('gasUsed');
            expect(firstResult).toHaveProperty('reverted');

            console.log('Contract simulation result:', {
                data: firstResult.data,
                gasUsed: firstResult.gasUsed,
                reverted: firstResult.reverted
            });
        });

        test('should simulate multi-clause contract call', async () => {
            const result = await publicClient.simulateCalls(multiClauseCall);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2); // Should match number of clauses

            // Check both results
            result.forEach((clauseResult: any, index: number) => {
                expect(clauseResult).toHaveProperty('data');
                expect(clauseResult).toHaveProperty('gasUsed');
                expect(clauseResult).toHaveProperty('reverted');

                console.log(`Simulation clause ${index} result:`, {
                    data: clauseResult.data,
                    gasUsed: clauseResult.gasUsed,
                    reverted: clauseResult.reverted
                });
            });
        });

        test('should produce same results as call method', async () => {
            const callResult = await publicClient.call(vthoBalanceCall);
            const simulateResult =
                await publicClient.simulateCalls(vthoBalanceCall);

            expect(callResult).toBeDefined();
            expect(simulateResult).toBeDefined();
            expect(callResult.length).toBe(simulateResult.length);

            // Results should be identical since both methods do the same thing in VeChain
            expect(callResult[0].data.toString()).toBe(
                simulateResult[0].data.toString()
            );
            expect(callResult[0].reverted).toBe(simulateResult[0].reverted);
        });
    });

    describe('error handling', () => {
        test('should handle invalid contract address', async () => {
            const invalidCall: ExecuteCodesRequestJSON = {
                clauses: [
                    {
                        to: '0x0000000000000000000000000000000000000000', // Zero address
                        value: '0x0',
                        data: '0x70a08231000000000000000000000000f077b491b355e64048ce21e3a6fc4751eeea77fa'
                    }
                ],
                caller: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                gas: 21000
            };

            const result = await publicClient.call(invalidCall);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);

            // Call to zero address might revert or return empty data
            const firstResult = result[0];
            expect(firstResult).toHaveProperty('reverted');

            console.log('Invalid address call result:', {
                data: firstResult.data,
                gasUsed: firstResult.gasUsed,
                reverted: firstResult.reverted
            });
        });

        test('should handle invalid function data', async () => {
            const invalidDataCall: ExecuteCodesRequestJSON = {
                clauses: [
                    {
                        to: '0x0000000000000000000000000000456E65726779', // VTHO contract
                        value: '0x0',
                        data: '0xdeadbeef' // Invalid function selector
                    }
                ],
                caller: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                gas: 21000
            };

            const result = await publicClient.call(invalidDataCall);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);

            // Invalid function call should typically revert
            const firstResult = result[0];
            expect(firstResult).toHaveProperty('reverted');

            console.log('Invalid data call result:', {
                data: firstResult.data,
                gasUsed: firstResult.gasUsed,
                reverted: firstResult.reverted
            });
        });

        test('should handle insufficient gas', async () => {
            const lowGasCall: ExecuteCodesRequestJSON = {
                clauses: [
                    {
                        to: '0x0000000000000000000000000000456E65726779', // VTHO contract
                        value: '0x0',
                        data: '0x70a08231000000000000000000000000f077b491b355e64048ce21e3a6fc4751eeea77fa'
                    }
                ],
                caller: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                gas: 1000 // Very low gas
            };

            const result = await publicClient.call(lowGasCall);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);

            // Low gas might cause revert or just use all available gas
            const firstResult = result[0];
            expect(firstResult).toHaveProperty('gasUsed');

            console.log('Low gas call result:', {
                data: firstResult.data,
                gasUsed: firstResult.gasUsed,
                reverted: firstResult.reverted
            });
        });
    });
});
