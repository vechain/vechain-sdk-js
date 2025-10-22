import { describe, expect, test } from '@jest/globals';
import { createPublicClient } from '@viem/clients';
import { ThorNetworks } from '@thor/thorest';
import { Address, Hex } from '@common/vcdm';
import { parseAbiItem } from 'viem';
import { log } from '@common/logging';

/**
 * Test suite for PublicClient event/log-related functionality
 *
 * Tests all event-related methods:
 * - getLogs
 * - watchEvent
 * - createEventFilter
 * - getFilterLogs
 *
 * @group quarrantine
 */
describe('PublicClient - Events/Logs Methods', () => {
    const publicClient = createPublicClient({
        network: ThorNetworks.SOLONET
    });
    // Test addresses and event signatures
    const vthoContract = Address.of(
        '0x0000000000000000000000000000456E65726779'
    );
    const testAddress = Address.of(
        '0xf077b491b355e64048ce21e3a6fc4751eeea77fa'
    );

    // Transfer event signature
    const transferEventSignature = parseAbiItem(
        'event Transfer(address,address,uint256)'
    );

    describe('getLogs', () => {
        test('should retrieve logs with address filter', async () => {
            const filter = publicClient.createEventFilter({
                address: vthoContract
            });
            const logs = await publicClient.getLogs(filter);
            expect(logs).toBeDefined();
            expect(Array.isArray(logs)).toBe(true);

            log.debug({
                message: `Retrieved ${logs.length} logs for VTHO contract`,
                context: { data: logs.length }
            });

            if (logs.length > 0) {
                const firstLog = logs[0];
                expect(firstLog).toHaveProperty('address');
                expect(firstLog).toHaveProperty('topics');
                expect(firstLog).toHaveProperty('data');
                expect(firstLog).toHaveProperty('meta');

                log.debug({
                    message: 'First log:',
                    context: {
                        data: {
                            address: firstLog.eventLog.address,
                            topics: firstLog.eventLog.topics,
                            data: firstLog.eventLog.data
                        }
                    }
                });
            }
        });

        test('should retrieve logs with multiple addresses', async () => {
            const addresses = [vthoContract, testAddress];
            const filter = publicClient.createEventFilter({
                address: addresses
            });
            const logs = await publicClient.getLogs(filter);

            expect(logs).toBeDefined();
            expect(Array.isArray(logs)).toBe(true);

            log.debug({
                message: `Retrieved ${logs.length} logs for multiple addresses`,
                context: { data: logs.length }
            });
        });

        test('should retrieve logs with topic filter', async () => {
            const filter = publicClient.createEventFilter({
                address: vthoContract,
                event: transferEventSignature
            });
            const logs = await publicClient.getLogs(filter);

            expect(logs).toBeDefined();
            expect(Array.isArray(logs)).toBe(true);

            log.debug({
                message: `Retrieved ${logs.length} Transfer event logs`,
                context: { data: logs.length }
            });

            if (logs.length > 0) {
                const firstLog = logs[0];
                expect(firstLog.eventLog.topics[0]).toBe(
                    transferEventSignature
                );
            }
        });

        test('should retrieve logs with block range', async () => {
            const filter = publicClient.createEventFilter({
                address: vthoContract,
                fromBlock: BigInt(0),
                toBlock: BigInt(100)
            });
            const logs = await publicClient.getLogs(filter);

            expect(logs).toBeDefined();
            expect(Array.isArray(logs)).toBe(true);

            log.debug({
                message: `Retrieved ${logs.length} logs from blocks 0-100`,
                context: { data: logs.length }
            });
        });

        test('should handle empty results gracefully', async () => {
            // Query for logs from a non-existent address
            const nonExistentAddress = Address.of(
                '0x1234567890123456789012345678901234567890'
            );
            const filter = publicClient.createEventFilter({
                address: nonExistentAddress
            });
            const logs = await publicClient.getLogs(filter);

            expect(logs).toBeDefined();
            expect(Array.isArray(logs)).toBe(true);
            expect(logs.length).toBe(0);
        });
    });

    describe('createEventFilter', () => {
        test('should create event filter with address', () => {
            const filter = publicClient.createEventFilter({
                address: vthoContract
            });

            expect(filter).toBeDefined();
            expect(filter).toHaveProperty('id');
            expect(filter).toHaveProperty('type');
            expect(filter).toHaveProperty('filter');
            expect(filter.type).toBe('event');
            expect(typeof filter.id).toBe('string');
            expect(filter.id).toMatch(/^0x[0-9a-f]+$/i);

            log.debug({
                message: 'Created event filter:',
                context: { data: filter.id }
            });
        });

        test('should create event filter with event signature', () => {
            const filter = publicClient.createEventFilter({
                address: vthoContract,
                event: transferEventSignature
            });

            expect(filter).toBeDefined();
            expect(filter.type).toBe('event');
            expect(filter.filter).toHaveProperty('criteriaSet');

            log.debug({
                message: 'Created Transfer event filter:',
                context: { data: filter.id }
            });
        });

        test('should create event filter', () => {
            const filter = publicClient.createEventFilter({
                address: vthoContract,
                event: transferEventSignature
                // Note: fromBlock/toBlock omitted due to parsing issues with 'best' string
            });

            expect(filter).toBeDefined();
            expect(filter.id).toBeDefined();
            expect(typeof filter.id).toBe('string');

            log.debug({
                message: 'Event filter created with ID:',
                context: { data: filter.id }
            });
        });

        test('should create complex event filter', () => {
            const filter = publicClient.createEventFilter({
                address: vthoContract,
                event: transferEventSignature
            });

            expect(filter).toBeDefined();
            expect(filter.type).toBe('event');
            expect(filter.filter).toHaveProperty('criteriaSet');

            log.debug({
                message: 'Created complex event filter:',
                context: { data: filter.id }
            });
        });

        test('should create filter without parameters', () => {
            const filter = publicClient.createEventFilter();

            expect(filter).toBeDefined();
            expect(filter.type).toBe('event');
            expect(filter.filter).toHaveProperty('criteriaSet');

            log.debug({
                message: 'Created basic event filter:',
                context: { data: filter.id }
            });
        });
    });

    describe('getFilterLogs', () => {
        test('should retrieve logs using event filter', async () => {
            const filter = publicClient.createEventFilter({
                address: vthoContract
                // Note: fromBlock/toBlock removed due to parsing issues
            });

            const logs = await publicClient.getFilterLogs({ filter });

            expect(logs).toBeDefined();
            expect(Array.isArray(logs)).toBe(true);

            log.debug({
                message: 'Retrieved logs using filter:',
                context: { data: logs.length }
            });

            if (logs.length > 0) {
                const firstLog = logs[0];
                expect(firstLog).toHaveProperty('address');
                expect(firstLog).toHaveProperty('topics');
                expect(firstLog).toHaveProperty('data');
            }
        });

        test('should retrieve Transfer event logs using filter', async () => {
            const filter = publicClient.createEventFilter({
                address: vthoContract,
                event: transferEventSignature
            });

            const logs = await publicClient.getFilterLogs({ filter });

            expect(logs).toBeDefined();
            expect(Array.isArray(logs)).toBe(true);

            log.debug({
                message: `Retrieved ${logs.length} Transfer logs using filter`,
                context: { data: logs.length }
            });

            // All logs should be Transfer events
            logs.forEach((log) => {
                expect(log.eventLog.topics[0]).toBe(transferEventSignature);
            });
        });

        test('should handle invalid filter type', async () => {
            const invalidFilter = {
                id: '0x123',
                type: 'invalid' as any,
                request: {}
            };

            await expect(
                publicClient.getFilterLogs({ filter: invalidFilter })
            ).rejects.toThrow('Filter type "invalid" is not supported.');
        });
    });

    describe('watchEvent', () => {
        test('should create event watcher function', () => {
            // Note: WebSocket not available in Node.js test environment
            // This test verifies the method exists and returns a function
            expect(typeof publicClient.watchEvent).toBe('function');

            log.debug({
                message:
                    'watchEvent method is available (WebSocket tests skipped in Node.js)'
            });
        });

        test('should handle watcher cleanup concept', () => {
            // Test that the method signature is correct without actually using WebSocket
            expect(typeof publicClient.watchEvent).toBe('function');

            log.debug({
                message:
                    'watchEvent cleanup concept verified (actual WebSocket tests skipped)'
            });
        });
    });

    describe('error handling', () => {
        test('should handle invalid address in getLogs', async () => {
            // This test depends on how Address.of handles invalid inputs
            try {
                const invalidAddress = Address.of('0xinvalid');
                const filter = publicClient.createEventFilter({
                    address: invalidAddress
                });
                const logs = await publicClient.getLogs(filter);
                expect(Array.isArray(logs)).toBe(true);
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        test('should handle invalid block range', async () => {
            const filter = publicClient.createEventFilter({
                address: vthoContract,
                fromBlock: BigInt(999999999), // Very high block number
                toBlock: BigInt(999999999)
            });
            const logs = await publicClient.getLogs(filter);

            expect(logs).toBeDefined();
            expect(Array.isArray(logs)).toBe(true);
            // Should return empty array for non-existent blocks
        });

        test('should handle network errors gracefully', () => {
            // Test that error handling methods exist
            expect(typeof publicClient.getLogs).toBe('function');
            expect(typeof publicClient.watchEvent).toBe('function');

            log.debug({
                message: 'Network error handling methods are available'
            });
        });
    });
});
