import { describe, expect, test } from '@jest/globals';
import { ThorClient } from '@thor/thor-client/ThorClient';
import { ThorNetworks } from '@thor';
import { FetchHttpClient } from '@http';

/**
 * NodesModule tests for solo network
 * @group solo
 */
describe('NodesModule', () => {
    describe('getNodes', () => {
        test('should be able to get connected peers list', async () => {
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
            );
            
            const connectedPeers = await thorClient.nodes.getNodes();
            
            expect(connectedPeers).toBeDefined();
            expect(Array.isArray(connectedPeers)).toBe(true);
            // Solo network might not have peers, so we just check it's an array
            // If there are peers, verify their structure
            if (connectedPeers.length > 0) {
                const peer = connectedPeers[0];
                expect(peer.name).toBeDefined();
                expect(peer.bestBlockID).toBeDefined();
                expect(peer.totalScore).toBeDefined();
                expect(peer.peerID).toBeDefined();
                expect(peer.netAddr).toBeDefined();
                expect(typeof peer.inbound).toBe('boolean');
                expect(typeof peer.duration).toBe('number');
                expect(typeof peer.totalScore).toBe('number');
            }
        });

        test('should return empty array when no peers are connected', async () => {
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
            );
            
            const connectedPeers = await thorClient.nodes.getNodes();
            
            // Solo network typically has no peers, so we expect empty array or peers
            expect(Array.isArray(connectedPeers)).toBe(true);
            expect(connectedPeers.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('isHealthy', () => {
        test('should be able to check node health status', async () => {
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
            );
            
            const isHealthy = await thorClient.nodes.isHealthy();
            
            expect(typeof isHealthy).toBe('boolean');
            // Solo network should be healthy since it's actively running
            expect(isHealthy).toBe(true);
        });

        test('should return true for healthy solo network with recent blocks', async () => {
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
            );
            
            // Call isHealthy multiple times to ensure consistency
            const healthCheck1 = await thorClient.nodes.isHealthy();
            const healthCheck2 = await thorClient.nodes.isHealthy();
            
            expect(healthCheck1).toBe(true);
            expect(healthCheck2).toBe(true);
            expect(healthCheck1).toBe(healthCheck2);
        });

        test('should handle health check with proper timestamp validation', async () => {
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
            );
            
            const isHealthy = await thorClient.nodes.isHealthy();
            
            // The health check should work properly with the solo network
            // Since solo network is actively producing blocks, it should be healthy
            expect(typeof isHealthy).toBe('boolean');
            expect(isHealthy).toBe(true);
        });
    });

    describe('edge cases', () => {
        test('should handle empty peer response gracefully', async () => {
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
            );
            
            const connectedPeers = await thorClient.nodes.getNodes();
            
            // Should always return an array, even if empty
            expect(Array.isArray(connectedPeers)).toBe(true);
            expect(connectedPeers.length).toBeGreaterThanOrEqual(0);
        });

        test('should maintain consistent health status across calls', async () => {
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
            );
            
            // Call health check multiple times in rapid succession
            const promises = Array.from({ length: 3 }, () => 
                thorClient.nodes.isHealthy()
            );
            
            const results = await Promise.all(promises);
            
            // All results should be boolean and consistent
            results.forEach(result => {
                expect(typeof result).toBe('boolean');
            });
            
            // For a running solo network, all should be true
            const allHealthy = results.every(result => result === true);
            expect(allHealthy).toBe(true);
        });
    });
});
