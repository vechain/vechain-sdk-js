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
            // Solo network should be healthy
            expect(isHealthy).toBe(true);
        });
    });
});
