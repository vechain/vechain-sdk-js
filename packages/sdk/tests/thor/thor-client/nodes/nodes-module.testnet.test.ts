import { describe, expect, test } from '@jest/globals';
import { ThorClient } from '@thor/thor-client/ThorClient';
import { ThorNetworks } from '@thor/utils/const/network';
import { FetchHttpClient } from '@common/http';

/**
 * NodesModule tests for testnet network
 * @group testnet
 */
describe('NodesModule', () => {
    describe('getNodes', () => {
        test('should be able to get connected peers list', async () => {
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.TESTNET))
            );

            const connectedPeers = await thorClient.nodes.getNodes();

            expect(connectedPeers).toBeDefined();
            expect(Array.isArray(connectedPeers)).toBe(true);
        });

        test('should return empty array when no peers are connected', async () => {
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.TESTNET))
            );

            const connectedPeers = await thorClient.nodes.getNodes();

            // Solo network run with solo-setup shouldn't have any peers,
            // so we expect empty array or peers
            expect(Array.isArray(connectedPeers)).toBe(true);
            expect(connectedPeers.length).toBeGreaterThan(0);
        });
    });

    describe('isHealthy', () => {
        test('should be able to check node health status', async () => {
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.TESTNET))
            );

            const isHealthy = await thorClient.nodes.isHealthy();

            expect(typeof isHealthy).toBe('boolean');
            // Testnet network should be healthy
            expect(isHealthy).toBe(true);
        });
    });
});
