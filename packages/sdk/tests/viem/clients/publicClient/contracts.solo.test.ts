/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, test } from '@jest/globals';
import { createPublicClient } from '@viem/clients';
import { log } from '@common/logging';
import {
    Clause,
    type SimulateTransactionOptions
} from '@thor/thor-client/model/transactions';
import { Address, Hex } from '@common/vcdm';
import { ThorNetworks } from '@thor/utils/const/network';

/**
 * Test suite for PublicClient contract/call-related functionality
 *
 * Tests all contract interaction methods:
 * - call
 * - simulateCalls
 *
 * @group solo/viem/clients
 */
describe('PublicClient - Contract/Call Methods', () => {
    const publicClient = createPublicClient({
        network: ThorNetworks.SOLONET
    });
    // Sample contract calls for testing
    const vthoBalanceClause = new Clause(
        Address.of('0x0000000000000000000000000000456E65726779'),
        0n,
        Hex.of(
            '0x70a08231000000000000000000000000f077b491b355e64048ce21e3a6fc4751eeea77fa'
        )
    );
    // Options for simulating the vtho balance call
    const vthoBalanceSimulateOptions = {
        gas: 21000n,
        caller: Address.of('0xf077b491b355e64048ce21e3a6fc4751eeea77fa')
    };
    describe('call', () => {
        test('should execute contract call successfully', async () => {
            const result = await publicClient.call(vthoBalanceClause);

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(false);

            // Check first result
            const firstResult = result;
            expect(firstResult).toHaveProperty('data');
            expect(firstResult).toHaveProperty('gasUsed');
            expect(firstResult).toHaveProperty('reverted');

            log.debug({
                message: 'Contract call result',
                context: {
                    data: firstResult.data,
                    gasUsed: firstResult.gasUsed,
                    reverted: firstResult.reverted
                }
            });
        });

        test('should handle transfer transaction call', async () => {
            const result = await publicClient.call(
                vthoBalanceClause,
                vthoBalanceSimulateOptions
            );

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(false);

            expect(result).toHaveProperty('data');
            expect(result).toHaveProperty('gasUsed');
            expect(result).toHaveProperty('reverted');
        });
    });

    describe('simulateCalls', () => {
        test('should simulate contract call successfully', async () => {
            const result = await publicClient.simulateCalls(
                [vthoBalanceClause],
                vthoBalanceSimulateOptions
            );

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);

            // Check first result
            const firstResult = result[0];
            expect(firstResult).toHaveProperty('data');
            expect(firstResult).toHaveProperty('gasUsed');
            expect(firstResult).toHaveProperty('reverted');

            log.debug({
                message: 'Contract simulation result',
                context: {
                    data: firstResult.data,
                    gasUsed: firstResult.gasUsed,
                    reverted: firstResult.reverted
                }
            });
        });

        test('should simulate multi-clause contract call', async () => {
            const result = await publicClient.simulateCalls(
                [vthoBalanceClause, vthoBalanceClause],
                vthoBalanceSimulateOptions
            );

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2); // Should match number of clauses

            // Check both results
            result.forEach((clauseResult: any, index: number) => {
                expect(clauseResult).toHaveProperty('data');
                expect(clauseResult).toHaveProperty('gasUsed');
                expect(clauseResult).toHaveProperty('reverted');

                log.debug({
                    message: `Simulation clause ${index} result`,
                    context: {
                        data: clauseResult.data,
                        gasUsed: clauseResult.gasUsed,
                        reverted: clauseResult.reverted
                    }
                });
            });
        });

        test('should produce same results as call method', async () => {
            const callResult = await publicClient.call(
                vthoBalanceClause,
                vthoBalanceSimulateOptions
            );
            const simulateResult = await publicClient.simulateCalls(
                [vthoBalanceClause],
                vthoBalanceSimulateOptions
            );

            expect(callResult).toBeDefined();
            expect(simulateResult).toBeDefined();
            expect(simulateResult.length).toBe(1);

            // Results should be identical since both methods do the same thing in VeChain
            expect(callResult.data.toString()).toBe(
                simulateResult[0].data.toString()
            );
            expect(callResult.reverted).toBe(simulateResult[0].reverted);
        });
    });

    describe('error handling', () => {
        test('should handle invalid contract address', async () => {
            const clauses = new Clause(
                Address.of('0x0000000000000000000000000000000000000000'), // Zero address
                0n,
                Hex.of(
                    '0x70a08231000000000000000000000000f077b491b355e64048ce21e3a6fc4751eeea77fa'
                )
            );
            const options: SimulateTransactionOptions = {
                gas: 21000n,
                caller: Address.of('0xf077b491b355e64048ce21e3a6fc4751eeea77fa')
            };
            const result = await publicClient.call(clauses, options);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('reverted');
        });

        test('should handle invalid function data', async () => {
            const clauses = new Clause(
                Address.of('0x0000000000000000000000000000456E65726779'), // VTHO contract
                0n,
                Hex.of('0xdeadbeef') // Invalid function selector
            );
            const options: SimulateTransactionOptions = {
                gas: 21000n,
                caller: Address.of('0xf077b491b355e64048ce21e3a6fc4751eeea77fa')
            };
            const result = await publicClient.call(clauses, options);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('reverted');
            expect(result.reverted).toBe(true);
        });

        test('should handle insufficient gas', async () => {
            const clauses = new Clause(
                Address.of('0x0000000000000000000000000000456E65726779'),
                0n,
                Hex.of(
                    '0x70a08231000000000000000000000000f077b491b355e64048ce21e3a6fc4751eeea77fa'
                )
            );
            const options: SimulateTransactionOptions = {
                gas: 1000n,
                caller: Address.of('0xf077b491b355e64048ce21e3a6fc4751eeea77fa')
            };
            const result = await publicClient.call(clauses, options);
            expect(result).toBeDefined();
            expect(result).toHaveProperty('gasUsed');
            expect(result).toHaveProperty('reverted');
            expect(result.gasUsed).toBeGreaterThan(0);
        });
    });
});
